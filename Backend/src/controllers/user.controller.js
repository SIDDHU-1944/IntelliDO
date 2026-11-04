import { User } from "../models/user.model.js";
import { Task, List } from "../models/tasks.model.js";
import bcrypt from "bcrypt";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { extractTask, getAutoCompletions } from "../../AI.js";

const login = async (req, res) => {
  let { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: " enter valid credentials" });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "User Not Found" });
    }

    let isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (isPasswordCorrect) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res
        .cookie("token", token, {
          httpOnly: true,
          secure: true,
          // sameSite: "lax", // Allows cookie across ports on same origin (for localhost)
          sameSite: "none",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .status(httpStatus.OK)
        .json({
          message: "login successful",
          user: { id: user._id, email: user.email },
        });
    } else {
      res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "invalid username or password" });
    }
  } catch (err) {
    return res.json({ message: `something went wrong ${err}` });
  }
};

const register = async (req, res) => {
  let { name, username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(httpStatus.CONFLICT)
        .json({ message: "user already exists" });
    }

    let hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name,
      username: username,
      password: hashedPassword,
      email: email,
    });

    await newUser.save();

    res.status(httpStatus.CREATED).json({
      message: "user created!",
      user: { id: newUser._id, email: newUser.email },
    });
  } catch (err) {
    res.json({ message: `something went wrong ${err}` });
  }
};

const logout = async (req, res) => {
  // console.log(req.cookie);
  res.clearCookie("token").json({ message: "user logged out!" });
};

const getUser = async (req, res) => {
  // console.log(`getUser respone:`, req.user, req.lists, req.tasks);
  try {
    const quote = await getQuote();
    res.json({ user: req.user, tasks: req.tasks, lists: req.lists, quote , progress: req.progress});
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user or quote." });
  }
};

// tasks:

const addTask = async (req, res) => {
  let { title, time, done, category } = req.body;
  if (!title || !time) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "title and time are required" });
  }
  try {
    const newTask = new Task({
      text: title,
      due: time,
      done: done ? done : false,
      userId: req.userId,
      category: category ? category : "undefined",
    });

    await newTask.save();
    console.log(newTask);
    res.status(httpStatus.CREATED).json({ message: "task created" });
  } catch (error) {
    res.json({ message: `something went wrong ${error}` });
  }
};

const addList = async (req, res) => {
  let { title, items, due, done } = req.body;
  if (!title || !due) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "title and due are required" });
  }
  try {
    const newList = new List({
      title,
      items,
      due,
      done: done ? done : false,
      userId: req.userId,
    });

    await newList.save();

    res.status(httpStatus.CREATED).json({ message: "list created" });
  } catch (error) {
    res.json({ message: `something went wrong ${error}` });
  }
};

//Home

const getQuote = async () => {
  try {
    const response = await fetch("https://zenquotes.io/api/today/[your_key]");
    const data = await response.json();
    // console.log(data);
    return data[0];
  } catch (error) {
    return { q: "Could not fetch quote.", a: "" };
  }
};


//aiTaskAddition

const handleAITask = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });
    const result = await extractTask(text);
    if (!result) return res.status(500).json({ error: "Failed to extract task" });

    const due = result.due ? new Date(result.due) : new Date();
    const category = result.category || "undefined";
    const userId = req.userId;

    const taskTexts = [];
    if (Array.isArray(result.taskItems) && result.taskItems.length > 0) {
      for (const item of result.taskItems) {
        if (item?.task) taskTexts.push(item.task);
      }
    }
    const singleText = result.task || result.title;
    if (singleText) taskTexts.push(singleText);
    if (taskTexts.length === 0) {
      return res.status(500).json({ error: "Failed to extract task text" });
    }

    const created = [];
    for (const taskText of taskTexts) {
      const newTask = new Task({
        text: taskText,
        due,
        done: false,
        userId,
        category,
      });
      await newTask.save();
      created.push(newTask);
    }

    res.status(201).json({
      message: created.length > 1 ? "AI tasks created" : "AI task created",
      tasks: created,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const updateTaskDone = async (req, res) => {
  const { done } = req.body;
  if (typeof done !== "boolean") {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "done must be a boolean" });
  }
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.taskId, userId: req.userId },
      { done },
      { new: true }
    );
    if (!task) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "task not found" });
    }
    res.json({ task });
  } catch (error) {
    res.json({ message: `something went wrong ${error}` });
  }
};

const updateListDone = async (req, res) => {
  const { done } = req.body;
  if (typeof done !== "boolean") {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "done must be a boolean" });
  }
  try {
    const list = await List.findOneAndUpdate(
      { _id: req.params.listId, userId: req.userId },
      { done },
      { new: true }
    );
    if (!list) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "list not found" });
    }
    res.json({ list });
  } catch (error) {
    res.json({ message: `something went wrong ${error}` });
  }
};

const AIsuggestions = async(req,res)=>{
  try {
    const {text} = req.body;
    const response= await getAutoCompletions(text);
    console.log("response:",response);
    res.json(response);
  } catch (err) {
    console.log("error:",err);
    res.status(500).json({ error: err?.message || "unknown error"});
  }
}

export {
  login,
  register,
  logout,
  getUser,
  addTask,
  addList,
  getQuote,
  handleAITask,
  AIsuggestions,
  updateTaskDone,
  updateListDone,
};
