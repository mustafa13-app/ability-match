import { useState } from 'react'

function EmployerPage({ goHome, onSubmitJob }) {
  const [form, setForm] = useState({
    title: '',
    company: '',
    requiredSkills: '',
    preferredSkills: '',
    experience: '',
    location: '',
    workMode: '',
    description: '',
    contact: '',
    email: '',
  })

  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
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
        <div className="form-header">
          <div>
            <div className="hero-badge">Employer Job Posting</div>
            <h1 className="form-title">Create a new job opportunity</h1>
            <p className="form-subtitle">
              Define the role, required skills, and accessibility-friendly work preferences so the platform can identify suitable candidates.
            </p>
          </div>
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