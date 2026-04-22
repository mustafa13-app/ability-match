import { useState } from 'react'

function EmployerPage({ goHome, onSubmitJob }) {
  const [form, setForm] = useState({
    title: '',
    company: '',
    contact: '',
    email: '',
    requiredSkills: '',
    preferredSkills: '',
    experience: '',
    location: '',
    workMode: '',
    workStyle: '',
    workPace: '',
    communicationLevel: '',
    description: '',
    accessibleDocumentWorkflow: false,
    remoteFlexibility: false,
    captionedMeetingsSupported: false,
    quietWorkspaceAvailable: false,
    interviewAccommodationsAvailable: false,
  })

  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const jobToSave = {
        title: form.title,
        company: form.company,
        contact: form.contact,
        email: form.email,
        description: form.description,
        required_skills: form.requiredSkills,
        preferred_skills: form.preferredSkills,
        location: form.location,
        work_mode: form.workMode,
        experience: parseInt(form.experience || 0, 10),
        work_style: form.workStyle,
        work_pace: form.workPace,
        communication_level: form.communicationLevel,
        accessible_document_workflow: form.accessibleDocumentWorkflow,
        remote_flexibility: form.remoteFlexibility,
        captioned_meetings_supported: form.captionedMeetingsSupported,
        quiet_workspace_available: form.quietWorkspaceAvailable,
        interview_accommodations_available: form.interviewAccommodationsAvailable,
      }

      await onSubmitJob(jobToSave)
    } catch (error) {
      console.error('Error saving job:', error)
      alert('Failed to save job')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page">
      <div className="form-shell">
        <div className="form-header form-header-row">
          <div>
            <div className="hero-badge">Employer Job Posting</div>
            <h1 className="form-title">Create a new job opportunity</h1>
            <p className="form-subtitle">
              Define the role, hiring requirements, and accessibility readiness so the platform can identify suitable candidates more intelligently.
            </p>
          </div>

          <button
            type="button"
            className="secondary top-back-btn"
            onClick={goHome}
            disabled={submitting}
          >
            Back Home
          </button>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-section">
            <h2>Role Details</h2>

            <div className="form-grid">
              <div>
                <label>Job Title</label>
                <input
                  name="title"
                  placeholder="Example: Corporate Lawyer"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>Company Name</label>
                <input
                  name="company"
                  placeholder="Example: Al Tamimi & Company"
                  value={form.company}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Hiring Contact</h2>

            <div className="form-grid">
              <div>
                <label>Contact Name</label>
                <input
                  name="contact"
                  placeholder="Example: Fatima Al Suwaidi"
                  value={form.contact}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Contact Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="Example: hiring@company.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Candidate Requirements</h2>

            <div className="form-grid">
              <div>
                <label>Required Skills</label>
                <input
                  name="requiredSkills"
                  placeholder="Example: Corporate Law, Contracts, M&A"
                  value={form.requiredSkills}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Preferred Skills</label>
                <input
                  name="preferredSkills"
                  placeholder="Example: Legal Research, Compliance"
                  value={form.preferredSkills}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Minimum Experience (Years)</label>
                <input
                  name="experience"
                  type="number"
                  min="0"
                  placeholder="Example: 5"
                  value={form.experience}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Location</label>
                <input
                  name="location"
                  placeholder="Example: Dubai"
                  value={form.location}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Work Arrangement</label>
                <input
                  name="workMode"
                  placeholder="Remote / Hybrid / Onsite"
                  value={form.workMode}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Work Style</label>
                <input
                  name="workStyle"
                  placeholder="Research / Client-facing / Mixed"
                  value={form.workStyle}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Work Pace</label>
                <input
                  name="workPace"
                  placeholder="Structured / Flexible / Fast-paced"
                  value={form.workPace}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Communication Level</label>
                <input
                  name="communicationLevel"
                  placeholder="Low / Moderate / High"
                  value={form.communicationLevel}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Accessibility Readiness</h2>

            <div className="checkbox-grid">
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  name="accessibleDocumentWorkflow"
                  checked={form.accessibleDocumentWorkflow}
                  onChange={handleChange}
                />
                <span>Accessible document workflow supported</span>
              </label>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  name="remoteFlexibility"
                  checked={form.remoteFlexibility}
                  onChange={handleChange}
                />
                <span>Remote / flexible arrangements available</span>
              </label>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  name="captionedMeetingsSupported"
                  checked={form.captionedMeetingsSupported}
                  onChange={handleChange}
                />
                <span>Caption-enabled meetings supported</span>
              </label>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  name="quietWorkspaceAvailable"
                  checked={form.quietWorkspaceAvailable}
                  onChange={handleChange}
                />
                <span>Quiet workspace available</span>
              </label>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  name="interviewAccommodationsAvailable"
                  checked={form.interviewAccommodationsAvailable}
                  onChange={handleChange}
                />
                <span>Interview accommodations available</span>
              </label>
            </div>
          </div>

          <div className="form-section">
            <h2>Job Description</h2>

            <label>Role Summary</label>
            <textarea
              name="description"
              placeholder="Describe the role, responsibilities, legal focus, and any accessibility considerations"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Post Job'}
            </button>

            <button
              type="button"
              className="secondary"
              onClick={goHome}
              disabled={submitting}
            >
              Back Home
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EmployerPage