import { NavLink } from "react-router";
import { NotationSwitch } from "./NotationSwitch";
import { Logo } from "~/icons/Logo";

export function Navbar() {
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <NavLink to="/" className="brand">
          <Logo />
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
