import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../reducers/authReducer";
// import useAuth from "../hooks/useAuth";
import SearchBar from "./SearchBar";
import NotificationBell from "./NotificationBell";
import imageUrl from "../utils/imageUrl";

const Navbar = () => {
  // const { isAuthenticated } = useAuth();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = !!user;
  
  console.log("Current User:", user);
  
  const logout = () => {
    localStorage.removeItem("token");
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm sticky-top"
    style={{
      zIndex: 3000,
      overFlow: "visible",}
    }
    >
      <div className="container">

        {/* Logo */}
        <Link className="navbar-brand fw-bold" to="/">
          Socialy
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Content */}
        <div className="collapse navbar-collapse" id="navbarNav">

          {/* Search */}
          {isAuthenticated && (
            <div className="my-3 my-lg-0 mx-lg-4 flex-grow-1">
              <SearchBar />
            </div>
          )}

          <ul className="navbar-nav ms-auto align-items-lg-center">

            {isAuthenticated ? (
              <>
                {/* Notification */}
                <li className="nav-item me-lg-3 position-relative">
                  <NotificationBell userId={user?._id} />
                </li>

                {/* Account */}
                <li className="nav-item dropdown">

                  <button
                    className="btn nav-link dropdown-toggle d-flex align-items-center border-0 bg-transparent"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      src={imageUrl(user?.profileImage)}
                      alt="Profile"
                      className="rounded-circle me-2"
                      style={{
                        width: "38px",
                        height: "38px",
                        objectFit: "cover",
                      }}
                    />

                    <span>{user?.username || "Account"}</span>
                  </button>

                  <ul
                    className="dropdown-menu dropdown-menu-end shadow"
                    aria-labelledby="userDropdown"
                  >
                    <li>
                      <Link
                        className="dropdown-item"
                        to={`/profile/${user?._id}`}
                      >
                        Profile
                      </Link>
                    </li>

                    <li>
                      <hr className="dropdown-divider" />
                    </li>

                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={logout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>

                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
