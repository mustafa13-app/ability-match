function AdminPage({ goHome, candidates, jobs }) {
  return (
    <div className="page">
      <h1>Admin</h1>

      <h2>Candidates</h2>
      {candidates.length === 0 && <p>No candidates yet</p>}

      {candidates.map((c, index) => (
        <div
          key={index}
          style={{
            marginBottom: '20px',
            padding: '10px',
            background: '#fff',
            borderRadius: '8px'
          }}
        >
          <strong>{c.name}</strong>
          <p>Email: {c.email}</p>
          <p>Skills: {c.skills}</p>
          <p>Experience: {c.experience}</p>
          <p>Location: {c.location}</p>
        </div>
      ))}

      <h2>Jobs</h2>
      {jobs.length === 0 && <p>No jobs yet</p>}

      {jobs.map((j, index) => (
        <div
          key={index}
          style={{
            marginBottom: '20px',
            padding: '10px',
            background: '#fff',
            borderRadius: '8px'
          }}
        >
          <strong>{j.title}</strong>
          <p>Company: {j.company}</p>
          <p>Skills: {j.requiredSkills}</p>
          <p>Location: {j.location}</p>
        </div>
      ))}

      <button
        style={{ marginTop: '20px', background: 'red', color: 'white' }}
        onClick={() => {
          localStorage.removeItem('candidates')
          localStorage.removeItem('jobs')
          window.location.reload()
        }}
      >
        Reset Data
      </button>

      <br />
      <br />

      <button className="secondary" onClick={goHome}>
        Back Home
      </button>
    </div>
  )
}

export default AdminPage