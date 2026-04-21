import { useEffect, useState } from 'react'
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
      const parsed = saved ? JSON.parse(saved) : []
      return Array.isArray(parsed) ? parsed : []
    } catch (error) {
      console.error('Error loading candidates from localStorage:', error)
      return []
    }
  })

  const [jobs, setJobs] = useState(() => {
    try {
      const saved = localStorage.getItem('jobs')
      const parsed = saved ? JSON.parse(saved) : []
      return Array.isArray(parsed) ? parsed : []
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
    const candidateWithId = {
      id: crypto.randomUUID(),
      ...candidate,
      createdAt: new Date().toISOString(),
    }

    setCandidates((prev) => [...prev, candidateWithId])
    setPage('admin')
  }

  const addJob = (job) => {
    const jobWithId = {
      id: crypto.randomUUID(),
      ...job,
      createdAt: new Date().toISOString(),
    }

    setJobs((prev) => [...prev, jobWithId])
    setPage('admin')
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
          goTo={setPage}
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