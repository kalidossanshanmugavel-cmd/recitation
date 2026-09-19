import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">

      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Continue your learning journey.</p>
      </div>

      {/* Statistics */}

      <div className="stats-grid">

        <div className="stat-card">
          <h3>Courses</h3>
          <p className="stat-value">5</p>
        </div>

        <div className="stat-card">
          <h3>MCQs Completed</h3>
          <p className="stat-value">120</p>
        </div>

        <div className="stat-card">
          <h3>Overall Progress</h3>
          <p className="stat-value">68%</p>
        </div>

      </div>

      {/* Continue Learning */}

      <h2 className="section-title">
        Continue Learning
      </h2>

      <div className="learning-card">

        <h3>Python Fundamentals</h3>

        <p>
          Learn Python programming fundamentals
          through interactive lessons and MCQs.
        </p>

        <div className="progress-container">
          <div
            className="progress-bar"
            style={{ width: "70%" }}
          />
        </div>

        <div className="learning-footer">

          <span>70% completed</span>

          <button className="continue-button">
            Continue →
          </button>

        </div>

      </div>

      {/* Recent Activity */}

      <h2 className="section-title">
        Recent Activity
      </h2>

      <div className="activity-list">

        <div className="activity-item">

          <div>
            <div className="activity-name">
              Python MCQ Assessment
            </div>

            <div className="activity-type">
              Assessment
            </div>
          </div>

          <div className="activity-score">
            8 / 10
          </div>

        </div>

        <div className="activity-item">

          <div>
            <div className="activity-name">
              Python Functions Practice
            </div>

            <div className="activity-type">
              Practice
            </div>
          </div>

          <div className="activity-score">
            7 / 10
          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;