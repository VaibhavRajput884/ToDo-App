import React, { useState, useEffect } from "react";
import { login } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./partials/header";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/");
    }
  }, []);

  const [errors, setErrors] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const result = await login(form);
      setErrors(null);

      if (result.status === 200) {
        if (result.data.status === 200) {
          localStorage.setItem("user", JSON.stringify(result.data.data));
          navigate("/");
          return;
        }
        if (result.data.status === 201) {
          setErrors(result.data.data);
          return;
        }
        if (result.data.status === 202) {
          toast(result.data.message);
          return;
        }
      } else {
        toast("Something went wrong, please try again");
      }
    } catch (error) {
      toast("An error occurred while logging in. Please try again.");
    }
  };

  return (
    <>
      <Header />

      <div className="container">
        <ToastContainer />
        <div className="row justify-content-center mt-4">
          <div className="col-lg-5 card border-primary mt-4">
            <div className="card-body">
              <h4 className="card-title">Login Now</h4>
              <form>
                <div className="form-group">
                  <label htmlFor="email" className="form-label mt-4">
                    Email
                  </label>
                  <input
                    type="text"
                    onChange={handleChange}
                    name="email"
                    className="form-control"
                    id="email"
                    aria-describedby="emailHelp"
                    placeholder="Enter Email or Username"
                  />
                  {errors?.email && (
                    <small id="emailHelp" className="form-text text-muted">
                      {errors.email.msg}
                    </small>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="form-label mt-4">
                    Password
                  </label>
                  <input
                    type="password"
                    onChange={handleChange}
                    name="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    autoComplete="off"
                  />
                  {errors?.password && (
                    <small id="passwordHelp" className="form-text text-muted">
                      {errors.password.msg}
                    </small>
                  )}
                </div>

                <div className="row justify-content-md-center form-group mt-4">
                  <button
                    type="button"
                    className="col-sm-6 center btn btn-primary mt-3"
                    onClick={handleSubmit}
                  >
                    Login
                  </button>
                </div>
              </form>
              {errors && (
                <div className="alert alert-danger mt-3">{errors.message}</div>
              )}
              <div className="text-center mt-4">
                <Link to="/accounts">Not registered? Sign up here</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
