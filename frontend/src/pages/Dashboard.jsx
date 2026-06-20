import React, { useState, useEffect } from 'react'
import { eventApi } from '../utils/api.js'
import { Card, Spinner, Badge, FillBar, fmtDate, SectionHeader, Empty, catIcon } from '../components/UI.jsx'
import * as Icons from '../components/Icons.jsx'

export function DateBadge({ dateString }) {
  if (!dateString) return null
  const dt = new Date(dateString)
  const month = dt.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase()
  const day = dt.getDate()
  return (
    <div className="date-badge">
      <div className="date-badge-month">{month}</div>
      <div className="date-badge-day">{day}</div>
    </div>
  )
}

const getCategoryGradient = (cat) => {
  switch (cat?.toUpperCase()) {
    case 'CONFERENCE': return 'linear-gradient(135deg, #0066f2 0%, #002e8c 100%)'
    case 'WORKSHOP':   return 'linear-gradient(135deg, #10b981 0%, #065f46 100%)'
    case 'SEMINAR':    return 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)'
    case 'NETWORKING': return 'linear-gradient(135deg, #ec4899 0%, #9d174d 100%)'
    case 'WEBINAR':    return 'linear-gradient(135deg, #6366f1 0%, #3730a3 100%)'
    case 'TRAINING':   return 'linear-gradient(135deg, #8b5cf6 0%, #5b21b6 100%)'
    default:           return 'linear-gradient(135deg, #64748b 0%, #334155 100%)'
  }
}

const getCategoryFallbackImage = (cat) => {
  switch (cat?.toUpperCase()) {
    case 'CONFERENCE': return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60'
    case 'WORKSHOP':   return 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=60'
    case 'SEMINAR':    return 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=60'
    case 'NETWORKING': return 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=60'
    case 'WEBINAR':    return 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&auto=format&fit=crop&q=60'
    case 'TRAINING':   return 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=60'
    default:           return 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop&q=60'
  }
}

export default function Dashboard({ user, onNavigate, onSelectEvent }) {
  const [stats, setStats] = useState(null)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([eventApi.dashboard(), eventApi.list('')]).then(([s, e]) => {
      setStats(s)
      setEvents((e?.content || []).slice(0, 6))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  if (loading) return <Spinner center />

  const metrics = [
    { label: 'Total Events',     value: stats?.totalEvents     ?? 0, Icon: Icons.CalendarIcon, bg: '#f5f3ff', fg: '#6d28d9' },
    { label: 'Published',        value: stats?.publishedEvents ?? 0, Icon: Icons.CheckInIcon, bg: '#ecfdf5', fg: '#047857' },
    { label: 'Upcoming (30d)',   value: stats?.upcomingEvents  ?? 0, Icon: Icons.ClockIcon, bg: '#fffbeb', fg: '#b45309' },
    { label: 'Total Registered', value: stats?.totalRegistrations ?? 0, Icon: Icons.TicketIcon, bg: '#eff6ff', fg: '#1d4ed8' },
    { label: 'Avg Fill Rate',    value: `${(stats?.avgFillRate ?? 0).toFixed(1)}%`, Icon: Icons.DashboardIcon, bg: '#f0fdf4', fg: '#16a34a' },
    { label: 'Total Users',      value: stats?.totalUsers      ?? 0, Icon: Icons.UserIcon, bg: '#fff1f2', fg: '#be123c' },
  ]

  const isDay = hour >= 5 && hour < 18;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
      
      {/* Hero greeting banner using glassmorphism with dynamic glowing background */}
      <Card glass={true} style={{
        padding: '2.5rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        borderLeft: '5px solid var(--color-primary)'
      }}>
        <style>{`
          @keyframes rotate-sun {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes twinkle-star {
            0%, 100% { opacity: 0.3; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
          }
          @keyframes pulse-sun-glow {
            0%, 100% { transform: scale(1); opacity: 0.6; }
            50% { transform: scale(1.15); opacity: 0.9; }
          }
        `}</style>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: 'var(--color-text-heading)', marginBottom: 8, letterSpacing: '-0.03em' }}>
            {greeting}, {user?.fullName?.split(' ')[0]}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 16, fontWeight: 500 }}>
            Welcome back to Planify! Here is a summary of your event metrics and upcoming schedules.
          </p>
        </div>
        {/* Dynamic Sun or Moon & Stars */}
        {isDay ? (
          <div style={{
            position: 'absolute',
            top: '50%',
            right: '5%',
            transform: 'translateY(-50%)',
            width: 120,
            height: 120,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1
          }}>
            <div style={{
              position: 'absolute',
              width: 140,
              height: 140,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.25) 0%, transparent 70%)',
              animation: 'pulse-sun-glow 4s infinite ease-in-out'
            }} />
            <svg 
              width="80" 
              height="80" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#fbbf24" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{ animation: 'rotate-sun 25s linear infinite', filter: 'drop-shadow(0 0 12px rgba(251, 191, 36, 0.4))' }}
            >
              <circle cx="12" cy="12" r="4" fill="#fbbf24" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="M4.93 4.93l1.41 1.41" />
              <path d="M17.66 17.66l1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="M6.34 17.66l-1.41 1.41" />
              <path d="M19.07 4.93l-1.41 1.41" />
            </svg>
          </div>
        ) : (
          <div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            width: 200,
            pointerEvents: 'none',
            zIndex: 1,
            overflow: 'hidden'
          }}>
            <svg 
              width="54" 
              height="54" 
              viewBox="0 0 24 24" 
              fill="#e2e8f0" 
              stroke="#cbd5e1" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{
                position: 'absolute',
                top: '50%',
                right: '40px',
                transform: 'translateY(-50%)',
                filter: 'drop-shadow(0 0 16px rgba(226, 232, 240, 0.35))'
              }}
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
            <span style={{ position: 'absolute', top: '25%', right: '120px', animation: 'twinkle-star 2s infinite ease-in-out', color: '#f8fafc', fontSize: 10 }}>★</span>
            <span style={{ position: 'absolute', top: '70%', right: '90px', animation: 'twinkle-star 3s infinite 0.5s ease-in-out', color: '#f8fafc', fontSize: 14 }}>★</span>
            <span style={{ position: 'absolute', top: '40%', right: '150px', animation: 'twinkle-star 2.5s infinite 1s ease-in-out', color: '#f8fafc', fontSize: 8 }}>★</span>
            <span style={{ position: 'absolute', top: '80%', right: '160px', animation: 'twinkle-star 3.5s infinite 0.2s ease-in-out', color: '#cbd5e1', fontSize: 9 }}>★</span>
            <span style={{ position: 'absolute', top: '15%', right: '70px', animation: 'twinkle-star 1.8s infinite 0.7s ease-in-out', color: '#cbd5e1', fontSize: 11 }}>★</span>
          </div>
        )}
      </Card>

      {/* Planify Introduction Guide Card */}
      <Card glass={true} style={{
        padding: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        <div>
          <h3 style={{ fontSize: 26, fontWeight: 800, color: 'var(--color-text-heading)', display: 'flex', alignItems: 'center', gap: 8 }}>
            Getting Started with Planify
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 16, fontWeight: 500, marginTop: 4 }}>
            New to the app? Here is a quick 3-step guide to get you up and running:
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {/* Step 1 */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 16,
              flexShrink: 0
            }}>
              1
            </div>
            <div>
              <h4 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-heading)' }}>Browse Events</h4>
              <p style={{ fontSize: 15, color: 'var(--color-text-muted)', marginTop: 4, lineHeight: 1.4 }}>
                Explore virtual webinars, conferences, and workshops in the <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('events'); }} style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Events</a> tab.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              backgroundColor: 'var(--color-success-light)',
              color: 'var(--color-success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 16,
              flexShrink: 0
            }}>
              2
            </div>
            <div>
              <h4 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-heading)' }}>Register & Get Ticket</h4>
              <p style={{ fontSize: 15, color: 'var(--color-text-muted)', marginTop: 4, lineHeight: 1.4 }}>
                Select an event and click "Register". Your ticket with a unique verification code will appear under the <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('myregs'); }} style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>My Tickets</a> tab.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              backgroundColor: 'var(--color-warning-light)',
              color: 'var(--color-warning)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 16,
              flexShrink: 0
            }}>
              3
            </div>
            <div>
              <h4 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-heading)' }}>Check-In at Venue</h4>
              <p style={{ fontSize: 15, color: 'var(--color-text-muted)', marginTop: 4, lineHeight: 1.4 }}>
                At the door, host organizers will scan or enter your ticket code in the <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('checkin'); }} style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Check-In Tool</a> for validation.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Metrics */}
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 16 }}>
          {metrics.map(m => (
            <div key={m.label} className="glass-card" style={{
              borderRadius: 'var(--radius-lg)', 
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: 48, 
                height: 48, 
                borderRadius: '12px', 
                background: m.bg, 
                color: m.fg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20
              }}>
                <m.Icon size={24} strokeWidth={2} />
              </div>
              <div style={{ fontSize: 34, fontWeight: 800, color: 'var(--color-text-heading)', lineHeight: 1.1, fontFamily: 'var(--font-display)' }}>
                {m.value}
              </div>
              <div style={{ fontSize: 14, color: 'var(--color-text-muted)', marginTop: 6, fontWeight: 600 }}>
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent events */}
      <div>
        <SectionHeader
          title="Recent Events"
          subtitle={`${events.length} event${events.length !== 1 ? 's' : ''} shown`}
          action={
            <button 
              onClick={() => onNavigate('events')}
              style={{ 
                fontSize: 13, 
                color: 'var(--color-primary)', 
                background: 'none', 
                border: 'none',
                fontWeight: 700, 
                cursor: 'pointer', 
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary-dark)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-primary)'}
            >
              View all events <span style={{ transition: 'transform 0.15s ease' }}>→</span>
            </button>
          }
        />

        {events.length === 0 ? (
          <Empty icon="calendar" title="No events yet" subtitle="Create your first event to get started" />
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', 
            gap: 24 
          }}>
            {events.map(ev => {
              const pct = ev.capacity > 0 ? ev.registeredCount / ev.capacity * 100 : 0
              return (
                <Card 
                  key={ev.id} 
                  hover 
                  glass={true}
                  onClick={() => { onSelectEvent(ev.id); onNavigate('events') }}
                  style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                >
                  {/* Category Image Cover */}
                  <div style={{
                    height: 220,
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <img 
                      src={ev.imageUrl || getCategoryFallbackImage(ev.category)} 
                      alt={ev.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                      className="event-card-img"
                    />
                    <div style={{
                      position: 'absolute',
                      top: 0, left: 0, right: 0, bottom: 0,
                      background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.5) 100%)'
                    }} />
                    <div style={{
                      position: 'absolute',
                      bottom: 12,
                      left: 12,
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(8px)',
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 800,
                      color: '#ffffff',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      border: '1px solid rgba(255,255,255,0.25)'
                    }}>
                      {ev.category || 'EVENT'}
                    </div>
                    <div style={{ position: 'absolute', top: 12, right: 12 }}>
                      <Badge label={ev.status} />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ 
                        fontSize: 13, 
                        fontWeight: 800, 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.05em', 
                        color: 'var(--color-primary)' 
                      }}>
                        {ev.category || 'EVENT'}
                      </span>
                      <span style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 600 }}>
                        {fmtDate(ev.startDateTime)}
                      </span>
                    </div>

                    <h4 style={{ 
                      fontSize: 20, 
                      fontWeight: 800, 
                      color: 'var(--color-text-heading)', 
                      lineHeight: 1.3,
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {ev.title}
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 15, color: 'var(--color-text-muted)', fontWeight: 500 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <Icons.ClockIcon size={16} style={{ color: 'var(--color-neutral-400)' }} />
                        {new Date(ev.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <Icons.MapPinIcon size={16} style={{ color: 'var(--color-neutral-400)' }} />
                        {ev.venue}
                      </span>
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 4 }}>
                        <span>Registrations</span>
                        <span>{ev.registeredCount} / {ev.capacity}</span>
                      </div>
                      <FillBar pct={pct} />
                    </div>

                    <div style={{ 
                      borderTop: '1px solid var(--color-border)', 
                      paddingTop: 10, 
                      marginTop: 4, 
                      fontSize: 15, 
                      color: 'var(--color-primary)', 
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      View details & register <span>→</span>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Detailed About section removed from here to Footer */}
    </div>
  )
}
