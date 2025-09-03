import { useState, useEffect, useContext, useCallback } from "react";
import AuthContext from "../../context/AuthContext";
import styles from "./ChatBot.module.css";

import { TextField, Dialog, DialogTitle, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import debounce from "lodash.debounce";

export default function ChatBot() {
  const { chatOpen, setChatOpen, extractTaskFromText, handleSuggestions } =
    useContext(AuthContext);

  const [input, setInput] = useState("");
  const [localSuggestion, setLocalSuggestion] = useState([]);
  const [message, setMessage] = useState("");

  const handleClose = () => {
    setChatOpen(false);
  };

  // Debounced suggestion fetch
  const debounced = useCallback(
    debounce(async (inputValue) => {
      const result = await handleSuggestions(inputValue);
      if (Array.isArray(result) && result.length > 0) {
        setLocalSuggestion(result);
      } else {
        setLocalSuggestion([]);
      }
    }, 350),
    [handleSuggestions]
  );

  useEffect(() => {
    return () => {
      debounced.cancel();
    };
  }, [debounced]);

  const handleChange = (e) => {
    const val = e.target.value;
    setInput(val);
    if (val.trim()) {
      debounced(val);
    } else {
      setLocalSuggestion([]);
      debounced.cancel();
    }
  };

  const applySuggestion = (suggestion) => {
    setInput(suggestion);
    setLocalSuggestion([]);
    debounced(suggestion);
  };

  const handleSend = async (text) => {
    let msg = await extractTaskFromText(text);
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 5000);
  };

  return (
    <div>
      <button
        className={styles.botButton}
        onClick={() => {
          setChatOpen(!chatOpen);
        }}
        aria-label="Open Chat"
      >
        <img src="/chatBot.png" alt="AI_AGENT" />
      </button>
      <Dialog
        onClose={handleClose}
        open={chatOpen}
        PaperProps={{
          sx: {
            width: "40vw",
            maxWidth: "400px",
            height: "40vh",
          },
        }}
      >
        <DialogTitle>
          TASKY
          <small style={{ fontSize: "0.5rem" }}>
            Command Tasky to add tasks
          </small>
        </DialogTitle>
        <div
          style={{
            position: "relative",
            marginBottom: "1.5rem",
            padding: "0 1rem",
            maxHeight: "60vh",
            display:"flex",
            flexDirection:"column",
          }}
        >
          <p>{message}</p>
          <div className={styles.input}>
            <TextField
              id="Task-input"
              placeholder="e.g. Gym at 6am"
              variant="standard"
              fullWidth
              value={input}
              onChange={handleChange}
            />
            <IconButton
              onClick={async () => {
                await handleSend(input);
                setInput("");
                setLocalSuggestion([]);
              }}
              disabled={!input.trim()}
            >
              <SendIcon />
            </IconButton>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width:"100%",
              maxHeight:"200px",
              overflowY: "scroll",
            }}
          >
            {localSuggestion.map((suggestion, index) => (
              <div
                key={index}
                className={styles.suggestion}
                onClick={() => applySuggestion(suggestion)}
              >
                <em>{suggestion}</em>
                <br />
              </div>
            ))}
          </div>
        </div>
      </Dialog>
    </div>
  );
}
