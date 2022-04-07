import React, { useState } from "react";

// Component imports
import NavBarHeader from "../NavBarHeader/NavBarHeader";
import "./FAQ.scss";

/**
 * FAQ page component.
 *
 */

function FAQ({}) {
  const [navToggled, setNavToggled] = useState(false);
  function handleToggle() {
    setNavToggled(!navToggled);
  }

  return (
    <div className="FAQ">
      <NavBarHeader toggled={navToggled} handleToggle={handleToggle} />
      <div className="FAQ-body">
        <h2>FAQ</h2>
        <h3>What is #atm?</h3>
        <p>
          #atm is a web based notification app centered on making public
          meetings in the City of San José more accessible to community members.
          Currently, #atm will send you notifications via email or text for
          specific agenda items as they come up for discussion during public
          city council meetings in the City of San Jose
        </p>
        <h3>Is #atm free?</h3>
        <p>
          Yes - #atm is completely free! There are no costs to use, and there
          are no ads. However, message and data rates from your phone carrier
          may apply if you sign up for phone notifications.
        </p>
        <h3>Who developed #atm?</h3>
        <p>
          #atm was developed by a partnership of Code for San Jose and Only in
          San Jose
        </p>
        <h3>What information about me will #atm gather?</h3>
        <p>
          #atm will gather your email and/or phone number that you provide for
          account creation, no data will be stored on which agenda items you
          sign up for.
        </p>
        <h3>
          What information does Code for San Jose or City of San Jose see?
        </h3>
        <h3>What is the minimum operating system I need to use #atm?</h3>
        <p>
          The app can be accessed on a web browser, as any other website. For
          Zoom calls, you can visit their website to learn about{" "}
          <a href="https://support.zoom.us/hc/en-us/articles/201362023-Zoom-system-requirements-Windows-macOS-Linux">
            Zoom system requirements
          </a>
        </p>
        <h3>Does #atm require a Wi-Fi signal to use?</h3>
        <p>
          Internet connection is required to select meeting items for which to
          receive text or e-mail notifications. However, notifications will be
          sent once you are subscribed, irrespective of your internet
          connection.
        </p>
        <h3>Hearing From the Community</h3>
        <p>
          We’re eager to receive feedback from our community – feedback is a
          present which helps us improve. If you have any suggestions, please
          send us an email at{" "}
          <a href="mailto:sharedadmin@codeforsanjose.org">
            sharedadmin@codeforsanjose.org
          </a>
        </p>
      </div>
    </div>
  );
}

export default FAQ;
