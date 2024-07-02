import React from "react";

import "../App.css";
import LeftConatainer from "../components/left-container";
import RightConatainer from "../components/right-container";
import { useState } from "react";

const MainPage = (props) => {
  const { user, setUser } = props;
  const [receiver, setReceiver] = useState("groupchat");
  return (
    <div className="parent-container">
      <LeftConatainer
        user={user}
        receiver={receiver}
        setReceiver={setReceiver}
      />
      <RightConatainer user={user} setUser={setUser} receiver={receiver} />
    </div>
  );
};

export default MainPage;
