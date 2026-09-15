import { useState } from "react";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Account created successfully!");

        setFormData({
          name: "",
          email: "",
          password: ""
        });
      } else {
        setError(data.message);
      }

    } catch {
      setError("Unable to connect to server");
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h1>Expense Tracker</h1>

        <h2>Create Account</h2>

        <p className="auth-subtitle">
          Start managing your expenses today
        </p>

        {message && (
          <p className="success-message">
            {message}
          </p>
        )}

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label>Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit">
            Create Account
          </button>

        </form>

        <p className="auth-footer">
  Already have an account?
</p>

<button
  type="button"
  className="auth-switch-button"
  onClick={() => {
    window.location.href = "/login";
  }}
>
  Login
</button>

      </div>

    </div>
  );
}

export default Register;