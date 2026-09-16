import { useState } from "react";

function Login() {
  const [formData, setFormData] = useState({
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
        "https://expense-tracker-8u22.onrender.com/api/auth/login",
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
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setMessage("Login successful!");

        window.location.href = "/dashboard";
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

        <h2>Welcome Back</h2>

        <p className="auth-subtitle">
          Login to manage your expenses
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
            Login
          </button>

        </form>

      <p className="auth-footer">
  Don't have an account?
</p>

<button
  type="button"
  className="auth-switch-button"
  onClick={() => {
    window.location.href = "/";
  }}
>
  Register
</button>

      </div>
    </div>
  );
}

export default Login;