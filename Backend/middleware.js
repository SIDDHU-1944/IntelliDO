import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import { User } from "./src/models/user.model.js";
import { List, Task } from "./src/models/tasks.model.js";

const requireAuth = async (req, res, next) => {
  // console.log(req);
  let token = req.cookies.token;
  if (!token) {
    return res
      .status(httpStatus.UNAUTHORIZED) 
      .json({ message: " must login first!" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded.userId);
    req.userId = decoded.userId;
    const user = await User.findById(decoded.userId).select("-password");
    const lists = await List.find({ userId: decoded.userId }).sort({ due: 1 });
    const tasks = await Task.find({ userId: decoded.userId }).sort({ due: 1 });
    if (!user) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: " user not found!" });
    }
    req.user = user;
    req.lists = lists;
    req.tasks = tasks;
    req.progress = user.progress || [];
    next();
  } catch (err) {
    res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: "please login again!!" });
  }
};

const getYesterdayDateString = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0]; // "2025-06-20"
};

const progress = async (req, res, next) => {
  const yesterday = getYesterdayDateString();
  console.log("progress hello!");
  let token = req.cookies.token;
  if (!token) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: " must login first!" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded.userId);
    req.userId = decoded.userId;
    const user = await User.findById(decoded.userId).select("-password");
    const lists = await List.find({ userId: decoded.userId }).sort({ due: 1 });
    const tasks = await Task.find({ userId: decoded.userId }).sort({ due: 1 });
    if (!user) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: " user not found!" });
    }
    // Get all yesterday's tasks
    const alreadyExists = user.progress?.some(
      (entry) => new Date(entry.date).toISOString().split("T")[0] === yesterday
    );

    if (!alreadyExists) {
      const yTasks = tasks.filter((t) =>
        t.due.toISOString().startsWith(yesterday)
      );
      const yLists = lists.filter((l) =>
        l.due.toISOString().startsWith(yesterday)
      );

      const total = yTasks.length + yLists.length;
      const done =
        yTasks.filter((t) => t.done).length +
        yLists.filter((l) => l.done).length;
      const percentage = total > 0 ? (done / total) * 100 : 0;

      // Save to user progress
      await User.findByIdAndUpdate(decoded.userId, {
        $push: {
          progress: {
            date: new Date(yesterday),
            percentage,
          },
        },
      });

      // Delete yesterday's tasks and lists
      const yTaskIds = yTasks.map((t) => t._id);
      const yListIds = yLists.map((l) => l._id);

      await Task.deleteMany({ _id: { $in: yTaskIds } });
      await List.deleteMany({ _id: { $in: yListIds } });

      console.log(
        `🗑️ Deleted ${yTaskIds.length} tasks and ${yListIds.length} lists for ${yesterday}`
      );
    }
    req.user = user;
    req.lists = lists;
    req.tasks = tasks;
    next();
  } catch (err) {
    console.log(err);
    res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: "please login again!!" });
  }
};

export { requireAuth, progress };
