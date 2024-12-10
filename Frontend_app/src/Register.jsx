import React, { useState } from 'react'
import './Register.css'
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const signUp = async () => {
    try {
      const response = await axios.post("http://localhost:8082/signup", formData);

      if (response.status === 201) {
        console.log("Signup successful:", response.data);

        // Save the user details to localStorage
        localStorage.setItem("user", JSON.stringify({ name: formData.name, email: formData.email }));

        // Programmatically check the checkbox to show login form
        document.getElementById('chk').checked = true;

        // Reset form data except email
        setFormData(prev => ({
          name: "",
          email: prev.email,
          phone: "",
          password: ""
        }));
      } else {
        console.error("Unexpected response:", response);
        alert("Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error signing up:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "An error occurred during signup. Please try again.");
    }
  };

  const login = async (e) => {
    e.preventDefault();
  
    try {
      const { email, password } = formData;
      const response = await axios.post("http://localhost:8082/signin", { email, password });
  
      if (response.status === 200) {
        console.log("Login successful:", response.data);
  
        // Save JWT token and user details to localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
  
        navigate("/home");
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error during login:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "An error occurred during login. Please try again.");
    }
  };
  

  return (
    <div className="main">
      <input type="checkbox" id="chk" aria-hidden="true" />

      <div className="signup">
        <form onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="chk" aria-hidden="true">
            Sign up
          </label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="number"
            name="phone"
            placeholder="Phone Number"
            required
            value={formData.phone}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
          />
          <button type="button" onClick={signUp}>
            Sign up
          </button>
        </form>
      </div>

      <div className="login">
        <form onSubmit={login}>
          <label htmlFor="chk" aria-hidden="true">
            Login
          </label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Register;