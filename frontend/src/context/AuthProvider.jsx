import { useState, useEffect } from "react";
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

const mergeMeResponse = (payload) => {
  const { user, tasks, lists, quote, progress } = payload;
  return { user, tasks, lists, quote, progress };
};

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const router = useNavigate();

  const refreshUserData = async () => {
    const response = await Client.get("/me");
    setUserData((prev) => ({ ...prev, ...mergeMeResponse(response.data) }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Client.get("/getProgress");
        await refreshUserData();
      } catch (error) {
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogin = async (username, password) => {
    const request = await Client.post("/login", {
      username,
      password,
    });

    if (request.status === httpStatus.OK) {
      await refreshUserData();
      router("/Home");
    }
  };

  const handleLogout = async () => {
    await Client.post("/logout");
    setUserData(null);
    router("/");
  };

  const handleRegister = async (name, username, email, password) => {
    const response = await Client.post("/register", {
      name,
      username,
      email,
      password,
    });

    if (
      response.status === httpStatus.CONFLICT ||
      response.status === httpStatus.CREATED
    ) {
      router("/login");
    }
  };

  const handleAddTask = async ({ title, due }) => {
    const response = await Client.post("/addTask", {
      title,
      time: due,
    });

    if (response.status === httpStatus.CREATED) {
      await refreshUserData();
      router("/Home");
    }
  };

  const toggleTaskDone = async (taskId) => {
    const task = userData?.tasks?.find((t) => t._id === taskId);
    if (!task) return;
    const nextDone = !task.done;

    setUserData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t._id === taskId ? { ...t, done: nextDone } : t
      ),
    }));

    try {
      await Client.patch(`/tasks/${taskId}/done`, { done: nextDone });
    } catch {
      setUserData((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) =>
          t._id === taskId ? { ...t, done: task.done } : t
        ),
      }));
    }
  };

  const toggleListDone = async (listId) => {
    const list = userData?.lists?.find((l) => l._id === listId);
    if (!list) return;
    const nextDone = !list.done;

    setUserData((prev) => ({
      ...prev,
      lists: prev.lists.map((l) =>
        l._id === listId ? { ...l, done: nextDone } : l
      ),
    }));

    try {
      await Client.patch(`/lists/${listId}/done`, { done: nextDone });
    } catch {
      setUserData((prev) => ({
        ...prev,
        lists: prev.lists.map((l) =>
          l._id === listId ? { ...l, done: list.done } : l
        ),
      }));
    }
  };

  const extractTaskFromText = async (text) => {
    try {
      await Client.post("/aiAddTask", { text });
      await refreshUserData();
      return "task created!!";
    } catch (err) {
      console.log(err);
      return "AI is down now!!";
    }
  };

  const handleSuggestions = async (text) => {
    try {
      const res = await Client.post("/suggestions", { text });
      return res.data;
    } catch (error) {
      console.log(error);
      return "AI Agent down😓";
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
