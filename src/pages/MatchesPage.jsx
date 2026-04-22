import { getMatches } from '../lib/matching'

function MatchesPage({ goHome, candidates = [], jobs = [] }) {
  const safeCandidates = Array.isArray(candidates) ? candidates : []
  const safeJobs = Array.isArray(jobs) ? jobs : []

  const matches = getMatches(safeCandidates, safeJobs) || []

  return (
    <div className="page">
      <div className="dashboard-shell">
        <div className="dashboard-header">
          <div>
            <div className="hero-badge">Matching Engine</div>
            <h1 className="dashboard-title">Top Candidate Matches</h1>
            <p className="dashboard-subtitle">
              Ranked candidates based on skills, experience, work environment,
              and accessibility fit.
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

            {!!(match.job?.required_skills || match.job?.requiredSkills) && (
              <div className="tag-row">
                {(match.job.required_skills || match.job.requiredSkills)
                  .split(',')
                  .map((skill, i) => (
                    <span key={i} className="tag">
                      {skill.trim()}
                    </span>
                  ))}
              </div>
            )}

            <div className="candidate-list">
              {(match.candidates || []).length === 0 && (
                <p className="empty-state">No candidate matches for this role yet</p>
              )}

              {(match.candidates || []).slice(0, 5).map((item, i) => {
                const candidate = item.candidate || {}
                const breakdown = item.breakdown || {
                  strengths: [],
                  risks: [],
                  accommodations: [],
                }
                const metrics = item.metrics || {
                  requiredMatchedCount: 0,
                  requiredTotalCount: 0,
                }

                return (
                  <div key={candidate.id || i} className="match-card">
                    <div className="match-top">
                      <div>
                        <strong>{candidate.name || 'Unnamed Candidate'}</strong>
                        <p className="muted small">
                          {candidate.email || 'No email provided'}
                        </p>
                      </div>

                      <div className="score-box">
                        <span>{item.score || 0}%</span>
                        <small>Match</small>
                      </div>
                    </div>

                    <p className="candidate-meta-line">
                      {candidate.experience || 0} yrs exp
                      {candidate.location ? ` • ${candidate.location}` : ''}
                      {candidate.work_mode ? ` • ${candidate.work_mode}` : ''}
                    </p>

                    {!!candidate.skills && (
                      <div className="tag-row">
                        {candidate.skills.split(',').map((skill, idx) => (
                          <span key={idx} className="tag">
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="candidate-meta-line">
                      {metrics.requiredMatchedCount}/{metrics.requiredTotalCount} required skills matched
                    </p>

                    {item.explanation && (
                      <p className="match-explanation">{item.explanation}</p>
                    )}

                    <div className="insight-grid">
                      <div className="insight-box">
                        <h4>Why this candidate</h4>
                        {breakdown.strengths.length > 0 ? (
                          <ul className="insight-list">
                            {breakdown.strengths.map((point, idx) => (
                              <li key={idx}>{point}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="muted small">No strong signals yet</p>
                        )}
                      </div>

                      <div className="insight-box">
                        <h4>Potential gaps</h4>
                        {breakdown.risks.length > 0 ? (
                          <ul className="insight-list">
                            {breakdown.risks.map((point, idx) => (
                              <li key={idx}>{point}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="muted small">No major gaps identified</p>
                        )}
                      </div>
                    </div>

                    {(candidate.notes || hasJobAccessibility(match.job)) && (
                      <div className="accessibility-box">
                        <h4>Accessibility & workplace fit</h4>

                        {candidate.notes && (
                          <p className="small">
                            <strong>Candidate notes:</strong> {candidate.notes}
                          </p>
                        )}

                        <div className="accessibility-tags">
                          {jobAccessibilityTags(match.job).map((tag, idx) => (
                            <span key={idx} className="tag">
                              {tag}
                            </span>
                          ))}
                        </div>
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
                )
              })}
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

function hasJobAccessibility(job) {
  return Boolean(
    job.remote_flexibility ||
      job.accessible_document_workflow ||
      job.captioned_meetings_supported ||
      job.quiet_workspace_available ||
      job.interview_accommodations_available
  )
}

function jobAccessibilityTags(job) {
  const tags = []

  if (job.remote_flexibility) tags.push('Remote flexibility')
  if (job.accessible_document_workflow) tags.push('Accessible documents')
  if (job.captioned_meetings_supported) tags.push('Captioned meetings')
  if (job.quiet_workspace_available) tags.push('Quiet workspace')
  if (job.interview_accommodations_available) tags.push('Interview accommodations')

  return tags
}

export default MatchesPage