export function getMatches(candidates = [], jobs = []) {
  return jobs.map((job) => {
    const rankedCandidates = candidates.map((candidate) => {
      const result = calculateMatch(candidate, job)

      return {
        candidate,
        score: result.score,
        explanation: result.explanation,
        breakdown: result.breakdown,
        metrics: result.metrics,
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
  const requiredSkills = normalizeSkills(job.required_skills || job.requiredSkills || '')
  const preferredSkills = normalizeSkills(job.preferred_skills || '')

  const candidateExperience = Number(candidate.experience || 0)
  const jobExperience = Number(job.experience || 0)

  const candidateWorkMode = normalizeValue(candidate.work_mode || candidate.workMode)
  const jobWorkMode = normalizeValue(job.work_mode || job.workMode)

  const candidateWorkStyle = normalizeValue(candidate.work_style || candidate.workStyle)
  const jobWorkStyle = normalizeValue(job.work_style || job.workStyle)

  const candidateWorkPace = normalizeValue(candidate.work_pace || candidate.workPace)
  const jobWorkPace = normalizeValue(job.work_pace || job.workPace)

  const candidateCommunication = normalizeValue(candidate.communication)
  const jobCommunication = normalizeValue(job.communication_level || job.communicationLevel)

  const requiredMatches = matchSkills(candidateSkills, requiredSkills)
  const preferredMatches = matchSkills(candidateSkills, preferredSkills)

  const requiredMatchedCount = requiredMatches.length
  const requiredTotalCount = requiredSkills.length
  const preferredMatchedCount = preferredMatches.length
  const preferredTotalCount = preferredSkills.length

  const requiredSkillRatio =
    requiredTotalCount > 0 ? requiredMatchedCount / requiredTotalCount : 0

  const preferredSkillRatio =
    preferredTotalCount > 0 ? preferredMatchedCount / preferredTotalCount : 0

  const requiredSkillScore = requiredSkillRatio * 55
  const preferredSkillScore = preferredSkillRatio * 10

  let experienceScore = 0
  if (jobExperience <= 0) {
    experienceScore = 15
  } else if (candidateExperience >= jobExperience) {
    experienceScore = 15
  } else {
    experienceScore = Math.min((candidateExperience / jobExperience) * 12, 12)
  }

  let workModeScore = 0
  if (candidateWorkMode && jobWorkMode) {
    if (candidateWorkMode === jobWorkMode) {
      workModeScore = 8
    } else if (
      (candidateWorkMode === 'hybrid' && jobWorkMode === 'onsite') ||
      (candidateWorkMode === 'onsite' && jobWorkMode === 'hybrid') ||
      (candidateWorkMode === 'remote' && jobWorkMode === 'hybrid') ||
      (candidateWorkMode === 'hybrid' && jobWorkMode === 'remote')
    ) {
      workModeScore = 4
    } else {
      workModeScore = 1
    }
  }

  let workStyleScore = 0
  if (candidateWorkStyle && jobWorkStyle) {
    if (candidateWorkStyle === jobWorkStyle) {
      workStyleScore = 5
    } else if (
      (candidateWorkStyle === 'mixed' &&
        (jobWorkStyle === 'research' || jobWorkStyle === 'client-facing')) ||
      (jobWorkStyle === 'mixed' &&
        (candidateWorkStyle === 'research' || candidateWorkStyle === 'client-facing'))
    ) {
      workStyleScore = 3
    }
  }

  let workPaceScore = 0
  if (candidateWorkPace && jobWorkPace) {
    if (candidateWorkPace === jobWorkPace) {
      workPaceScore = 4
    } else if (
      (candidateWorkPace === 'structured' && jobWorkPace === 'flexible') ||
      (candidateWorkPace === 'flexible' && jobWorkPace === 'structured')
    ) {
      workPaceScore = 2
    }
  }

  let communicationScore = 0
  if (candidateCommunication && jobCommunication) {
    if (candidateCommunication === jobCommunication) {
      communicationScore = 3
    } else if (
      (candidateCommunication === 'moderate' &&
        (jobCommunication === 'low' || jobCommunication === 'high')) ||
      (jobCommunication === 'moderate' &&
        (candidateCommunication === 'low' || candidateCommunication === 'high'))
    ) {
      communicationScore = 1.5
    }
  }

  let accessibilityReadinessScore = 0
  const accommodations = []

  const accessibleDocs = toBool(job.accessible_document_workflow)
  const captionedMeetings = toBool(job.captioned_meetings_supported)
  const quietWorkspace = toBool(job.quiet_workspace_available)
  const remoteFlex = toBool(job.remote_flexibility)
  const interviewAdjustments = toBool(job.interview_accommodations_available)

  const notes = (candidate.notes || '').toLowerCase()

  if (notes.includes('screen reader') || notes.includes('accessible document')) {
    if (accessibleDocs) {
      accessibilityReadinessScore += 2
      accommodations.push('Employer supports accessible document workflows.')
    } else {
      accommodations.push('Candidate may need accessible document workflows, but employer has not confirmed support.')
    }
  }

  if (notes.includes('caption') || notes.includes('hearing')) {
    if (captionedMeetings) {
      accessibilityReadinessScore += 2
      accommodations.push('Employer supports caption-enabled meetings.')
    } else {
      accommodations.push('Candidate may benefit from caption-enabled meetings, but employer has not confirmed support.')
    }
  }

  if (notes.includes('quiet') || notes.includes('low-noise')) {
    if (quietWorkspace) {
      accessibilityReadinessScore += 2
      accommodations.push('Employer can provide quiet workspace support.')
    } else {
      accommodations.push('Candidate may need a quiet environment, but employer has not confirmed support.')
    }
  }

  if (notes.includes('remote') || notes.includes('flexible')) {
    if (remoteFlex) {
      accessibilityReadinessScore += 2
      accommodations.push('Employer offers remote / flexible arrangements.')
    } else {
      accommodations.push('Candidate may need greater flexibility than the employer has stated.')
    }
  }

  if (interviewAdjustments) {
    accessibilityReadinessScore += 1
    accommodations.push('Employer indicates interview accommodations are available.')
  }

  const finalScore = Math.round(
    requiredSkillScore +
      preferredSkillScore +
      experienceScore +
      workModeScore +
      workStyleScore +
      workPaceScore +
      communicationScore +
      accessibilityReadinessScore
  )

  const strengths = []
  const risks = []

  if (requiredTotalCount > 0) {
    if (requiredMatchedCount > 0) {
      strengths.push(`Matches ${requiredMatchedCount}/${requiredTotalCount} required skills.`)
    } else {
      risks.push('No required skills matched.')
    }
  }

  if (preferredTotalCount > 0 && preferredMatchedCount > 0) {
    strengths.push(`Matches ${preferredMatchedCount}/${preferredTotalCount} preferred skills.`)
  }

  if (jobExperience > 0) {
    if (candidateExperience >= jobExperience) {
      strengths.push(`Meets experience requirement (${candidateExperience} yrs vs ${jobExperience} required).`)
    } else {
      risks.push(`Below target experience (${candidateExperience} yrs vs ${jobExperience} required).`)
    }
  }

  if (candidateWorkMode && jobWorkMode) {
    if (candidateWorkMode === jobWorkMode) {
      strengths.push(`Work mode aligned (${labelize(candidateWorkMode)}).`)
    } else {
      risks.push(`Work mode difference (${labelize(candidateWorkMode)} vs ${labelize(jobWorkMode)}).`)
    }
  }

  if (candidateWorkStyle && jobWorkStyle) {
    if (candidateWorkStyle === jobWorkStyle) {
      strengths.push(`Work style aligned (${labelize(candidateWorkStyle)}).`)
    } else {
      risks.push(`Different work style preference.`)
    }
  }

  if (candidateWorkPace && jobWorkPace && candidateWorkPace === jobWorkPace) {
    strengths.push(`Work pace aligned (${labelize(candidateWorkPace)}).`)
  }

  if (candidateCommunication && jobCommunication && candidateCommunication === jobCommunication) {
    strengths.push(`Communication preference aligned (${labelize(candidateCommunication)}).`)
  }

  if (finalScore >= 80) {
    strengths.unshift('Strong overall fit for this role.')
  } else if (finalScore < 45) {
    risks.unshift('Low overall fit under current role criteria.')
  }

  const explanation = buildExplanation({
    requiredMatchedCount,
    requiredTotalCount,
    preferredMatchedCount,
    preferredTotalCount,
    candidateExperience,
    jobExperience,
    candidateWorkMode,
    jobWorkMode,
    candidateWorkStyle,
    jobWorkStyle,
  })

  return {
    score: Math.max(0, Math.min(finalScore, 100)),
    explanation,
    breakdown: {
      strengths,
      risks,
      accommodations,
    },
    metrics: {
      requiredMatchedCount,
      requiredTotalCount,
      preferredMatchedCount,
      preferredTotalCount,
    },
  }
}

function buildExplanation({
  requiredMatchedCount,
  requiredTotalCount,
  preferredMatchedCount,
  preferredTotalCount,
  candidateExperience,
  jobExperience,
  candidateWorkMode,
  jobWorkMode,
  candidateWorkStyle,
  jobWorkStyle,
}) {
  const parts = []

  if (requiredTotalCount > 0) {
    parts.push(`Matches ${requiredMatchedCount}/${requiredTotalCount} required skills`)
  }

  if (preferredTotalCount > 0 && preferredMatchedCount > 0) {
    parts.push(`Matches ${preferredMatchedCount}/${preferredTotalCount} preferred skills`)
  }

  if (jobExperience > 0) {
    if (candidateExperience >= jobExperience) {
      parts.push(`Meets experience requirement (${candidateExperience} yrs vs ${jobExperience} required)`)
    } else {
      parts.push(`Below experience target (${candidateExperience} yrs vs ${jobExperience} required)`)
    }
  }

  if (candidateWorkMode && jobWorkMode) {
    if (candidateWorkMode === jobWorkMode) {
      parts.push(`Work mode aligned (${labelize(candidateWorkMode)})`)
    } else {
      parts.push(`Work mode difference (${labelize(candidateWorkMode)} vs ${labelize(jobWorkMode)})`)
    }
  }

  if (candidateWorkStyle && jobWorkStyle && candidateWorkStyle === jobWorkStyle) {
    parts.push(`Work style aligned (${labelize(candidateWorkStyle)})`)
  }

  return parts.join(' • ')
}

function matchSkills(candidateSkills, targetSkills) {
  const matched = []

  for (const targetSkill of targetSkills) {
    const isMatched = candidateSkills.some((candidateSkill) =>
      areSkillsSimilar(candidateSkill, targetSkill)
    )

    if (isMatched) {
      matched.push(targetSkill)
    }
  }

  return matched
}

function areSkillsSimilar(a, b) {
  const left = canonicalSkill(a)
  const right = canonicalSkill(b)

  if (!left || !right) return false
  if (left === right) return true
  if (left.includes(right) || right.includes(left)) return true

  const synonymGroups = [
    ['contracts', 'contract law', 'contract drafting', 'commercial agreements'],
    ['corporate law', 'm&a', 'mergers and acquisitions', 'cross-border transactions'],
    ['legal research', 'case law analysis', 'research'],
    ['litigation', 'dispute resolution', 'court representation', 'arbitration'],
    ['compliance', 'regulatory law', 'corporate governance', 'risk assessment'],
    ['documentation', 'legal drafting', 'drafting'],
    ['commercial contracts', 'contracts', 'commercial agreements'],
  ]

  return synonymGroups.some((group) => group.includes(left) && group.includes(right))
}

function normalizeSkills(skills) {
  if (!skills || typeof skills !== 'string') return []

  return skills
    .split(',')
    .map((s) => canonicalSkill(s))
    .filter(Boolean)
}

function canonicalSkill(skill) {
  if (!skill || typeof skill !== 'string') return ''

  const normalized = skill
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\s+/g, ' ')
    .trim()

  const map = {
    js: 'javascript',
    reactjs: 'react',
    nodejs: 'node',
    'mergers and acquisitions': 'm&a',
    'contracts drafting': 'contract drafting',
    'commercial contract law': 'commercial contracts',
    'contract review': 'contracts',
    'court appearances': 'court representation',
  }

  return map[normalized] || normalized
}

function normalizeValue(value) {
  if (!value || typeof value !== 'string') return ''
  return value.trim().toLowerCase()
}

function labelize(value) {
  if (!value) return ''
  return value
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function toBool(value) {
  return value === true || value === 'true' || value === 'yes' || value === '1'
}