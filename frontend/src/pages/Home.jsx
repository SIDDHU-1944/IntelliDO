import SideBar from "../components/SideBar/SideBar";
import LoadingPage from "./loading";
import styles from "../components/Home.module.css";
import ChatBot from "../components/ChatBot/ChatBot";
// import decode from "html-entities-decoder";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import { LineChart } from "@mui/x-charts/LineChart";

import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Divider } from "@mui/material";

export default function Home() {
  const [loading, setLoading] = useState(true);

  // if(loading) return <LoadingPage/>

  const [count, setCount] = useState(0);
  const [tasks, setTasks] = useState(0);
  const { userData, toggleTaskDone, toggleListDone } = useContext(AuthContext);
  const [chartData, setChartData] = useState({ dates: [], values: [] });
  const date = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let formDate = (dataString) => {
    const date = new Date(dataString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  let formTime = (dataString) => {
    const date = new Date(dataString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  };
  useEffect(() => {
    if (!userData) return;

    // Count today's tasks
    const todayTasks =
      userData.tasks?.filter((task) => formDate(date) === formDate(task.due)) ||
      [];

    // Count today's lists
    const todayLists =
      userData.lists?.filter((list) => formDate(date) === formDate(list.due)) ||
      [];

    // Count completed tasks and lists
    const doneTasks = todayTasks.filter((task) => task.done).length;
    const doneLists = todayLists.filter((list) => list.done).length;

    // Set total and completed counts (customize as needed)
    setTasks(todayTasks.length + todayLists.length);
    setCount(doneTasks + doneLists);
  }, [userData, date]);

  //chart
  useEffect(() => {
    if (!userData?.progress) return;

    const stats = userData.progress.filter(
      (s) => s.percentage !== undefined && !isNaN(s.percentage)
    );
    const recentStats = stats.slice(-10);
    const dates = recentStats.map((s) => new Date(s.date).toLocaleDateString());
    const values = recentStats.map((s) => s.percentage);

    setChartData({ dates, values });
  }, [userData]);

  // const stats = [
  //   { date: "2025-06-10", percentage: 50 },
  //   { date: "2025-06-11", percentage: 60 },
  //   { date: "2025-06-12", percentage: 70 },
  //   { date: "2025-06-13", percentage: 40 },
  //   { date: "2025-06-14", percentage: 90 },
  //   { date: "2025-06-15", percentage: 100 },
  // ];

  return (
    <>
      <SideBar />
      <div className={styles.HomeMainContainer}>
        <div className={styles.topPanel}>
          <div className={styles.quoteContainer}>
            <h1>{days[date.getDay()]}</h1>
            <blockquote>
              <h3>
                {userData?.quote?.q &&
                userData.quote.q !==
                  "Too many requests. Obtain an auth key for unlimited access."
                  ? userData.quote.q
                  : "No quote available."}
              </h3>
            </blockquote>
            <footer>-{userData.quote?.a || ""}</footer>
          </div>
          <div className={styles.analytics}>
            <h3>Your past 10 Days</h3>

            <div style={{ width: "100%", height: "90%" }}>
              {" "}
              {/* Or height: '100%' inside flexbox */}
              {chartData.values && chartData.values.length > 0 ? (
                <LineChart
                  xAxis={[
                    {
                      data: chartData.dates,
                      scaleType: "point",
                      label: "Date",
                    },
                  ]}
                  series={[{ data: chartData.values, label: "Completion %" }]}
                  width={undefined}
                  height={undefined}
                  grid={{ vertical: true, horizontal: true }}
                />
              ) : (
                <p style={{ textAlign: "center", margin: "2rem" }}>
                  No recent stats to display yet.
                </p>
              )}
            </div>
          </div>
        </div>
        <div style={{ width: "100%" }}>
          <Divider> Tasks </Divider>
        </div>
        <div className={styles.downPanel}>
          <div className={styles.taskAndList}>
            <div className={styles.taskCard}>
              <ul>
                {userData?.tasks
                  ?.filter((task) => formDate(date) === formDate(task.due))
                  .map((task) => (
                    <li key={task._id} className={styles.taskItem}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <button
                          style={{ border: "none", background: "transparent" }}
                          onClick={() => {
                            toggleTaskDone(task._id);
                          }}
                        >
                          {task.done ? (
                            <span>
                              <CheckBoxIcon style={{ fontSize: "medium" }} />
                            </span>
                          ) : (
                            <span>
                              <CheckBoxOutlineBlankIcon
                                style={{ fontSize: "medium" }}
                              />
                            </span>
                          )}
                        </button>
                        <p style={{ flex: 1 }}>{task.text}</p>
                      </div>
                      <h5>{formTime(task.due)}</h5>
                      <h5 className={task.done ? styles.done : styles.pending}>
                        {task.done ? "done" : "pending"}
                      </h5>
                    </li>
                  ))}
              </ul>
            </div>
            <div className={styles.listCard}>
              {userData?.lists
                ?.filter((list) => formDate(date) === formDate(list.due))
                .map((list) => (
                  <ul key={list._id}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <button
                        style={{ border: "none", background: "transparent" }}
                        onClick={() => {
                          toggleListDone(list._id);
                        }}
                      >
                        {list.done ? (
                          <span>
                            <CheckBoxIcon style={{ fontSize: "medium" }} />
                          </span>
                        ) : (
                          <span>
                            <CheckBoxOutlineBlankIcon
                              style={{ fontSize: "medium" }}
                            />
                          </span>
                        )}
                      </button>
                      <h4>{list.title.toUpperCase()}</h4>
                    </div>
                    <ul style={{ marginLeft: "2rem" }}>
                      {list.items.map((item) => (
                        <li
                          key={item._id}
                          style={{
                            listStyle: "none",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <p>{item.text.toLowerCase()}</p>
                        </li>
                      ))}
                    </ul>
                  </ul>
                ))}
            </div>
          </div>
          <div className={styles.scoreCard}>
            <h4>Tasks Done</h4>
            <Gauge
              value={tasks > 0 ? (count / tasks) * 100 : 0}
              startAngle={-110}
              endAngle={110}
              sx={{
                [`& .${gaugeClasses.valueText}`]: {
                  fontSize: 40,
                  transform: "translate(0px, 0px)",
                },
              }}
              text={`${count}/${tasks}`}
            />
          </div>
        </div>
        <ChatBot />
      </div>
    </>
  );
}
