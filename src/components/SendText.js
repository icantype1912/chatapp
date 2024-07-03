import React from "react";
import SendIcon from "@mui/icons-material/Send";

const SendText = (props) => {
  const { handleSubmit, message, setMessage, handleSend } = props;
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
        <button onClick={handleSend}>
          <SendIcon fontSize="md" sx={{ transform: "rotate(-40deg)" }} />
        </button>
      </form>
    </div>
  );
};

export default SendText;
