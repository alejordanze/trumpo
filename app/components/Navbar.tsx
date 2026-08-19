import { NavLink } from "react-router";
import { Music4 } from "lucide-react";

export function Navbar() {
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <NavLink to="/" className="brand">
          <Music4 size={24} />
          <span>
            Trumpet<span className="gold-text">Trainer</span>
          </span>
        </NavLink>
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
      </div>
    </nav>
  );
}
