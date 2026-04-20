import { useState, useEffect } from 'react'
import './App.css'

import HomePage from './pages/HomePage'
import CandidatePage from './pages/CandidatePage'
import EmployerPage from './pages/EmployerPage'
import AdminPage from './pages/AdminPage'
import MatchesPage from './pages/MatchesPage'

function App() {
  const [page, setPage] = useState('home')
  const [candidates, setCandidates] = useState(() => {
    try {
      const saved = localStorage.getItem('candidates')
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error('Error loading candidates from localStorage:', error)
      return []
    }
  })

  const [jobs, setJobs] = useState(() => {
    try {
      const saved = localStorage.getItem('jobs')
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error('Error loading jobs from localStorage:', error)
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('candidates', JSON.stringify(candidates))
    } catch (error) {
      console.error('Error saving candidates to localStorage:', error)
    }
  }, [candidates])

  useEffect(() => {
    try {
      localStorage.setItem('jobs', JSON.stringify(jobs))
    } catch (error) {
      console.error('Error saving jobs to localStorage:', error)
    }
  }, [jobs])

  const addCandidate = (candidate) => {
    setCandidates((prev) => [...prev, candidate])
    setPage('admin')
  }

  const addJob = (job) => {
    setJobs((prev) => [...prev, job])
    setPage('admin')
  }

  if (page === 'candidate') {
    return (
      <CandidatePage
        goHome={() => setPage('home')}
        onSubmitCandidate={addCandidate}
      />
    )
  }

  if (page === 'employer') {
    return (
      <EmployerPage
        goHome={() => setPage('home')}
        onSubmitJob={addJob}
      />
    )
  }

  if (page === 'admin') {
    return (
      <AdminPage
        goHome={() => setPage('home')}
        candidates={candidates}
        jobs={jobs}
      />
    )
  }

  if (page === 'matches') {
    return (
      <MatchesPage
        goHome={() => setPage('home')}
        candidates={candidates}
        jobs={jobs}
      />
    )
  }

  return <HomePage goTo={setPage} />
}

export default App