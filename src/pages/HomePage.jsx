function HomePage({ goTo }) {
  return (
    <div className="page">
      <h1>Ability Match</h1>
      <p>
        A simple hiring platform connecting disabled talent with employers.
      </p>

      <div className="button-row">
        <button onClick={() => goTo('candidate')}>Join as Candidate</button>
        <button onClick={() => goTo('employer')}>Post a Job</button>
      </div>

      <div className="button-row">
        <button className="secondary" onClick={() => goTo('admin')}>
          Admin
        </button>
        <button className="secondary" onClick={() => goTo('matches')}>
          View Matches
        </button>
      </div>
    </div>
  )
}

export default HomePage