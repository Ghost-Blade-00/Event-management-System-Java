import React, { useState, useEffect, useRef } from 'react'
import { regApi } from '../utils/api.js'
import { Card, Btn, Avatar, Badge, SectionHeader } from '../components/UI.jsx'
import * as Icons from '../components/Icons.jsx'

export default function CheckInPage() {
  const [code, setCode]       = useState('')
  const [result, setResult]   = useState(null)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const doCheckIn = async (e, directCode = null) => {
    e?.preventDefault()
    const trimmed = (directCode || code).trim()
    if (!trimmed) return
    setLoading(true); setResult(null); setError('')
    try {
      const data = await regApi.checkIn(trimmed)
      setResult(data)
      setHistory(h => [{ ...data, checkedAt: new Date().toISOString() }, ...h].slice(0, 10))
      setCode('')
      setTimeout(() => { inputRef.current?.focus() }, 50)
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('already checked in')) {
        setError('Attendance Marked Already: This ticket has already been verified and checked in.')
      } else {
        setError(err.message)
      }
      setTimeout(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
      }, 50)
    }
    setLoading(false)
  }

  return (
    <div className="fade-in">
      <SectionHeader
        title="Participant Check-In"
        subtitle="Validate ticket codes and record attendance in real time"
      />

      <div className="checkin-grid">
        {/* Left – scanner & results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card style={{ padding: '2rem' }}>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: '16px',
              background: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              margin: '0 auto 1.5rem auto'
            }}>
              <Icons.TicketIcon size={26} />
            </div>
            <h3 style={{ fontWeight: 800, fontSize: 18, textAlign: 'center', marginBottom: 6, color: 'var(--color-neutral-900)' }}>
              Scan Ticket Code
            </h3>
            <p style={{ fontSize: 13, color: 'var(--color-neutral-600)', textAlign: 'center', marginBottom: '1.75rem', fontWeight: 500 }}>
              Enter the unique ticket alphanumeric string code to mark attendance.
            </p>

            <form onSubmit={doCheckIn} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ 
                  fontSize: 12, 
                  fontWeight: 700,
                  color: 'var(--color-neutral-700)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em' 
                }}>Ticket Code</label>
                <input
                  ref={inputRef}
                  value={code}
                  onChange={e => {
                    const val = e.target.value
                    setCode(val)
                    const trimmed = val.trim()
                    // Auto check-in if code is fully scanned (length 22 and matches format)
                    if (trimmed.length === 22 && /^EVT-\d{13}-\d{4}$/i.test(trimmed)) {
                      doCheckIn(null, trimmed)
                    }
                  }}
                  placeholder="EVT-0000000000-0000"
                  style={{ 
                    fontFamily: 'monospace', 
                    fontSize: 16, 
                    letterSpacing: '0.08em',
                    textAlign: 'center',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '12px 16px',
                    borderColor: 'var(--color-neutral-300)'
                  }}
                  autoFocus
                />
              </div>
              <Btn 
                type="submit" 
                variant="primary" 
                size="lg" 
                disabled={loading || !code.trim()}
                style={{ width: '100%' }}
              >
                {loading ? 'Validating...' : 'Validate & Check In'}
              </Btn>
            </form>
          </Card>

          {/* Result SUCCESS */}
          {result && (
            <Card style={{ border: '1.5px solid var(--color-success)', background: 'var(--color-success-light)' }} className="scale-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ 
                  width: 32, 
                  height: 32, 
                  borderRadius: '50%', 
                  background: 'var(--color-success)', 
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icons.CheckIcon size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--color-success-dark)' }}>Check-in Successful</div>
                  <div style={{ fontSize: 13, color: 'var(--color-success-dark)', opacity: 0.85, fontWeight: 600 }}>{result.eventTitle}</div>
                </div>
              </div>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12,
                padding: '12px 16px', 
                background: 'var(--color-bg-card)', 
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(16, 185, 129, 0.15)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <Avatar name={result.userName} size={40} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--color-text-heading)' }}>{result.userName}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>{result.userEmail}</div>
                  <div style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--color-neutral-400)', marginTop: 4, fontWeight: 700 }}>
                    {result.ticketCode}
                  </div>
                </div>
                <Badge label="ATTENDED" />
              </div>
            </Card>
          )}

          {/* Result ERROR */}
          {error && (
            <Card 
              style={{ 
                border: error.startsWith('⚠️') ? '1.5px solid var(--color-warning)' : '1.5px solid var(--color-danger)', 
                background: error.startsWith('⚠️') ? 'var(--color-warning-light)' : 'var(--color-danger-light)' 
              }} 
              className="scale-in"
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ 
                  width: 32, 
                  height: 32, 
                  borderRadius: '50%', 
                  background: error.startsWith('⚠️') ? 'var(--color-warning)' : 'var(--color-danger)', 
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {error.startsWith('⚠️') ? <Icons.AlertCircleIcon size={18} strokeWidth={2.5} /> : <Icons.XIcon size={18} strokeWidth={2.5} />}
                </div>
                <div>
                  <div style={{ 
                    fontWeight: 800, 
                    fontSize: 16, 
                    color: error.startsWith('⚠️') ? 'var(--color-warning-dark)' : 'var(--color-danger-dark)' 
                  }}>
                    {error.startsWith('⚠️') ? 'Duplicate Check-in Alert' : 'Check-in Failed'}
                  </div>
                  <div style={{ 
                    fontSize: 13, 
                    color: error.startsWith('⚠️') ? 'var(--color-warning-dark)' : 'var(--color-danger)', 
                    marginTop: 4, 
                    lineHeight: 1.5, 
                    fontWeight: 600 
                  }}>
                    {error}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right – history & guidelines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ 
              padding: '16px 20px', 
              borderBottom: '1px solid var(--color-border)',
              fontWeight: 800, 
              fontSize: 14, 
              color: 'var(--color-text-heading)', 
              display: 'flex',
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <span>Check-in Logs</span>
              {history.length > 0 && (
                <span style={{ 
                  fontSize: 11, 
                  color: 'var(--color-primary)', 
                  background: 'var(--color-primary-light)',
                  padding: '2px 8px',
                  borderRadius: 99,
                  fontWeight: 700 
                }}>
                  {history.length} active
                </span>
              )}
            </div>
            {history.length === 0 ? (
              <div style={{ padding: '4rem 1.5rem', textAlign: 'center', color: 'var(--color-neutral-400)' }}>
                <div style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'var(--color-neutral-50)',
                  marginBottom: 12
                }}>
                  <Icons.CalendarIcon size={22} strokeWidth={1.5} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>No check-ins in this session</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {history.map((h, i) => (
                  <div key={h.id + i} style={{
                    padding: '12px 20px',
                    borderBottom: i < history.length - 1 ? '1px solid var(--color-border)' : 'none',
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 12
                  }}>
                    <Avatar name={h.userName} size={32} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--color-text-heading)' }}>{h.userName}</div>
                      <div style={{ fontSize: 12, color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                        {h.eventTitle}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <Badge label="ATTENDED" />
                      <div style={{ fontSize: 11, color: 'var(--color-neutral-400)', marginTop: 4, fontFamily: 'monospace' }}>
                        {new Date(h.checkedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Validation Guidelines */}
          <Card style={{ background: 'var(--color-neutral-50)', borderStyle: 'dashed' }}>
            <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--color-text-heading)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icons.InfoIcon size={16} /> Verification Tips
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'Verify the code matches structure: EVT-XXXXXXXXXX-XXXX',
                'Each registration code is valid for single check-in only',
                'Ensure registration status is CONFIRMED prior to check-in',
                'RSVPs on waitlists must be approved before validation',
              ].map((tip, i) => (
                <div key={i} style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', gap: 8, alignItems: 'flex-start', fontWeight: 500, lineHeight: 1.4 }}>
                  <span style={{ color: 'var(--color-primary)', fontWeight: 800, marginTop: -1 }}>•</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
