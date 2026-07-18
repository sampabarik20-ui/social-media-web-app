import React, { useState } from "react";
import Alert from "../components/Alert";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import useAuth from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "../reducers/authReducer";

const Login = () => {

  const {login} = useAuth();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {   
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("users/login", formData );
      if (!response.data.token) {
        setErrorMessage(response.data.message);
        return;
      }
      login(response.data.token);
      await dispatch(fetchCurrentUser());
      navigate("/");
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
      setFormData({
        email: "",
        password: "",
      });

    }
  };

  return (
    <main className="d-flex align-items-center justify-content-center min-vh-100 py-3 bg-light">
      <div className="card shadow border-0 rounded-4" style={{ width: "28rem" }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <h4 className="fw-bold">Welcome Back!</h4>
            <p className="text-muted">Login to continue</p>
          </div>
          <Alert message={errorMessage} type="danger" onClose={() => setErrorMessage("")} />
          <Alert message={successMessage} type="success" onClose={() => setSuccessMessage("")} />
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                type="email"
                className="form-control form-control-lg"
                placeholder="Enter your email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control form-control-lg"
                placeholder="Enter your password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div className="d-flex justify-content-between mb-4">
              <Link to="/register" className="text-decoration-none">Register here</Link>
            </div>

            <button
              className="btn btn-primary btn-lg w-100"
              type="submit"
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Login;
