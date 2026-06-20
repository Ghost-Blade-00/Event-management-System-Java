import React, { useState, useEffect } from 'react'
import { regApi } from '../utils/api.js'
import { Card, Spinner, Badge, Empty, SectionHeader, fmtDate, fmtDateTime } from '../components/UI.jsx'
import * as Icons from '../components/Icons.jsx'

export function Barcode({ code }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, margin: '1.5rem 0' }}>
      <div style={{ display: 'flex', height: 60, alignItems: 'stretch', background: '#000', padding: '0 10px', borderRadius: 4, overflow: 'hidden' }}>
        {Array.from({ length: 45 }).map((_, i) => {
          const width = (i % 3 === 0) ? 3 : (i % 5 === 0) ? 1 : 2;
          const color = (i % 2 === 0) ? '#000' : '#fff';
          return <div key={i} style={{ width, backgroundColor: color }} />;
        })}
      </div>
      <span style={{ fontFamily: 'monospace', fontSize: 13, letterSpacing: 4, fontWeight: 700, color: 'var(--color-text-muted)' }}>{code}</span>
    </div>
  )
}

export default function MyRegistrations({ onSelectEvent, onNavigate }) {
  const [regs, setRegs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBadgeReg, setSelectedBadgeReg] = useState(null)

  useEffect(() => {
    regApi.mine()
      .then(d => { setRegs(d?.content || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const grouped = {
    upcoming: regs.filter(r => r.status === 'CONFIRMED' && new Date(r.eventStartDateTime) > new Date()),
    past:     regs.filter(r => r.status === 'ATTENDED'  || (r.status === 'CONFIRMED' && new Date(r.eventStartDateTime) <= new Date())),
    waitlist: regs.filter(r => r.status === 'WAITLISTED'),
    cancelled:regs.filter(r => r.status === 'CANCELLED'),
  }

  return (
    <div className="fade-in">
      <SectionHeader
        title="My Tickets & Registrations"
        subtitle={`You have registered for ${regs.length} event${regs.length !== 1 ? 's' : ''}`}
      />

      {loading ? <Spinner center /> : regs.length === 0 ? (
        <Empty icon="ticket" title="No registrations found"
          subtitle="Explore our active events and sign up for tickets" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {[
            { key: 'upcoming',  label: 'Upcoming Events', Icon: Icons.CalendarIcon, color: 'var(--color-primary)' },
            { key: 'waitlist',  label: 'Waitlisted', Icon: Icons.ClockIcon, color: 'var(--color-warning)' },
            { key: 'past',      label: 'Attended Events', Icon: Icons.CheckIcon, color: 'var(--color-success)' },
            { key: 'cancelled', label: 'Cancelled', Icon: Icons.XIcon, color: 'var(--color-danger)' },
          ].filter(g => grouped[g.key].length > 0).map(group => (
            <div key={group.key}>
              <div style={{ 
                fontSize: 14, 
                fontWeight: 800, 
                color: group.color,
                marginBottom: 14, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8,
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                <group.Icon size={16} strokeWidth={2.5} />
                <span>{group.label}</span>
                <span style={{ 
                  background: `\${group.color}15`, 
                  color: group.color,
                  padding: '2px 8px', 
                  borderRadius: 99, 
                  fontSize: 11,
                  fontWeight: 700 
                }}>
                  {grouped[group.key].length}
                </span>
              </div>

              <div style={{ display: 'grid', gap: 12 }}>
                {grouped[group.key].map(r => (
                  <RegCard 
                    key={r.id} 
                    reg={r}
                    onClick={() => { onSelectEvent(r.eventId); onNavigate('events') }} 
                    onViewBadge={setSelectedBadgeReg}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedBadgeReg && (
        <div className="modal-overlay" onClick={() => setSelectedBadgeReg(null)}>
          <div className="modal-content printable-badge-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420, padding: 0, border: 'none', background: 'transparent' }}>
            <Card glass style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', border: '1px solid var(--color-glass-border)' }}>
              
              {/* Close Button */}
              <button 
                onClick={() => setSelectedBadgeReg(null)}
                className="no-print"
                style={{
                  position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex'
                }}
              >
                <Icons.XIcon size={20} />
              </button>

              {/* Badge Header Branding */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '2rem' }}>
                <Icons.PlanifyLogo size={36} />
                <span style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '-0.5px' }}>
                  <span style={{ color: '#0066f2' }}>Plani</span>
                  <span style={{ color: 'var(--color-text-heading)' }}>fy</span>
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', background: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '2px 8px', borderRadius: 99, marginLeft: 8 }}>
                  Pass
                </span>
              </div>

              {/* Attendee Name & Details */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--color-text-heading)', marginBottom: 4 }}>
                  {selectedBadgeReg.userName}
                </div>
                <div style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  {selectedBadgeReg.userEmail}
                </div>
              </div>

              {/* Event Card */}
              <div style={{
                width: '100%',
                background: 'var(--color-neutral-100)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                marginBottom: '1.5rem',
                textAlign: 'left'
              }}>
                <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: 4 }}>
                  Event
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-text-heading)', marginBottom: 6 }}>
                  {selectedBadgeReg.eventTitle}
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icons.CalendarIcon size={12} />
                  {fmtDateTime(selectedBadgeReg.eventStartDateTime)}
                </div>
              </div>

              {/* Barcode */}
              <Barcode code={selectedBadgeReg.ticketCode} />

              {/* Status Badge */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: '1rem' }}>
                <Badge label={selectedBadgeReg.status} />
                {selectedBadgeReg.checkedIn && <Badge label="ATTENDED" />}
              </div>

              {/* Print Action */}
              <div style={{ marginTop: '2rem', width: '100%' }} className="no-print">
                <button 
                  style={{
                    width: '100%',
                    background: 'var(--color-primary)',
                    color: '#ffffff',
                    borderColor: 'var(--color-primary)',
                    boxShadow: '0 2px 10px rgba(79, 70, 229, 0.25)',
                    padding: '11px 22px',
                    fontSize: 15,
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    border: '1px solid var(--color-border)'
                  }}
                  onClick={() => window.print()}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9" />
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                    <rect x="6" y="14" width="12" height="8" />
                  </svg>
                  Print Attendee Pass
                </button>
              </div>

            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

function getStatusIcon(status) {
  const map = {
    CONFIRMED:  { Icon: Icons.CheckIcon, bg: 'var(--color-success-light)', fg: 'var(--color-success)' },
    ATTENDED:   { Icon: Icons.CheckIcon, bg: 'var(--color-primary-light)', fg: 'var(--color-primary)' },
    WAITLISTED: { Icon: Icons.ClockIcon, bg: 'var(--color-warning-light)', fg: 'var(--color-warning)' },
    CANCELLED:  { Icon: Icons.XIcon, bg: 'var(--color-danger-light)', fg: 'var(--color-danger)' },
    PENDING:    { Icon: Icons.ClockIcon, bg: 'var(--color-neutral-100)', fg: 'var(--color-neutral-600)' },
    NO_SHOW:    { Icon: Icons.XIcon, bg: 'var(--color-neutral-100)', fg: 'var(--color-neutral-400)' },
  }
  const config = map[status] || { Icon: Icons.CalendarIcon, bg: 'var(--color-neutral-50)', fg: 'var(--color-neutral-400)' }
  return (
    <div style={{ 
      width: 48, 
      height: 48, 
      borderRadius: '12px', 
      background: config.bg, 
      color: config.fg,
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      flexShrink: 0, 
      border: `1px solid ${config.fg}15`
    }}>
      <config.Icon size={20} strokeWidth={2.2} />
    </div>
  )
}

function RegCard({ reg, onClick, onViewBadge }) {
  return (
    <Card hover glass onClick={onClick} style={{ padding: '18px 22px' }}>
      <div className="event-card-inner">
        
        <div className="event-card-left">
          {/* Styled Status Icon */}
          {getStatusIcon(reg.status)}

          {/* Main Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ 
              fontWeight: 700, 
              fontSize: 18, 
              color: 'var(--color-text-heading)', 
              marginBottom: 4,
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap' 
            }}>
              {reg.eventTitle || 'Event'}
            </div>
            <div style={{ fontSize: 14, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 12, fontWeight: 500 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Icons.CalendarIcon size={14} style={{ color: 'var(--color-neutral-400)' }} />
                {fmtDate(reg.eventStartDateTime)}
              </span>
              {reg.registeredAt && (
                <span style={{ color: 'var(--color-text-muted)' }}>
                  Registered {fmtDate(reg.registeredAt)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right side info */}
        <div className="event-card-right" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Badge label={reg.status} />

          {reg.ticketCode && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ 
                fontSize: 13, 
                fontFamily: 'monospace', 
                color: 'var(--color-text-muted)',
                background: 'var(--color-neutral-100)', 
                padding: '3px 8px',
                borderRadius: 6, 
                display: 'inline-block',
                fontWeight: 700,
                border: '1px solid var(--color-border)'
              }}>
                {reg.ticketCode}
              </div>
              <button
                className="no-print"
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(reg.ticketCode);
                  const btn = e.currentTarget;
                  const originalHtml = btn.innerHTML;
                  btn.innerHTML = '<span style="font-size: 10px; color: var(--color-success); font-weight: 700;">Copied!</span>';
                  setTimeout(() => { btn.innerHTML = originalHtml; }, 1500);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'inline-flex',
                  color: 'var(--color-neutral-400)',
                  transition: 'color 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--color-neutral-400)'}
                title="Copy Ticket Code"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </button>
            </div>
          )}

          {reg.waitlistPosition && (
            <div style={{ fontSize: 13, color: 'var(--color-warning-dark)', fontWeight: 700 }}>
              Waitlist Position #{reg.waitlistPosition}
            </div>
          )}

          {reg.checkedIn && (
            <div style={{ 
              fontSize: 13, 
              color: 'var(--color-success-dark)', 
              fontWeight: 700, 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: 4 
            }}>
              <span style={{ 
                width: 14, 
                height: 14, 
                borderRadius: '50%', 
                background: 'var(--color-success)', 
                color: '#fff', 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: 9 
              }}>✓</span>
              Checked In {reg.checkedInAt ? fmtDateTime(reg.checkedInAt).split(',')[1]?.trim() : ''}
            </div>
          )}

          {reg.status !== 'CANCELLED' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewBadge(reg);
              }}
              className="no-print"
              style={{
                background: 'transparent',
                color: 'var(--color-primary)',
                borderColor: 'var(--color-primary)',
                padding: '8px 16px',
                fontSize: 14,
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                border: '1px solid var(--color-border)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}>
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <line x1="7" y1="8" x2="17" y2="8" />
                <line x1="7" y1="12" x2="17" y2="12" />
                <line x1="7" y1="16" x2="13" y2="16" />
              </svg>
              Badge
            </button>
          )}
        </div>

      </div>
    </Card>
  )
}
