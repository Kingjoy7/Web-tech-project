import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "./Navbar.css";

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleModalToggle = (signup = false) => {
    setIsSignup(signup);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    reset();
  };

  const onSubmit = async(data) => {
    console.log(data)
    if (isSignup) {
      const userInfo={
        name:data.name,
        email:data.email,
        password:data.password
      }
      const res = await fetch("http://localhost:3000/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });

      const result =await(res.json())

      if(res.ok){
        alert(`Signup successful! Welcome, ${data.name}!`);
      }
      else{
        alert("Error Signing you in")
      }
      
    } else {
      const userInfo={
        email:data.email,
        password:data.password
      }

      const res = await fetch("http://localhost:3000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });

      const result=await res.json()

      if(res.ok){
        alert("Login successful!");
      }
      else{
        alert("Error Logging you in")
      }
      
    }
    handleCloseModal();
  };

  return (
    <>
      <div className="navbar">
        <div className="navbar-brand">SkyScout</div>
        <div className="navbar-buttons">
          <button className="navbar-btn" onClick={() => handleModalToggle(false)}>Login</button>
          <button className="navbar-btn" onClick={() => handleModalToggle(true)}>Signup</button>
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{isSignup ? "Sign Up" : "Login"}</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              {isSignup && (
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Name"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && <p className="error">{errors.name.message}</p>}
                </div>
              )}
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && <p className="error">{errors.email.message}</p>}
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                {errors.password && (
                  <p className="error">{errors.password.message}</p>
                )}
              </div>
              <button type="submit" className="modal-btn">
                {isSignup ? "Sign Up" : "Login"}
              </button>
            </form>
            <button className="modal-close" onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
