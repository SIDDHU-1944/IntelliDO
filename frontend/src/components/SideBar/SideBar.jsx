import styles from "./SideBar.module.css";
import "../../vars.css";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import Avatar from "@mui/material/Avatar";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import LabelIcon from "@mui/icons-material/Label";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TaskPopupForm from "../TaskPopUp/TaskPopUpForm";

export default function SideBar() {
  let [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const { userData, handleLogout, handleAddTask } = useContext(AuthContext);
  const [showForm, setShowForm] = useState(false);

  const router = useNavigate();

  const handleAvatarClick = (e) => {
    if (Boolean(anchorEl)) {
      setAnchorEl(null);
    } else {
      setAnchorEl(e.currentTarget);
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleNavigate = (path) => {
    handleMenuClose();
    router(path);
  };

  const handlelogout = () => {
    handleLogout();
  };

  const handleOpen = () => {
    setOpen(!open);
  };
  return (
    <>
      {/* {open && window.innerWidth < 800 && (
        <div
          className={styles.sidebarBackdrop}
          onClick={() => setOpen(false)}
        />
      )} */}
      <div
        className={`${styles.SideBar} ${open ? styles.open : styles.closed}`}
      >
        <div className={styles.top}>
          <div className={styles.username}>
            <Avatar
              alt={userData?.user?.username || "User"}
              src=""
              className={styles.Avatar}
              onClick={handleAvatarClick}
            />
            <div>
              <p>{userData?.user?.username || "Guest"}</p>
            </div>
          </div>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          >
            <MenuItem
              onClick={() => {
                handleNavigate("/profile");
              }}
            >
              Profile
            </MenuItem>
            <MenuItem onClick={handlelogout}>Logout</MenuItem>
          </Menu>
          {open && (
            <IconButton
              onClick={handleOpen}
              className={styles.sidebarToggleBtn}
            >
              <KeyboardDoubleArrowLeftIcon />
            </IconButton>
          )}
        </div>
        <div className={styles.container}>
          <div className={styles.utils}>
            <button
              className={`${styles.addTask} ${styles.bar}`}
              onClick={() => {
                setShowForm(!showForm);
              }}
            >
              <AddOutlinedIcon />
              <h3>Add a Task</h3>
            </button>
            <button className={styles.bar} onClick={()=>{router("/Home")}}>
              <HomeFilledIcon/>
              <h4>Home</h4>
            </button>
            <hr />
          </div>
          <div className={styles.workspace}>
            <p>
              <b>Workspace</b>
            </p>
            <button className={styles.bar} onClick={()=>{router('/AllTasks')}}>
              <LabelIcon />
              <h4>All Tasks</h4>
            </button>
            <button className={styles.bar}>
              <AssignmentOutlinedIcon />
              <h4>Tasks</h4>
            </button>
            <button className={styles.bar}>
              <EditNoteOutlinedIcon />
              <h4>Notes</h4>
            </button>
            <hr />
          </div>
          <div className={styles.lists}>
            <p>
              <b>Lists</b>
            </p>

            {userData?.lists?.map((list) => (
              <button key={list._id} className={styles.bar}>
                <ArrowRightAltIcon />
                {list.title}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.newList}>
          <div>
            <AddOutlinedIcon />
            <h3>New List</h3>
          </div>
          <FormatListBulletedOutlinedIcon />
        </div>
        <TaskPopupForm
          open={showForm}
          setOpen={setShowForm}
          onAdd={({ title, due }) =>
            handleAddTask({ title, due, userId: userData.user._id })
          }
        />
      </div>

      {!open &&(
        <IconButton
          onClick={handleOpen}
          className={styles.floatingToggleBtn}
          style={{
            position: "fixed",
            top: 24,
            left: 16,
            zIndex: 1300,
            background: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <KeyboardDoubleArrowRightIcon />
        </IconButton>
      )}
    </>
  );
}
