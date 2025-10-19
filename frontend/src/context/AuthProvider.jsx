import { useContext, createContext, useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import httpStatus from "http-status";
import LoadingPage from "../pages/loading";
import server from "../utils/environment";

const Client = axios.create({
  baseURL: `${server}/api/v1/users`,
  withCredentials: true,
});

const AuthProvider = ({ children }) => {
  // const authContext = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  // const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const router = useNavigate();

  useEffect(() => {
  const fetchData = async () => {
    try {
      console.log("hello effect1");
      const res1= await Client.get("/getProgress");
      console.log(res1.status);
      const response = await Client.get("/me");
      const { user, tasks, lists, quote, progress } = response.data;
      setUserData({ user, tasks, lists, quote, progress });
    } catch (error) {
      console.log("error of effect1:",error)
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

  useEffect(() => {
    console.log(userData); 
  }, [userData]);

  const handleLogin = async (username, password) => {
    try {
      let request = await Client.post("/login", {
        username: username,
        password: password,
      });

      if (request.status == httpStatus.OK) {
        let response = await Client.get("/me");
        const { user, tasks, lists, quote , progress} = response.data;
        setUserData({ user, tasks, lists, quote, progress });
        router("/home");
      }
    } catch (err) {
      throw err;
    }
  };

  const handleLogout = async () => {
    try {
      await Client.post("/logout");
      setUserData(null);
      router("/");
    } catch (error) {
      throw error;
    }
  };

  const handleRegister = async (name, username, email, password) => {
    try {
      let response = await Client.post("/register", {
        name: name,
        username: username,
        email: email,
        password: password,
      });

      if (
        response.status == httpStatus.FOUND ||
        response.status == httpStatus.CREATED
      ) {
        router("/login");
      }
    } catch (error) {
      throw error;
    }
  };

  const handleAddTask = async ({ title, due, userId }) => {
    try {
      console.log(title, due, userId);
      let response = await Client.post("/addTask", {
        title: title,
        time: due,
        userId,
      });

      if (response.status == httpStatus.CREATED) {
        console.log("task created");
        const updated = await Client.get("/me");
        const { user, tasks, lists } = updated.data;
        setUserData({ user, tasks, lists });
        router("/home");
      }
    } catch (error) {
      throw error;
    }
  };

  const toggleTaskDone = (taskId) => {
    setUserData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task._id === taskId ? { ...task, done: !task.done } : task
      ),
    }));
  };

  const toggleListDone = (listId) => {
    setUserData((prev) => ({
      ...prev,
      lists: prev.lists.map((list) =>
        list._id === listId ? { ...list, done: !list.done } : list
      ),
    }));
  };

  //For AI

  const extractTaskFromText = async (text) => {
    try {
      await Client.post("/aiAddTask", {
        text: text,
      });
      const updated = await Client.get("/me");
      const { user, tasks, lists } = updated.data;
      setUserData({ user, tasks, lists });
      return "task created!!";
    } catch (err) {
      console.log(err);
      return "AI is down now!!"
    }
  };

  const handleSuggestions = async (text) => {
    try {
      const res = await Client.post("/suggestions", {
        text,
      });
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log(error);
      return "AI Agent down😓"
    }
  };

  const data = {
    userData,
    handleLogin,
    handleRegister,
    handleLogout,
    loading,
    handleAddTask,
    toggleTaskDone,
    toggleListDone,
    extractTaskFromText,
    handleSuggestions,
    chatOpen,
    setChatOpen,
  };

  return (
    <AuthContext.Provider value={data}>
      {loading ? <LoadingPage /> : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
