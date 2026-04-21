import { useEffect, useState } from 'react'
import './App.css'

import HomePage from './pages/HomePage'
import CandidatePage from './pages/CandidatePage'
import EmployerPage from './pages/EmployerPage'
import AdminPage from './pages/AdminPage'
import MatchesPage from './pages/MatchesPage'
import { supabase } from './lib/supabase'

function App() {
  const [page, setPage] = useState('home')
  const [candidates, setCandidates] = useState([])
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)

    const [{ data: candidateData, error: candidateError }, { data: jobData, error: jobError }] =
      await Promise.all([
        supabase.from('candidates').select('*').order('created_at', { ascending: false }),
        supabase.from('jobs').select('*').order('created_at', { ascending: false }),
      ])

    if (candidateError) {
      console.error('Error loading candidates:', candidateError)
    } else {
      setCandidates(candidateData || [])
    }

    if (jobError) {
      console.error('Error loading jobs:', jobError)
    } else {
      setJobs(jobData || [])
    }

    setLoading(false)
  }

  const addCandidate = async (candidate) => {
    const { error } = await supabase.from('candidates').insert([candidate])

    if (error) {
      console.error('Error adding candidate:', error)
      alert('Failed to save candidate')
      return
    }

    await loadData()
    setPage('admin')
  }

  const addJob = async (job) => {
    const { error } = await supabase.from('jobs').insert([job])

    if (error) {
      console.error('Error adding job:', error)
      alert('Failed to save job')
      return
    }

    await loadData()
    setPage('admin')
  }

  if (loading) {
    return (
      <div className="page">
        <h1>Loading...</h1>
      </div>
    )
  }

  switch (page) {
    case 'candidate':
      return (
        <CandidatePage
          goHome={() => setPage('home')}
          onSubmitCandidate={addCandidate}
        />
      )

    case 'employer':
      return (
        <EmployerPage
          goHome={() => setPage('home')}
          onSubmitJob={addJob}
        />
      )

    case 'admin':
      return (
        <AdminPage
          goHome={() => setPage('home')}
          candidates={candidates}
          jobs={jobs}
        />
      )

    case 'matches':
      return (
        <MatchesPage
          goHome={() => setPage('home')}
          candidates={candidates}
          jobs={jobs}
        />
      )

    case 'home':
    default:
      return <HomePage goTo={setPage} />
  }
}

export default App