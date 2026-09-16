import { useCallback, useEffect, useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

function Dashboard() {
  // =====================================
  // STATE
  // =====================================

  const [expenses, setExpenses] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =====================================
  // LOGIN INFORMATION
  // =====================================

  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  // =====================================
  // GET EXPENSES
  // =====================================

  const fetchExpenses = useCallback(async () => {
    try {
      const response = await fetch(
        "https://expense-tracker-8u22.onrender.com/api/expenses",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        setExpenses(data.expenses);
        setError("");
      } else {
        setError(data.message);
      }
    } catch {
      setError("Unable to connect to server");
    }
  }, [token]);

  // =====================================
  // LOAD EXPENSES WHEN DASHBOARD OPENS
  // =====================================

useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  fetchExpenses();
}, [fetchExpenses]);

  // =====================================
  // HANDLE INPUT
  // =====================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // =====================================
  // ADD EXPENSE
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "https://expense-tracker-8u22.onrender.com/api/expenses",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            title: formData.title,
            amount: Number(formData.amount),
            category: formData.category
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Expense added successfully!");

        setFormData({
          title: "",
          amount: "",
          category: ""
        });

        // Refresh expense list
        fetchExpenses();
      } else {
        setError(data.message);
      }
    } catch {
      setError("Unable to connect to server");
    }
  };

  // =====================================
  // DELETE EXPENSE
  // =====================================

  const handleDelete = async (id) => {
    setMessage("");
    setError("");

    try {
      const response = await fetch(
         `https://expense-tracker-8u22.onrender.com/api/expenses/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Expense deleted successfully!");

        // Refresh expense list
        fetchExpenses();
      } else {
        setError(data.message);
      }
    } catch {
      setError("Unable to connect to server");
    }
  };

  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  // =====================================
  // TOTAL EXPENSE
  // =====================================

  const totalExpenses = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );

  // =====================================
  // CATEGORY DATA FOR PIE CHART
  // =====================================

  const categoryData = Object.values(
    expenses.reduce((acc, expense) => {
      const category = expense.category;

      if (!acc[category]) {
        acc[category] = {
          name: category,
          value: 0
        };
      }

      acc[category].value += Number(expense.amount);

      return acc;
    }, {})
  );

  // =====================================
  // PIE CHART COLORS
  // =====================================

  const chartColors = [
    "#2563eb",
    "#16a34a",
    "#f59e0b",
    "#dc2626",
    "#9333ea",
    "#0891b2"
  ];

  // =====================================
  // UI
  // =====================================

  return (
    <div className="dashboard">

      {/* =================================
          HEADER
      ================================= */}

      <div className="dashboard-header">

        <div className="dashboard-title">
          <h1>Expense Tracker</h1>

          <p>
            Manage your expenses smartly
          </p>
        </div>


        <div className="profile-section">

          <div className="profile-avatar">
            {user?.name
              ?.charAt(0)
              .toUpperCase()}
          </div>


          <div className="profile-info">

            <h3>
              Welcome back, {user?.name}!
            </h3>

            <p>
              {user?.email}
            </p>

          </div>


          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>


      {/* =================================
          MAIN CONTAINER
      ================================= */}

      <div className="dashboard-container">


        {/* =================================
            SUMMARY CARDS
        ================================= */}

        <div className="summary-grid">


          <div className="summary-card">

            <p>
              Total Expenses
            </p>

            <h2>
              ₹{totalExpenses}
            </h2>

          </div>


          <div className="summary-card">

            <p>
              Total Transactions
            </p>

            <h2>
              {expenses.length}
            </h2>

          </div>


          <div className="summary-card">

            <p>
              Categories
            </p>

            <h2>
              {categoryData.length}
            </h2>

          </div>


        </div>


        {/* =================================
            MAIN GRID
        ================================= */}

        <div className="dashboard-grid">


          {/* =================================
              ADD EXPENSE
          ================================= */}

          <div className="expense-card">

            <h2>
              Add Expense
            </h2>


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


              {/* TITLE */}

              <div className="input-group">

                <label>
                  Title
                </label>

                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Lunch"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* AMOUNT */}

              <div className="input-group">

                <label>
                  Amount
                </label>

                <input
                  type="number"
                  name="amount"
                  placeholder="e.g. 250"
                  value={formData.amount}
                  onChange={handleChange}
                  min="1"
                  required
                />

              </div>


              {/* CATEGORY */}

              <div className="input-group">

                <label>
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  placeholder="e.g. Food"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* BUTTON */}

              <button
                className="add-expense-button"
                type="submit"
              >
                Add Expense
              </button>


            </form>

          </div>


          {/* =================================
              PIE CHART
          ================================= */}

          <div className="chart-card">

            <h2>
              Expense by Category
            </h2>


            {categoryData.length === 0 ? (

              <div className="no-data">

                <p>
                  No expense data available
                </p>

                <span>
                  Add an expense to see the chart.
                </span>

              </div>

            ) : (

              <ResponsiveContainer
                width="100%"
                height={320}
              >

                <PieChart>

                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    outerRadius={100}
                    label
                  >

                    {categoryData.map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            chartColors[
                              index %
                              chartColors.length
                            ]
                          }
                        />
                      )
                    )}

                  </Pie>


                  <Tooltip
                    formatter={(value) =>
                      `₹${value}`
                    }
                  />


                  <Legend />

                </PieChart>

              </ResponsiveContainer>

            )}

          </div>


        </div>


        {/* =================================
            EXPENSE LIST
        ================================= */}

        <div className="expense-card expense-list-card">


          <div className="expense-list-header">

            <div>

              <h2>
                My Expenses
              </h2>

              <p>
                Recent transactions
              </p>

            </div>

          </div>


          {expenses.length === 0 ? (

            <div className="no-expenses">

              <p>
                No expenses found.
              </p>

              <span>
                Add your first expense above.
              </span>

            </div>

          ) : (

            <div className="expense-list">


              {expenses.map((expense) => (

                <div
                  className="expense-item"
                  key={expense._id}
                >


                  {/* LEFT */}

                  <div className="expense-left">

                    <div className="expense-icon">

                      {expense.category
                        ?.charAt(0)
                        .toUpperCase()}

                    </div>


                    <div>

                      <h3>
                        {expense.title}
                      </h3>

                      <span className="category-badge">
                        {expense.category}
                      </span>

                    </div>

                  </div>


                  {/* RIGHT */}

                  <div className="expense-right">

                    <strong>
                      ₹{expense.amount}
                    </strong>


                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDelete(
                          expense._id
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>


                </div>

              ))}


            </div>

          )}

        </div>


      </div>

    </div>
  );
}

export default Dashboard;