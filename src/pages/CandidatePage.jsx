import { useState } from 'react'
import { supabase } from '../lib/supabase'

function CandidatePage({ goHome, onSubmitCandidate }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    skills: '',
    experience: '',
    location: '',
    workMode: '',
    notes: ''
  })

  const [cvFile, setCvFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null
    setCvFile(file)
  }

  const uploadCv = async () => {
    if (!cvFile) return null

    const fileExt = cvFile.name.split('.').pop()
    const safeName = (form.name || 'candidate').replace(/\s+/g, '-').toLowerCase()
    const fileName = `${Date.now()}-${safeName}.${fileExt}`
    const filePath = fileName

    const { error: uploadError } = await supabase.storage
      .from('cvs')
      .upload(filePath, cvFile, {
        upsert: false
      })

    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage.from('cvs').getPublicUrl(filePath)
    return data.publicUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const cvUrl = await uploadCv()

      const candidateToSave = {
        name: form.name,
        email: form.email,
        skills: form.skills,
        experience: parseInt(form.experience || 0),
        location: form.location,
        work_mode: form.workMode,
        notes: form.notes,
        cv_url: cvUrl
      }

      await onSubmitCandidate(candidateToSave)
    } catch (error) {
      console.error('Error saving candidate:', error)
      alert('Failed to save candidate')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page">
      <div className="form-shell">
        <div className="form-header">
          <div>
            <div className="hero-badge">Candidate Application</div>
            <h1 className="form-title">Create your candidate profile</h1>
            <p className="form-subtitle">
              Share your background, skills, and CV so employers can assess your fit more effectively.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-section">
            <h2>Basic Information</h2>

            <div className="form-grid">
              <div>
                <label>Full Name</label>
                <input
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>Email Address</label>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Professional Profile</h2>

            <div className="form-grid">
              <div>
                <label>Skills</label>
                <input
                  name="skills"
                  placeholder="Example: JavaScript, React, Testing"
                  value={form.skills}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Years of Experience</label>
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
                <label>Work Preference</label>
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
            <h2>Additional Information</h2>

            <label>Accessibility Notes</label>
            <textarea
              name="notes"
              placeholder="Share any accessibility requirements or additional context"
              value={form.notes}
              onChange={handleChange}
            />
          </div>

          <div className="form-section">
            <h2>CV Upload</h2>
            <p className="field-help">
              Upload your CV in PDF, DOC, or DOCX format.
            </p>

            <div className="upload-box">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
              {cvFile && <p className="upload-file-name">Selected: {cvFile.name}</p>}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Profile'}
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

export default CandidatePage