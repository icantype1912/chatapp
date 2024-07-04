import React from "react";
import {Contacts} from "../components/Contacts";
import {Messages} from "../components/Messages";
import { useState } from "react";

const Home = (props) => {
  const { user, setUser } = props;
  const [receiver, setReceiver] = useState("groupchat");
  return (
    <div id="grandparent-container">
      <div className="parent-container">
        <Contacts
          user={user}
          receiver={receiver}
          setReceiver={setReceiver}
        />
        <Messages user={user} setUser={setUser} receiver={receiver} />
      </div>
    </div>
  );
};

export default Home;
