function normalizeList(value) {
  return value
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
}

export function getMatches(candidates, jobs) {
  return jobs.map((job) => {
    const requiredSkills = normalizeList(job.requiredSkills || '')
    const jobWorkMode = (job.workMode || '').toLowerCase()
    const jobExperience = parseInt(job.experience || 0)

    const rankedCandidates = candidates.map((candidate) => {
      const candidateSkills = normalizeList(candidate.skills || '')
      const candidateWorkMode = (candidate.workMode || '').toLowerCase()
      const candidateExperience = parseInt(candidate.experience || 0)

      // Skill match
      const matchedSkills = requiredSkills.filter((skill) =>
        candidateSkills.includes(skill)
      )

      const skillScore =
        requiredSkills.length === 0
          ? 0
          : (matchedSkills.length / requiredSkills.length) * 100

      // Work mode match
      const workModeScore =
        jobWorkMode && candidateWorkMode === jobWorkMode ? 100 : 0

      // Experience match (simple)
      const experienceScore =
        candidateExperience >= jobExperience ? 100 : 50

      // Final weighted score
      const finalScore = Math.round(
        skillScore * 0.6 +
        workModeScore * 0.2 +
        experienceScore * 0.2
      )

      return {
        candidate,
        score: finalScore,
        explanation: `${matchedSkills.length}/${requiredSkills.length} skills • ${candidateExperience} yrs exp • ${candidateWorkMode}`
      }
    })

    rankedCandidates.sort((a, b) => b.score - a.score)

    return {
      job,
      candidates: rankedCandidates
    }
  })
}