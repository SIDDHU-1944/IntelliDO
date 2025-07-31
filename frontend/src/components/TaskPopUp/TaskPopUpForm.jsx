import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

import styles from "./TaskPopUpForm.module.css";

import { useState } from "react";

const TaskPopupForm = ({ open, setOpen, onAdd }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [date, setDate] = useState(null);

  const handleClose = () => {
    setTimeout(() => {
      setOpen(false);
      setTaskTitle("");
      setDate(null);
    }, 5); // delay enough to let focus move out
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // const data = new FormData(e.currentTarget);
    // console.log(data);
    // let title = data.get("taskTitle");
    // let due = data.get("Select Due Time");
    if (!taskTitle.trim()) return;
    onAdd({ title: taskTitle, due: date });
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      keepMounted
      slotProps={{ className: styles.dialogPaper }}
    >
      <DialogTitle className={styles.dialogTitle}>Add New Task</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent className={styles.dialogContent}>
          <TextField
            autoFocus
            fullWidth
            label="Task Title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            margin="dense"
            className={styles.textField}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DateTimePicker"]}>
              <DateTimePicker
                label="Select Due Time"
                value={date}
                onChange={setDate}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: "dense",
                    className: styles.dateTimePicker,
                  },
                  popper: {
                    modifiers: [
                      {
                        name: "offset",
                        options: {
                          offset: [300, -22], // Move popup 40px higher (adjust as needed)
                        },
                      },
                    ],
                  },
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            className={styles.addButton}
          >
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskPopupForm;
