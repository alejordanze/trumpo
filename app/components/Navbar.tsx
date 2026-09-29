import { NavLink } from "react-router";
import { Music4 } from "lucide-react";
import { NotationSwitch } from "./NotationSwitch";

export function Navbar() {
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <NavLink to="/" className="brand">
          <Music4 size={24} />
          <span>Trumpo</span>
        </NavLink>
        <div className="nav-actions">
          <div className="nav-links">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active" : "")
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/lessons"
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active" : "")
              }
            >
              Lessons
            </NavLink>
          </div>
          <NotationSwitch />
        </div>
      </div>
    </nav>
  );
}
