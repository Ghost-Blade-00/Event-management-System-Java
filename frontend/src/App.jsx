import React, { useState, useEffect } from 'react'
import { getUser, clearSession, saveSession } from './utils/api.js'
import AuthPage from './pages/AuthPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import { EventsList, EventDetail, CreateEvent } from './pages/EventsPage.jsx'
import CheckInPage from './pages/CheckInPage.jsx'
import MyRegistrations from './pages/MyRegistrations.jsx'
import SupportPage from './pages/SupportPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Chatbot from './components/Chatbot.jsx'

export default function App() {
  const [user, setUser]             = useState(() => getUser())
  const [page, setPage]             = useState('dashboard')
  const [selectedEvent, setSelectedEvent] = useState(null)  // event id
  const [showCreate, setShowCreate] = useState(false)
  const [theme, setTheme]           = useState(() => {
    return localStorage.getItem('theme') || 'dark'
  })

  // Navigation History Stack
  const [historyStack, setHistoryStack] = useState(['dashboard'])
  const [historyPointer, setHistoryPointer] = useState(0)

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    if (!user) return

    const handlePopState = (e) => {
      const targetPage = (e.state && e.state.page) || window.location.hash.replace('#', '') || 'dashboard'
      setPage(targetPage)
      
      setHistoryStack(prevStack => {
        const idx = prevStack.indexOf(targetPage)
        if (idx !== -1) {
          setHistoryPointer(idx)
          return prevStack
        } else {
          setHistoryPointer(0)
          return [targetPage]
        }
      })
    }

    if (window.history.replaceState) {
      window.history.replaceState({ page: page }, '', `#${page}`)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [user, page])

  const handleLogin = (data) => {
    saveSession(data)
    setUser(data)
    setPage('dashboard')
    setHistoryStack(['dashboard'])
    setHistoryPointer(0)
    if (window.history.pushState) {
      window.history.pushState({ page: 'dashboard' }, '', '#dashboard')
    }
  }

  const handleLogout = () => {
    clearSession()
    setUser(null)
    setPage('dashboard')
    setSelectedEvent(null)
    if (window.history.pushState) {
      window.history.pushState(null, '', '/')
    }
  }

  const navigate = (pg) => {
    const newStack = historyStack.slice(0, historyPointer + 1);
    if (newStack[newStack.length - 1] !== pg) {
      newStack.push(pg);
      if (window.history.pushState) {
        window.history.pushState({ page: pg }, '', `#${pg}`);
      }
    }
    setHistoryStack(newStack);
    setHistoryPointer(newStack.length - 1);
    setPage(pg);
    if (pg !== 'events') {
      setSelectedEvent(null);
      setShowCreate(false);
    }
  }

  const goBack = () => {
    window.history.back()
  }

  const goForward = () => {
    window.history.forward()
  }

  // ── Not logged in ──────────────────────────────────────────────
  if (!user) return <AuthPage onLogin={handleLogin} />

  // ── Decide what to render in main area ────────────────────────
  const renderMain = () => {
    if (page === 'events') {
      if (showCreate) {
        return (
          <CreateEvent
            onSaved={(id) => { setShowCreate(false); setSelectedEvent(id) }}
            onBack={() => setShowCreate(false)}
          />
        )
      }
      if (selectedEvent) {
        return (
          <EventDetail
            eventId={selectedEvent}
            user={user}
            onBack={() => setSelectedEvent(null)}
          />
        )
      }
      return (
        <EventsList
          user={user}
          onSelect={(id) => setSelectedEvent(id)}
          onCreateNew={() => setShowCreate(true)}
        />
      )
    }

    switch (page) {
      case 'dashboard':
        return (
          <Dashboard
            user={user}
            onNavigate={navigate}
            onSelectEvent={(id) => setSelectedEvent(id)}
          />
        )
      case 'checkin':
        return <CheckInPage />
      case 'myregs':
        return (
          <MyRegistrations
            onSelectEvent={(id) => setSelectedEvent(id)}
            onNavigate={navigate}
          />
        )
      case 'support':
        return <SupportPage />
      case 'about':
        return <AboutPage />
      default:
        return null
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-body)' }}>
      <Navbar
        page={page}
        setPage={navigate}
        user={user}
        onLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
        canGoBack={historyPointer > 0}
        canGoForward={historyPointer < historyStack.length - 1}
        goBack={goBack}
        goForward={goForward}
      />
      <main className="main-content-layout" style={{ flex: 1 }}>
        {renderMain()}
      </main>
      <Footer onNavigate={navigate} />
      <Chatbot user={user} />
    </div>
  )
}
