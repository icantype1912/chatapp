import React, { useState } from "react";
import { ContactList } from "./ContactList";

export const Contacts = (props) => {
  const { user, receiver, setReceiver } = props;
  const [search, setSearch] = useState("");
  const [contactLoading, setContactLoading] = useState(false);
  return (
    <>
      <div className="left-container">
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
          setContactLoading={setContactLoading}
          search={search}
        />
        {contactLoading ? <span class="loader"></span> : <></>}
      </div>
    </>
  );
};
