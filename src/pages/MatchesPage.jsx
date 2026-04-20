import { getMatches } from '../lib/matching'

function MatchesPage({ goHome, candidates, jobs }) {
  const matches = getMatches(candidates, jobs)

  return (
    <div className="page">
      <h1>Matches</h1>

      {jobs.length === 0 && <p>No jobs submitted yet.</p>}
      {candidates.length === 0 && <p>No candidates submitted yet.</p>}

      {matches.map((match, index) => (
        <div
          key={index}
          style={{
            marginBottom: '24px',
            padding: '16px',
            background: '#fff',
            borderRadius: '10px'
          }}
        >
          <h2>{match.job.title}</h2>
          <p><strong>Company:</strong> {match.job.company}</p>
          <p><strong>Required Skills:</strong> {match.job.requiredSkills}</p>

          <div style={{ marginTop: '16px' }}>
            <strong>Top Candidates</strong>

            {match.candidates.length === 0 && <p>No candidates available.</p>}

            {match.candidates.slice(0, 5).map((item, i) => (
              <div
                key={i}
                style={{
                  marginTop: '12px',
                  padding: '12px',
                  background: '#f7f7f7',
                  borderRadius: '8px'
                }}
              >
                <p><strong>{item.candidate.name}</strong></p>
                <p>Score: {item.score}%</p>
                <p>{item.explanation}</p>
                <p>Skills: {item.candidate.skills}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button className="secondary" onClick={goHome}>
        Back Home
      </button>
    </div>
  )
}

export default MatchesPage