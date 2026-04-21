function AdminPage({ goHome, candidates, jobs }) {
  return (
    <div className="page">
      <div className="dashboard-shell">
        <div className="dashboard-header">
          <div>
            <div className="hero-badge">Admin Dashboard</div>
            <h1 className="dashboard-title">Candidate & Job Overview</h1>
            <p className="dashboard-subtitle">
              Review submitted candidates, uploaded CVs, and job opportunities in one place.
            </p>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Candidates */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Candidates</h2>
              <span className="card-count">{candidates.length}</span>
            </div>

            {candidates.length === 0 && (
              <p className="empty-state">No candidates submitted yet</p>
            )}

            {candidates.map((c) => (
              <div key={c.id} className="candidate-card">
                <div className="candidate-top">
                  <strong>{c.name}</strong>
                  <span className="candidate-exp">{c.experience} yrs</span>
                </div>

                <p className="muted">{c.email}</p>

                <div className="tag-row">
                  {c.skills?.split(',').map((skill, i) => (
                    <span key={i} className="tag">{skill.trim()}</span>
                  ))}
                </div>

                <div className="candidate-meta">
                  <span>{c.location}</span>
                  <span>{c.work_mode}</span>
                </div>

                {c.cv_url && (
                  <a
                    href={c.cv_url}
                    target="_blank"
                    rel="noreferrer"
                    className="link"
                  >
                    View CV
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Jobs */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2>Jobs</h2>
              <span className="card-count">{jobs.length}</span>
            </div>

            {jobs.length === 0 && (
              <p className="empty-state">No jobs posted yet</p>
            )}

            {jobs.map((j) => (
              <div key={j.id} className="job-card">
                <strong>{j.title}</strong>
                <p className="muted">{j.company}</p>

                <div className="tag-row">
                  {j.requiredSkills?.split(',').map((skill, i) => (
                    <span key={i} className="tag">{skill.trim()}</span>
                  ))}
                </div>

                <div className="candidate-meta">
                  <span>{j.location}</span>
                  <span>{j.work_mode}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-actions">
          <button className="secondary" onClick={goHome}>
            Back Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminPage