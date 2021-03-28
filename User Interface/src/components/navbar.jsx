import React from "react";
import { NavLink } from "react-router-dom";

function Navbar({ title }) {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary ">
        <NavLink className="navbar-brand" to="/">
          {title}
        </NavLink>
      </nav>
    </div>
  );
}

export default Navbar;
