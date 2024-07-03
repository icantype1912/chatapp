import React, { useState, useRef } from "react";
import ContactList from "./ContactList";

const Contacts = (props) => {
  const scroller = useRef();
  const { user, receiver, setReceiver } = props;
  const [search, setSearch] = useState("");
  const [contactLoading, setContactLoading] = useState(false);
  return (
    <>
      <div className="left-container" ref={scroller}>
        <input
          type="text"
          className="search"
          placeholder="Search user"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        ></input>
        <ContactList
          user={user}
          receiver={receiver}
          setReceiver={setReceiver}
          scroller={scroller}
          setContactLoading={setContactLoading}
          search={search}
        />
        {contactLoading ? <span class="loader"></span> : <></>}
      </div>
    </>
  );
};

export default Contacts;
