function HomePage({ goTo }) {
  return (
    <div className="page">
      <section className="hero">
        <div className="hero-badge">Inclusive Hiring Platform</div>

        <h1 className="hero-title">Ability Match</h1>

        <p className="hero-subtitle">
          Connect disabled talent with employers through a simpler, more
          accessible hiring experience.
        </p>

        <div className="hero-actions">
          <button className="primary" onClick={() => goTo('candidate')}>
            Join as Candidate
          </button>

          <button className="primary" onClick={() => goTo('employer')}>
            Post a Job
          </button>
        </div>

        <div className="hero-secondary-actions">
          <button className="secondary" onClick={() => goTo('admin')}>
            Admin
          </button>

          <button className="secondary" onClick={() => goTo('matches')}>
            View Matches
          </button>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">How it works</h2>

        <div className="home-grid">
          <div className="card feature-card">
            <div className="step-number">1</div>
            <h3>Candidate Profile</h3>
            <p>
              Create your profile, highlight your skills, and upload your CV to
              get discovered.
            </p>
          </div>

          <div className="card feature-card">
            <div className="step-number">2</div>
            <h3>Post Opportunities</h3>
            <p>
              Employers submit job roles with required skills and preferences.
            </p>
          </div>

          <div className="card feature-card">
            <div className="step-number">3</div>
            <h3>Smart Matching</h3>
            <p>
              The platform ranks candidates based on skills, experience, and fit.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage