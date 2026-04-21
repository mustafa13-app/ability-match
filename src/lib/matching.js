export function getMatches(candidates = [], jobs = []) {
  return jobs.map((job) => {
    const rankedCandidates = candidates.map((candidate) => {
      const result = calculateMatch(candidate, job)

      return {
        candidate,
        score: result.score,
        explanation: `${result.matchingSkills}/${result.totalSkills} skills matched`,
      }
    })

    rankedCandidates.sort((a, b) => b.score - a.score)

    return {
      job,
      candidates: rankedCandidates,
    }
  })
}

function calculateMatch(candidate, job) {
  const candidateSkills = normalizeSkills(candidate.skills)

  const jobSkills = normalizeSkills(
    job.requiredSkills || job.required_skills || ''
  )

  const candidateExperience = Number(candidate.experience || 0)
  const jobExperience = Number(job.experience || job.minExperience || 0)

  const matching = jobSkills.filter((skill) =>
    candidateSkills.includes(skill)
  )

  const skillScore =
    jobSkills.length > 0 ? matching.length / jobSkills.length : 0

  let experienceScore = 1
  if (jobExperience > 0) {
    experienceScore = Math.min(candidateExperience / jobExperience, 1)
  }

  const finalScore = Math.round(
    (skillScore * 0.7 + experienceScore * 0.3) * 100
  )

  return {
    score: finalScore,
    matchingSkills: matching.length,
    totalSkills: jobSkills.length,
  }
}

function normalizeSkills(skills) {
  if (!skills || typeof skills !== 'string') return []

  return skills
    .toLowerCase()
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}