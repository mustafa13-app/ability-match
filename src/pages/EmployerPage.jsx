import { useState } from 'react'
import { supabase } from '../lib/supabase'

function EmployerPage({ goHome, onSubmitJob }) {
  const [form, setForm] = useState({
    company: '',
    contact: '',
    email: '',
    title: '',
    description: '',
    requiredSkills: '',
    preferredSkills: '',
    location: '',
    workMode: '',
    experience: ''
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const jobToSave = {
      company: form.company,
      contact: form.contact,
      email: form.email,
      title: form.title,
      description: form.description,
      required_skills: form.requiredSkills,
      preferred_skills: form.preferredSkills,
      location: form.location,
      work_mode: form.workMode,
      experience: parseInt(form.experience || 0)
    }

    const { error } = await supabase.from('jobs').insert([jobToSave])

    if (error) {
      console.error('Error saving job:', error)
      alert('Failed to save job')
      return
    }

    onSubmitJob(form)
  }

  return (
    <div className="page">
      <h1>Employer Job Form</h1>

      <form onSubmit={handleSubmit}>
        <input name="company" placeholder="Company Name" onChange={handleChange} />
        <input name="contact" placeholder="Contact Name" onChange={handleChange} />
        <input name="email" placeholder="Contact Email" onChange={handleChange} />
        <input name="title" placeholder="Job Title" onChange={handleChange} />
        <textarea name="description" placeholder="Job Description" onChange={handleChange} />
        <input name="requiredSkills" placeholder="Required Skills" onChange={handleChange} />
        <input name="preferredSkills" placeholder="Preferred Skills" onChange={handleChange} />
        <input name="location" placeholder="Location" onChange={handleChange} />
        <input name="workMode" placeholder="Remote / Hybrid / Onsite" onChange={handleChange} />
        <input name="experience" placeholder="Experience Level" onChange={handleChange} />

        <button type="submit">Submit Job</button>
      </form>

      <button className="secondary" onClick={goHome}>
        Back Home
      </button>
    </div>
  )
}

export default EmployerPage