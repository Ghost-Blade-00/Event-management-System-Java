import React, { useState, useEffect } from 'react'
import { eventApi, regApi } from '../utils/api.js'
import {
  Card, Badge, Btn, Spinner, FillBar, Alert, Tabs, Empty, SectionHeader,
  Avatar, fmtDateTime, fmtDate, fmtTime, catIcon
} from '../components/UI.jsx'
import * as Icons from '../components/Icons.jsx'
import { DateBadge } from './Dashboard.jsx'

// ── Events List ───────────────────────────────────────────────────────────────
export function EventsList({ user, onSelect, onCreateNew }) {
  const [events, setEvents] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async (q = '') => {
    setLoading(true)
    const data = await eventApi.list(q).catch(() => null)
    setEvents(data?.content || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const canCreate = user?.role === 'ADMIN' || user?.role === 'ORGANIZER'

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <SectionHeader
        title="Events"
        subtitle="Discover, schedule, and register for upcoming events"
        action={canCreate && (
          <Btn variant="primary" onClick={onCreateNew}>
            <Icons.PlusIcon size={16} /> New Event
          </Btn>
        )}
      />

      {/* Search bar */}
      <div style={{ 
        display: 'flex', 
        gap: 12, 
        padding: '6px',
        background: 'var(--color-neutral-100)',
        borderRadius: 'var(--radius-lg)',
        alignItems: 'center'
      }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <span style={{ 
            position: 'absolute', 
            left: 14, 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: 'var(--color-neutral-400)', 
            pointerEvents: 'none',
            display: 'flex'
          }}>
            <Icons.SearchIcon size={18} />
          </span>
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && load(search)}
            placeholder="Search events by title, tag, or description..."
            style={{ 
              paddingLeft: 42, 
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-input)',
              color: 'var(--color-text-heading)',
              boxShadow: 'none'
            }} 
          />
        </div>
        <Btn onClick={() => load(search)} variant="primary">Search</Btn>
        {search && (
          <Btn onClick={() => { setSearch(''); load('') }} variant="default">
            Clear
          </Btn>
        )}
      </div>

      {loading ? <Spinner center /> : events.length === 0 ? (
        <Empty icon="search" title="No events found" subtitle="Try modifying your search keywords" />
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', 
          gap: 24 
        }}>
          {events.map(ev => <EventCard key={ev.id} ev={ev} onSelect={onSelect} />)}
        </div>
      )}
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

function EventCard({ ev, onSelect }) {
  const pct = ev.capacity > 0 ? ev.registeredCount / ev.capacity * 100 : 0
  return (
    <Card 
      hover 
      glass
      onClick={() => onSelect(ev.id)} 
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
          {ev.organizerName && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Icons.UserIcon size={16} style={{ color: 'var(--color-neutral-400)' }} />
              {ev.organizerName}
            </span>
          )}
        </div>

        {ev.description && (
          <div style={{ 
            fontSize: 15, 
            color: 'var(--color-text-muted)', 
            overflow: 'hidden', 
            display: '-webkit-box',
            WebkitLineClamp: 2, 
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.5,
            fontWeight: 400
          }}>
            {ev.description}
          </div>
        )}

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
          margin: '4px 0 0 0', 
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
}


// ── Event Detail ──────────────────────────────────────────────────────────────
export function EventDetail({ eventId, user, onBack }) {
  const [event, setEvent]             = useState(null)
  const [participants, setParticipants] = useState([])
  const [stats, setStats]             = useState(null)
  const [tab, setTab]                 = useState('details')
  const [loading, setLoading]         = useState(true)
  const [alert, setAlert]             = useState(null)
  const [regLoading, setRegLoading]   = useState(false)
  
  // Local reviews state
  const [reviews, setReviews]         = useState([])
  const [userRating, setUserRating]   = useState(5)
  const [userComment, setUserComment] = useState('')

  const load = async () => {
    setLoading(true)
    const [ev, pts, st] = await Promise.all([
      eventApi.get(eventId),
      eventApi.registrations(eventId),
      eventApi.stats(eventId),
    ]).catch(() => [null, null, null])
    setEvent(ev); setParticipants(pts?.content || []); setStats(st)
    
    // Load reviews
    const stored = localStorage.getItem(`event_reviews_\${eventId}`)
    setReviews(stored ? JSON.parse(stored) : [])
    
    setLoading(false)
  }

  useEffect(() => { load() }, [eventId])

  const doRegister = async () => {
    setRegLoading(true); setAlert(null)
    try {
      await regApi.register(eventId)
      setAlert({ type: 'success', msg: 'Registered successfully! Your ticket code has been issued.' })
      load()
    } catch (e) { setAlert({ type: 'error', msg: e.message }) }
    setRegLoading(false)
  }

  const doPublish = async () => {
    try { await eventApi.publish(eventId); load() }
    catch (e) { setAlert({ type: 'error', msg: e.message }) }
  }

  const addReview = (e) => {
    e.preventDefault()
    if (!userComment.trim()) return
    const newReview = {
      id: Date.now(),
      userName: user.fullName || user.name || 'Anonymous',
      userEmail: user.email,
      rating: userRating,
      comment: userComment.trim(),
      date: new Date().toISOString()
    }
    const updated = [newReview, ...reviews]
    setReviews(updated)
    localStorage.setItem(`event_reviews_\${eventId}`, JSON.stringify(updated))
    setUserComment('')
    setUserRating(5)
    setAlert({ type: 'success', msg: 'Thank you for your feedback!' })
  }

  if (loading) return <Spinner center />
  if (!event) return (
    <div className="fade-in">
      <Btn onClick={onBack}>
        <Icons.ArrowLeftIcon size={16} /> Back
      </Btn>
      <p style={{ marginTop: 24, fontWeight: 600, color: 'var(--color-neutral-600)' }}>Event not found.</p>
    </div>
  )

  const pct = event.capacity > 0 ? event.registeredCount / event.capacity * 100 : 0
  const isOwner = user?.role === 'ADMIN' || user?.userId === event.organizerId
  const isParticipant = !isOwner

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      {/* Navigation and Back link */}
      <div>
        <button 
          onClick={onBack}
          style={{ 
            fontSize: 13, 
            color: 'var(--color-neutral-600)', 
            background: 'none', 
            border: 'none',
            cursor: 'pointer', 
            marginBottom: '1rem', 
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--color-neutral-900)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--color-neutral-600)'}
        >
          <Icons.ArrowLeftIcon size={14} /> Back to Events
        </button>
      </div>

      {alert && <Alert type={alert.type} onClose={() => setAlert(null)}>{alert.msg}</Alert>}

      {/* Main Split-Column layout */}
      <div className="event-detail-grid">
        
        {/* LEFT COLUMN: Event Content & Tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0 }}>
          
          {/* Header Card */}
          <Card glass style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ 
                width: 64, 
                height: 64, 
                borderRadius: '16px', 
                background: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                flexShrink: 0 
              }}>
                {catIcon(event.category)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                  <Badge label={event.status} />
                  {event.category && <Badge label={event.category} />}
                  {reviews.length > 0 && (
                    <span style={{
                      background: 'rgba(245, 158, 11, 0.15)',
                      color: 'var(--color-warning-dark)',
                      fontSize: 11,
                      padding: '3px 10px',
                      borderRadius: 999,
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      border: '1px solid rgba(245, 158, 11, 0.25)'
                    }}>
                      ★ {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                    </span>
                  )}
                </div>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-text-heading)', marginBottom: 14, lineHeight: 1.2 }}>
                  {event.title}
                </h1>
                <div style={{ fontSize: 13, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
                  Organized by <Avatar name={event.organizerName} size={22} /> <strong style={{ color: 'var(--color-text-heading)' }}>{event.organizerName}</strong>
                </div>
              </div>
            </div>
            
            {event.description && (
              <div style={{ 
                marginTop: '1.75rem', 
                borderTop: '1px solid var(--color-border)',
                paddingTop: '1.5rem'
              }}>
                <h4 style={{ fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: 8 }}>
                  About Event
                </h4>
                <p style={{ fontSize: 15, color: 'var(--color-text-main)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {event.description}
                </p>
              </div>
            )}
          </Card>

          {/* Details & Schedules Tabs */}
          <div>
            <Tabs
              tabs={[
                { key: 'details',      label: 'Details' },
                { key: 'schedule',     label: 'Schedule', count: event.sessions?.length },
                { key: 'participants', label: 'Participants', count: participants.length },
                { key: 'reviews',      label: 'Reviews', count: reviews.length },
              ]}
              active={tab}
              onChange={setTab}
            />

            {tab === 'details' && (
              <Card glass style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <InfoRow Icon={Icons.CalendarIcon} label="Start Date" value={fmtDateTime(event.startDateTime)} />
                <InfoRow Icon={Icons.ClockIcon} label="End Date"   value={fmtDateTime(event.endDateTime)} />
                {event.venueAddress && <InfoRow Icon={Icons.MapPinIcon} label="Full Address" value={event.venueAddress} />}
                {event.requiresApproval && <InfoRow Icon={Icons.AlertCircleIcon} label="Approval Required" value="Yes, registrations require host approval" />}

                {stats && (
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(4, 1fr)', 
                    gap: 12, 
                    marginTop: 8,
                    paddingTop: 20, 
                    borderTop: '1px solid var(--color-border)' 
                  }}>
                    {[
                      { label: 'Confirmed',  value: stats.confirmed, color: 'var(--color-success)' },
                      { label: 'Waitlisted', value: stats.waitlisted, color: 'var(--color-warning)' },
                      { label: 'Attended',   value: stats.attended, color: 'var(--color-primary)' },
                      { label: 'Checked In', value: stats.checkedIn, color: 'var(--color-text-heading)' },
                    ].map(st => (
                      <div key={st.label} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 24, fontWeight: 800, color: st.color }}>{st.value}</div>
                        <div style={{ fontSize: 11, color: 'var(--color-neutral-400)', fontWeight: 700, textTransform: 'uppercase', marginTop: 2 }}>
                          {st.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {tab === 'schedule' && (
              <Card glass style={{ padding: 0, overflow: 'hidden' }}>
                {(!event.sessions || event.sessions.length === 0) ? (
                  <Empty icon="calendar" title="No sessions scheduled" subtitle="Check back later for agenda updates" />
                ) : event.sessions.map((s, i) => (
                  <div key={s.id} style={{
                    padding: '16px 20px', 
                    borderBottom: i < event.sessions.length - 1 ? '1px solid var(--color-neutral-100)' : 'none',
                    display: 'flex', 
                    gap: 20, 
                    alignItems: 'flex-start'
                  }}>
                    <div style={{ 
                      fontSize: 12, 
                      fontWeight: 700, 
                      color: 'var(--color-primary)', 
                      minWidth: 70,
                      paddingTop: 3, 
                      fontFamily: 'monospace' 
                    }}>
                      {s.startTime ? fmtTime(s.startTime) : '—'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-neutral-900)', marginBottom: 4 }}>{s.title}</div>
                      <div style={{ fontSize: 13, color: 'var(--color-neutral-600)', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', fontWeight: 500 }}>
                        {s.room && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icons.MapPinIcon size={14} /> {s.room}</span>}
                        {s.speakerName && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icons.UserIcon size={14} /> {s.speakerName}</span>}
                      </div>
                      {s.description && (
                        <div style={{ fontSize: 13, color: 'var(--color-neutral-600)', marginTop: 6, lineHeight: 1.5 }}>
                          {s.description}
                        </div>
                      )}
                    </div>
                    {s.type && <Badge label={s.type} />}
                  </div>
                ))}
              </Card>
            )}

            {tab === 'participants' && (
              <Card glass style={{ padding: 0, overflow: 'hidden' }}>
                {participants.length === 0 ? (
                  <Empty icon="users" title="No participants yet" subtitle="Registrations will appear here" />
                ) : participants.map((p, i) => (
                  <div key={p.id} style={{
                    padding: '14px 20px', 
                    borderBottom: i < participants.length - 1 ? '1px solid var(--color-neutral-100)' : 'none',
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 14,
                    flexWrap: 'wrap'
                  }}>
                    <Avatar name={p.userName} size={36} />
                    <div style={{ flex: 1, minWidth: 150 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-neutral-900)' }}>{p.userName}</div>
                      <div style={{ fontSize: 12, color: 'var(--color-neutral-600)', fontWeight: 500 }}>{p.userEmail}</div>
                    </div>
                    <Badge label={p.status} />
                    <span style={{ 
                      fontSize: 11, 
                      color: 'var(--color-neutral-400)', 
                      fontFamily: 'monospace', 
                      flexShrink: 0,
                      background: 'var(--color-neutral-100)',
                      padding: '3px 8px',
                      borderRadius: 6,
                      border: '1px solid var(--color-neutral-200)40'
                    }}>
                      {p.ticketCode}
                    </span>
                    {p.checkedIn && (
                      <span style={{ 
                        width: 20, 
                        height: 20, 
                        borderRadius: '50%', 
                        background: 'var(--color-success-light)', 
                        color: 'var(--color-success)',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: 11,
                        fontWeight: 900
                      }}>✓</span>
                    )}
                  </div>
                ))}
              </Card>
            )}

            {tab === 'reviews' && (
              <Card glass style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Score & Summary */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 32,
                  paddingBottom: 24,
                  borderBottom: '1px solid var(--color-border)',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ textAlign: 'center', minWidth: 120 }}>
                    <div style={{ fontSize: 48, fontWeight: 900, color: 'var(--color-text-heading)' }}>
                      {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '—'}
                    </div>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'center', margin: '4px 0', color: 'var(--color-warning)' }}>
                      {Array.from({ length: 5 }).map((_, i) => {
                        const avg = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;
                        const filled = Math.round(avg) > i;
                        return (
                          <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                          </svg>
                        )
                      })}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600 }}>
                      Out of 5.0 stars
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: 16, marginBottom: 8 }}>Rating Distribution</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {[5, 4, 3, 2, 1].map(stars => {
                        const count = reviews.filter(r => r.rating === stars).length;
                        const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                        return (
                          <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, fontWeight: 600 }}>
                            <span style={{ minWidth: 40 }}>{stars} star</span>
                            <div style={{ flex: 1, height: 6, background: 'var(--color-neutral-100)', borderRadius: 99, overflow: 'hidden' }}>
                              <div style={{ width: `${pct}%`, height: '100%', background: 'var(--color-warning)' }} />
                            </div>
                            <span style={{ minWidth: 20, textAlign: 'right' }}>{count}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Write Review Form */}
                <form onSubmit={addReview} style={{
                  background: 'var(--color-neutral-50)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16
                }}>
                  <h4 style={{ fontSize: 15, fontWeight: 800 }}>Write a Review</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-neutral-600)' }}>Your Rating:</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {[1, 2, 3, 4, 5].map(star => {
                        const filled = userRating >= star;
                        return (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setUserRating(star)}
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: 0,
                              cursor: 'pointer',
                              color: filled ? 'var(--color-warning)' : 'var(--color-neutral-300)',
                              transition: 'transform 0.1s ease',
                              display: 'flex'
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <div>
                    <textarea
                      value={userComment}
                      onChange={e => setUserComment(e.target.value)}
                      placeholder="Share your experience at this event. What went well? What could be improved?"
                      required
                      style={{ minHeight: 90, padding: 12 }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Btn type="submit" variant="primary" size="sm">
                      Submit Review
                    </Btn>
                  </div>
                </form>

                {/* Reviews List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 800 }}>Feedback Messages</h4>
                  {reviews.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)', fontSize: 13, fontWeight: 600 }}>
                      No reviews yet. Be the first to share your feedback!
                    </div>
                  ) : (
                    reviews.map(rev => (
                      <div key={rev.id} style={{
                        padding: '16px',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Avatar name={rev.userName} size={28} />
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--color-text-heading)' }}>{rev.userName}</div>
                              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{rev.userEmail}</div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <div style={{ display: 'flex', gap: 2, color: 'var(--color-warning)' }}>
                              {Array.from({ length: 5 }).map((_, i) => (
                                <svg key={i} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill={i < rev.rating ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                </svg>
                              ))}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--color-neutral-400)', marginTop: 4 }}>
                              {new Date(rev.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--color-text-main)', lineHeight: 1.5, margin: 0 }}>
                          {rev.comment}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Floating Action Drawer */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}>
          
          {/* Main Action Ticket Card */}
          <Card glass style={{
            padding: '2.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: 20
          }}>
            
            {/* Occupancy Header */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-main)' }}>Ticket Availability</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-heading)' }}>
                  {event.registeredCount} <span style={{ color: 'var(--color-neutral-400)', fontWeight: 500 }}>/ {event.capacity}</span>
                </span>
              </div>
              <FillBar pct={pct} />
              <div style={{ fontSize: 14, color: 'var(--color-text-muted)', marginTop: 8, fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>{event.availableSeats} seats remaining</span>
                {event.requiresApproval && <span style={{ color: 'var(--color-warning-dark)', marginLeft: 'auto' }}>Requires Approval</span>}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {event.status === 'PUBLISHED' && isParticipant && (
                <Btn 
                  variant="primary" 
                  onClick={doRegister} 
                  disabled={regLoading}
                  style={{ width: '100%', padding: '12px 0' }}
                >
                  {regLoading ? 'Processing...' : event.availableSeats > 0 ? 'Register for Event' : 'Join Waitlist'}
                </Btn>
              )}
              {isOwner && event.status === 'DRAFT' && (
                <Btn 
                  variant="success" 
                  onClick={doPublish}
                  style={{ width: '100%', padding: '12px 0' }}
                >
                  Publish Event
                </Btn>
              )}
              {event.status !== 'PUBLISHED' && isParticipant && (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '10px 14px', 
                  background: 'var(--color-neutral-50)', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--color-border)',
                  fontSize: 13, 
                  color: 'var(--color-text-muted)',
                  fontWeight: 600
                }}>
                  Registration Closed ({event.status.toLowerCase()})
                </div>
              )}
            </div>

            {/* Event Key Meta details */}
            <div style={{ 
              borderTop: '1px solid var(--color-border)', 
              paddingTop: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: 14
            }}>
              
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--color-neutral-400)', display: 'flex', marginTop: 2 }}>
                  <Icons.CalendarIcon size={18} />
                </span>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--color-neutral-400)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Date</div>
                  <div style={{ fontSize: 15, color: 'var(--color-text-heading)', fontWeight: 700, marginTop: 1 }}>{fmtDate(event.startDateTime)}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--color-neutral-400)', display: 'flex', marginTop: 2 }}>
                  <Icons.ClockIcon size={18} />
                </span>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--color-neutral-400)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Time</div>
                  <div style={{ fontSize: 15, color: 'var(--color-text-heading)', fontWeight: 700, marginTop: 1 }}>
                    {fmtTime(event.startDateTime)} - {fmtTime(event.endDateTime)}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--color-neutral-400)', display: 'flex', marginTop: 2 }}>
                  <Icons.MapPinIcon size={18} />
                </span>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--color-neutral-400)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Venue</div>
                  <div style={{ fontSize: 15, color: 'var(--color-text-heading)', fontWeight: 700, marginTop: 1 }}>{event.venue}</div>
                </div>
              </div>

            </div>

          </Card>

        </div>

      </div>

    </div>
  )
}

// ── Create Event ──────────────────────────────────────────────────────────────
export function CreateEvent({ onSaved, onBack }) {
  const [form, setForm] = useState({
    title: '', description: '', startDateTime: '', endDateTime: '',
    venue: '', venueAddress: '', capacity: 50,
    category: 'CONFERENCE', isPublic: true, requiresApproval: false
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked
            : e.target.type === 'number'   ? Number(e.target.value)
            : e.target.value
    setForm(f => ({ ...f, [k]: v }))
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.venue || !form.startDateTime || !form.endDateTime)
      return setError('Title, venue, start and end dates are required')
    setLoading(true); setError('')
    try {
      const ev = await eventApi.create(form)
      onSaved(ev.id)
    } catch (err) { setError(err.message) }
    setLoading(false)
  }

  const cats = ['CONFERENCE','WORKSHOP','SEMINAR','NETWORKING','WEBINAR','TRAINING','OTHER']

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      <div>
        <button 
          onClick={onBack}
          style={{ 
            fontSize: 13, 
            color: 'var(--color-neutral-600)', 
            background: 'none', 
            border: 'none',
            cursor: 'pointer', 
            marginBottom: '0.5rem', 
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--color-neutral-900)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--color-neutral-600)'}
        >
          <Icons.ArrowLeftIcon size={14} /> Back to Events
        </button>
      </div>

      <SectionHeader title="Create New Event" subtitle="Fill in the setup parameters below to host your event" />

      <Card style={{ maxWidth: 720, padding: '2rem' }}>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <FormField label="Event Title" required>
            <input value={form.title} onChange={set('title')} placeholder="Annual Tech Summit 2026" required />
          </FormField>

          <FormField label="Description">
            <textarea value={form.description} onChange={set('description')}
              placeholder="Provide a detailed overview of your event schedule, topics, speakers..." rows={4} />
          </FormField>

          <div className="grid-responsive-2">
            <FormField label="Start Date & Time" required>
              <input type="datetime-local" value={form.startDateTime} onChange={set('startDateTime')} required />
            </FormField>
            <FormField label="End Date & Time" required>
              <input type="datetime-local" value={form.endDateTime} onChange={set('endDateTime')} required />
            </FormField>
          </div>

          <FormField label="Venue Name" required>
            <input value={form.venue} onChange={set('venue')} placeholder="Convention Center, Hall A" required />
          </FormField>

          <FormField label="Venue Address">
            <input value={form.venueAddress} onChange={set('venueAddress')} placeholder="Sector 17, Chandigarh" />
          </FormField>

          <div className="grid-responsive-2">
            <FormField label="Capacity Limit" required>
              <input type="number" min={1} value={form.capacity} onChange={set('capacity')} required />
            </FormField>
            <FormField label="Event Category">
              <select value={form.category} onChange={set('category')} style={{
                cursor: 'pointer',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2364748b\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'/%3E%3C/svg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 14px center',
                backgroundSize: '16px',
                paddingRight: '40px'
              }}>
                {cats.map(c => <option key={c} value={c}>{c.toLowerCase()}</option>)}
              </select>
            </FormField>
          </div>

          <div style={{ display: 'flex', gap: 32, padding: '4px 0', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600, color: 'var(--color-neutral-700)' }}>
              <input type="checkbox" checked={form.isPublic} onChange={set('isPublic')} />
              Publicly Listed
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600, color: 'var(--color-neutral-700)' }}>
              <input type="checkbox" checked={form.requiresApproval} onChange={set('requiresApproval')} />
              Requires RSVP Approval
            </label>
          </div>

          {error && <Alert type="error" onClose={() => setError('')}>{error}</Alert>}

          <div style={{ display: 'flex', gap: 12, paddingTop: 10, borderTop: '1px solid var(--color-neutral-100)' }}>
            <Btn type="submit" variant="primary" size="lg" disabled={loading}>
              {loading ? 'Creating...' : 'Create Event'}
            </Btn>
            <Btn onClick={onBack} size="lg" variant="default">Cancel</Btn>
          </div>
        </form>
      </Card>
    </div>
  )
}

function FormField({ label, required, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--color-neutral-700)', marginBottom: 6 }}>
        {label}{required && <span style={{ color: 'var(--color-danger)', marginLeft: 3 }}>*</span>}
      </label>
      {children}
    </div>
  )
}

function InfoRow({ Icon, label, value }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <span style={{ color: 'var(--color-neutral-400)', display: 'flex', width: 20 }}><Icon size={16} /></span>
      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-neutral-600)', minWidth: 120 }}>{label}</span>
      <span style={{ fontSize: 14, color: 'var(--color-neutral-900)', fontWeight: 500 }}>{value}</span>
    </div>
  )
}
