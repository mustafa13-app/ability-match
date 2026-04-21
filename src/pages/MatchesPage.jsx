import { getMatches } from '../lib/matching'

function MatchesPage({ goHome, candidates = [], jobs = [] }) {
  const safeCandidates = Array.isArray(candidates) ? candidates : []
  const safeJobs = Array.isArray(jobs) ? jobs : []

  const rawMatches = getMatches(safeCandidates, safeJobs) || []

  const matches = rawMatches.map((match) => ({
    job: match.job,
    topCandidates: (match.candidates || []).slice(0, 5).map((item) => {
      const candidate = item.candidate || {}
      const matchingSkills = parseExplanation(item.explanation).matchingSkills
      const totalSkills = parseExplanation(item.explanation).totalSkills

      return {
        id: candidate.id,
        name: candidate.name || 'Unnamed Candidate',
        email: candidate.email || 'No email provided',
        skills: candidate.skills || '',
        experience: candidate.experience || 0,
        cv_url: candidate.cv_url || null,
        score: item.score || 0,
        matchingSkills,
        totalSkills,
      }
    }),
  }))

  return (
    <div className="page">
      <div className="dashboard-shell">
        <div className="dashboard-header">
          <div>
            <div className="hero-badge">Matching Engine</div>
            <h1 className="dashboard-title">Top Candidate Matches</h1>
            <p className="dashboard-subtitle">
              Ranked candidates based on skills, experience, and role fit.
            </p>
          </div>
        </div>

        {matches.length === 0 && (
          <p className="empty-state">No matches yet</p>
        )}

        {matches.map((match, index) => (
          <div key={match.job?.id || index} className="match-job-card">
            <div className="match-job-header">
              <div>
                <h2>{match.job?.title || 'Untitled Job'}</h2>
                <p className="muted">{match.job?.company || 'No company'}</p>
              </div>
            </div>

            {!!match.job?.requiredSkills && (
              <div className="tag-row">
                {match.job.requiredSkills.split(',').map((skill, i) => (
                  <span key={i} className="tag">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            )}

            <div className="candidate-list">
              {match.topCandidates.length === 0 && (
                <p className="empty-state">No candidate matches for this role yet</p>
              )}

              {match.topCandidates.map((candidate, i) => (
                <div key={candidate.id || i} className="match-card">
                  <div className="match-top">
                    <div>
                      <strong>{candidate.name}</strong>
                      <p className="muted small">{candidate.email}</p>
                    </div>

                    <div className="score-box">
                      <span>{candidate.score}%</span>
                      <small>Match</small>
                    </div>
                  </div>

                  <div className="match-details">
                    <span>
                      {candidate.matchingSkills}/{candidate.totalSkills} skills
                    </span>
                    <span>{candidate.experience} yrs exp</span>
                  </div>

                  {!!candidate.skills && (
                    <div className="tag-row">
                      {candidate.skills.split(',').map((skill, idx) => (
                        <span key={idx} className="tag">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="match-actions">
                    {candidate.cv_url ? (
                      <a
                        href={candidate.cv_url}
                        target="_blank"
                        rel="noreferrer"
                        className="link"
                      >
                        View CV
                      </a>
                    ) : (
                      <span className="muted small">No CV uploaded</span>
                    )}

                    <button type="button" className="secondary small-btn">
                      Shortlist
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="dashboard-actions">
          <button className="secondary" onClick={goHome}>
            Back Home
          </button>
        </div>
      </div>
    </div>
  )
}

function parseExplanation(explanation = '') {
  const match = explanation.match(/(\d+)\/(\d+)\s+skills/i)

  return {
    matchingSkills: match ? Number(match[1]) : 0,
    totalSkills: match ? Number(match[2]) : 0,
  }
}

export default MatchesPage