import SideBar from "../components/SideBar/SideBar.jsx";
import "../App.css";
import AllTasks from "../components/AllTasks/AllTasks.jsx";
import LoadingPage from "./loading.jsx";
import ChatBot from "../components/ChatBot/ChatBot";

import { useState, useEffect } from "react";

export default function All() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate async operation (e.g., fetch data)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2second loading

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="HomeContainer">
      {/* <h1>hello</h1> */}
      <SideBar />
      <AllTasks />
      <ChatBot />
    </div>
  );
}
