import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import styles from "./AllTasks.module.css";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Divider from "@mui/material/Divider";

export default function AllTasks() {
  const { userData, toggleTaskDone, toggleListDone } = useContext(AuthContext);
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

  const todayStr = formDate(date);
  const today = new Date().setHours(0, 0, 0, 0);
  const grouped = {};

  userData?.tasks?.forEach((task) => {
    const taskDateObj = new Date(task.due);
    taskDateObj.setHours(0, 0, 0, 0);
    if (taskDateObj.getTime() >= today) {
      const taskDateStr = formDate(taskDateObj);
      if (taskDateStr !== todayStr) {
        if (!grouped[taskDateStr])
          grouped[taskDateStr] = { tasks: [], lists: [] };
        grouped[taskDateStr].tasks.push(task);
      }
    }
  });

  console.log("grouped:", grouped);

  userData?.lists?.forEach((list) => {
    const listDateObj = new Date(list.due);
    listDateObj.setHours(0, 0, 0, 0);
    if (listDateObj.getTime() >= today) {
      const listDateStr = formDate(listDateObj);
      if (listDateStr !== todayStr) {
        if (!grouped[listDateStr])
          grouped[listDateStr] = { tasks: [], lists: [] };
        grouped[listDateStr].lists.push(list);
      }
    }
  });

  return (
    <div className={styles.HomeMaincontainer}>
      <div className={styles.taskMain}>
        <h1>All Tasks</h1>
        <div>
          <h2>Today</h2>
          <Divider />
          {/* <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h3>Tasks</h3>
            <h3>Due</h3>
            <h3>Status</h3>
          </div> */}
          <div className={styles.dayRow}>
            <div className={styles.dayCard}>
              <div className={styles.taskContainer}>
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
            </div>
            <div className={styles.listsCard}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <h3>Lists</h3>
                  <AssignmentOutlinedIcon />
                </div>
                <hr />
                {userData?.lists
                    ?.filter((list) => formDate(date) === formDate(list.due))
                    .map((list) => (
                  <ul key={list._id}>
                    <div style={{ display: "flex", alignItems: "center"}}>
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
                    <ul style={{marginLeft:"2rem"}}>
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
          </div>
        <hr />
        {Object.entries(grouped).map(([dateStr, { tasks, lists }]) => (
          <div key={dateStr} className={styles.dayRow}>
            <div className={styles.dayCard}>
              <h3>
                {days[new Date(tasks[0].due).getDay()]} ({dateStr})
              </h3>
              <div className={styles.taskContainer}>
                <ul>
                  {tasks.map((task) => (
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
                        <h5>{task.text}</h5>
                      </div>
                      <h5>{formTime(task.due)}</h5>
                      <h5 className={task.done ? styles.done : styles.pending}>
                        {task.done ? "done" : "pending"}
                      </h5>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className={styles.listsCard}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <h3>Lists</h3>
                <AssignmentOutlinedIcon />
              </div>
              <hr />
              {lists.map((list) => (
                <ul key={list._id}>
                  <div style={{ display: "flex", alignItems: "center"}}>
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
                  <ul style={{marginLeft:"2rem"}}>
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
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}
