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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const candidateToSave = {
      name: form.name,
      email: form.email,
      skills: form.skills,
      experience: parseInt(form.experience || 0),
      location: form.location,
      work_mode: form.workMode,
      notes: form.notes
    }

    const { error } = await supabase.from('candidates').insert([candidateToSave])

    if (error) {
      console.error('Error saving candidate:', error)
      alert('Failed to save candidate')
      return
    }

    onSubmitCandidate(form)
  }

  return (
    <div className="page">
      <h1>Candidate Form</h1>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="skills" placeholder="Skills (comma separated)" onChange={handleChange} />
        <input name="experience" placeholder="Years of Experience" onChange={handleChange} />
        <input name="location" placeholder="Location" onChange={handleChange} />
        <input name="workMode" placeholder="Remote / Hybrid / Onsite" onChange={handleChange} />
        <textarea
          name="notes"
          placeholder="Accessibility needs (optional)"
          onChange={handleChange}
        />

        <button type="submit">Submit</button>
      </form>

      <button className="secondary" onClick={goHome}>
        Back Home
      </button>
    </div>
  )
}

export default CandidatePage