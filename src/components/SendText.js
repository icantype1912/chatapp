import React, { useState } from "react";
import SendIcon from "@mui/icons-material/Send";

export const SendText = (props) => {
  const { handleSubmit, handleSend } = props;
  const [message, setMessage] = useState("");
  return (
    <div className="bottom">
      <form className="sendMes" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        ></input>
        <button
          onClick={() => {
            handleSend(message, setMessage);
          }}
        >
          <SendIcon fontSize="md" sx={{ transform: "rotate(-40deg)" }} />
        </button>
      </form>
    </div>
  );
};
