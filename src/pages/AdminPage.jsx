function AdminPage({ goHome, candidates, jobs }) {
  return (
    <div className="page">
      <h1>Admin</h1>

      <h2>Candidates</h2>
      {candidates.length === 0 && <p>No candidates yet</p>}

      {candidates.map((c) => (
        <div
          key={c.id}
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
          <p>Work Mode: {c.work_mode}</p>
          <p>Notes: {c.notes || 'None'}</p>

          {c.cv_url && (
            <p>
              <a href={c.cv_url} target="_blank" rel="noopener noreferrer">
                View CV
              </a>
            </p>
          )}
        </div>
      ))}

      <h2>Jobs</h2>
      {jobs.length === 0 && <p>No jobs yet</p>}

      {jobs.map((j) => (
        <div
          key={j.id}
          style={{
            marginBottom: '20px',
            padding: '10px',
            background: '#fff',
            borderRadius: '8px'
          }}
        >
          <strong>{j.title}</strong>
          <p>Company: {j.company}</p>
          <p>Skills: {j.requiredSkills || j.required_skills}</p>
          <p>Location: {j.location}</p>
          <p>Work Mode: {j.work_mode || j.workMode}</p>
          <p>Experience: {j.experience}</p>
          <p>Description: {j.description || 'None'}</p>
        </div>
      ))}

      <br />
      <br />

      <button className="secondary" onClick={goHome}>
        Back Home
      </button>
    </div>
  )
}

export default AdminPage