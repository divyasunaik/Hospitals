import React from "react";
import Navbar from "./navbar";
import UserInput from "./userinput";

function HomePage() {
  return (
    <div>
      <Navbar title="PATIENT INFORMATION" />
      <UserInput />
    </div>
  );
}

export default HomePage;
