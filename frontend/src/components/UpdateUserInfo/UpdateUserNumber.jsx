import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { getUserId } from "../../utils/verifyToken";
import { UPDATE_PHONE_NUMBER } from "../../graphql/graphql";

// Component imports
import NavBarHeader from "../NavBarHeader/NavBarHeader";

import "../UserAccountView/UserAccountView.scss";

const UpdateUserNumber = () => {
  const [navToggled, setNavToggled] = useState(false);
  const [newNumber, setNewNumber] = useState("");
  const [updateNumberSuccessful, setUpdateNumberSuccessful] = useState(false);

  const [updatePhoneNumber] = useMutation(UPDATE_PHONE_NUMBER);

  function handleToggle() {
    setNavToggled(!navToggled);
  }

  function handleSubmit(e) {
    e.preventDefault();
    updatePhoneNumber({
      variables: {
        id: getUserId(),
        phone_number: newNumber,
      },
    });

    setUpdateNumberSuccessful(true);
  }

  return (
    <div className="update-user-number-view">
      <NavBarHeader toggled={navToggled} handleToggle={handleToggle} />

      {updateNumberSuccessful ? (
        <div className="user-account-header">
          <p className="title">Phone number was successfully updated!</p>
        </div>
      ) : (
        <>
          <div className="user-account-header">
            <p className="title">Phone Number</p>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="phone-number"
              id="phone-number"
              name="phone-number"
              className="user-data-form"
              placeholder="Phone Number"
              onChange={(e) => setNewNumber(e.target.value)}
            />

            <button className="user-account-update-btn" type="submit">
              Change Phone Number
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default UpdateUserNumber;
