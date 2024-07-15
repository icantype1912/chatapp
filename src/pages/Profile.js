import React, { useEffect, useState } from "react";
import "../App.css";
import {
  apiKey,
  authDomain,
  databaseURL,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
  projectId,
} from "../firebaseconfig.js";

import {
  collection,
  query,
  getFirestore,
  onSnapshot,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  databaseURL: databaseURL,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
  measurementId: measurementId,
};

initializeApp(firebaseConfig);

const db = getFirestore();

const Profile = (props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const { user } = props;

  useEffect(() => {
    const q = query(collection(db, "Users"), where("Name", "==", user.username));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setUserInfo({ ...doc.data(), id: doc.id });
      });
    });

    return () => unsubscribe();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      const userDoc = doc(db, "Users", userInfo.id);
      await updateDoc(userDoc, {
        Name: userInfo.Name,
        email: userInfo.email,
        Phone: userInfo.Phone,
        DOB: userInfo.DOB,
      });
    }
    setIsEditing(!isEditing);
  };

  return (
    <div id="profile-page" className="profile-container">
      <div className="profile-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <p>{userInfo.email}</p>
        </div>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <p>{userInfo.Name}</p>
        </div>
        <div className="form-group">
          <label htmlFor="dob">Date of Birth</label>
          {isEditing ? (
            <input
              type="date"
              id="dob"
              name="DOB"
              value={userInfo.DOB}
              onChange={handleChange}
            />
          ) : (
            <p>{userInfo.DOB}</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          {isEditing ? (
            <input
              type="tel"
              id="phone"
              name="Phone"
              value={userInfo.Phone}
              onChange={handleChange}
            />
          ) : (
            <p>{userInfo.Phone}</p>
          )}
        </div>
        <button type="button" className="btn btn-primary" onClick={handleEditToggle}>
          {isEditing ? "Save Changes" : "Edit"}
        </button>
      </div>
    </div>
  );
};

export default Profile;
