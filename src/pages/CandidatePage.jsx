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
    const fileName = `${Date.now()}-${form.name || 'candidate'}.${fileExt}`
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
      <h1>Candidate Form</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="skills"
          placeholder="Skills (comma separated)"
          value={form.skills}
          onChange={handleChange}
        />
        <input
          name="experience"
          placeholder="Years of Experience"
          value={form.experience}
          onChange={handleChange}
        />
        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
        />
        <input
          name="workMode"
          placeholder="Remote / Hybrid / Onsite"
          value={form.workMode}
          onChange={handleChange}
        />
        <textarea
          name="notes"
          placeholder="Accessibility needs (optional)"
          value={form.notes}
          onChange={handleChange}
        />

        <label style={{ display: 'block', marginTop: '12px', marginBottom: '6px' }}>
          Upload CV
        </label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
        />

        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      <button className="secondary" onClick={goHome} disabled={submitting}>
        Back Home
      </button>
    </div>
  )
}

export default CandidatePage