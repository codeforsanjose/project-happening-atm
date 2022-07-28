import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { getUserId } from "../../utils/verifyToken";
import { UPDATE_EMAIL } from "../../graphql/graphql";

// Component imports
import NavBarHeader from "../NavBarHeader/NavBarHeader";

import "../UserAccountView/UserAccountView.scss";

const UpdateUserEmail = () => {
  const [navToggled, setNavToggled] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [updateEmailSuccessful, setUpdateEmailSuccessful] = useState(false);

  const [updateEmail] = useMutation(UPDATE_EMAIL);

  function handleToggle() {
    setNavToggled(!navToggled);
  }

  function handleSubmit(e) {
    e.preventDefault();
    updateEmail({
      variables: {
        id: getUserId(),
        email: newEmail,
      },
    });

    setUpdateEmailSuccessful(true);
  }

  return (
    <div className="update-user-email-view">
      <NavBarHeader toggled={navToggled} handleToggle={handleToggle} />

      {updateEmailSuccessful ? (
        <div className="user-account-header">
          <p className="title">Phone number was successfully updated!</p>
        </div>
      ) : (
        <>
          <div className="user-account-header">
            <p className="title">Email</p>
          </div>

          <form
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              id="email"
              name="email"
              className="user-data-form"
              placeholder="Email"
              onChange={(event) => setNewEmail(event.target.value)}
            />
            <button className="user-account-update-btn" type="submit">
              Change Email
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default UpdateUserEmail;
