import React, { useState } from "react";

// Component imports
import NavBarHeader from "../NavBarHeader/NavBarHeader";
import "./AboutUs.scss";

/**
 * About Us page component.
 *
 */

function AboutUs({}) {
  const [navToggled, setNavToggled] = useState(false);
  function handleToggle() {
    setNavToggled(!navToggled);
  }

  return (
    <div className="about-us">
      <NavBarHeader toggled={navToggled} handleToggle={handleToggle} />
      <div className="about-us-body">
        <h2>About Us</h2>
        <p>#atm is a web based notification app centered on making public meetings in the City of San José more accessible to community members. The project is a collaborative effort between Code for San José and Only in San José. Our goal is to help everyday residents find relevant information and connect to what's happening #atm in local government. We share the belief that local government should be more accessible and that is our aim with this new community and volunteer driven technology.
        </p>
        <h3>Mission</h3>
        <p>
        atm-app’s mission is to enable more accessible civic engagement and participation by informing and connecting people to what’s happening at the moment in their local government
        </p>
        <h3>Vision</h3>
        <p>
        We believe that thoughtfully designed technology can better enable the people’s right to instruct their representatives, petition the government for redress of grievances, and assemble freely to consult for the common good.
        </p>
        <h3>Values</h3>
        <ul>
          <li><span className="value"><u>Transparency</u>: </span>atm-app is a tool to increase transparency in process of local 
governance
          </li>
          <li><span className="value"><u>Trust</u>: </span>atm-app is a free open source technology designed to serve people</li>
          <li><span className="value"><u>Collaboration</u>: </span>atm-app is a collaborative effort between everyday residents and their 
local government</li>
          <li><span className="value"><u>Community</u>: </span>atm-app design is driven by community needs and input</li>
          <li><span className="value"><u>Accessibility</u>: </span>atm-app seeks to improve accessibility as we grow</li>
        </ul>
      </div>
    </div>
  );
}

export default AboutUs;
