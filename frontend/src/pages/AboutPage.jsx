import React, { useState } from 'react'
import { Card, SectionHeader } from '../components/UI.jsx'

const STAGES = [
  {
    key: 'planning',
    title: 'Planning',
    items: ['Meeting approval & budgeting', 'Venue sourcing', 'Vendor sourcing'],
    color: '#6366f1',
    desc: 'Streamline budgeting, approvals, venue requests, and core planning worksheets in one central hub.'
  },
  {
    key: 'promotion',
    title: 'Promotion',
    items: ['Email marketing campaigns', 'Custom registration websites', 'Social media invitations'],
    color: '#a855f7',
    desc: 'Launch custom branded sites, manage registration paths, and drive ticket sales.'
  },
  {
    key: 'dayofevent',
    title: 'Day of Event',
    items: ['Check-in and attendee lookup', 'On-site badge printing', 'Live attendance tracking'],
    color: '#06b6d4',
    desc: 'Mark attendance with check-in scanning tool and display instant verification alerts.'
  },
  {
    key: 'postevent',
    title: 'Post Event',
    items: ['Feedback surveys & ratings', 'Attendee review logs', 'Analytics reports & dashboards'],
    color: '#10b981',
    desc: 'Analyze star ratings, collect written feedback, and measure event success rates.'
  }
]

export default function AboutPage() {
  const [activeStage, setActiveStage] = useState('planning')
  const currentStage = STAGES.find(s => s.key === activeStage)

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '4rem', paddingBottom: '4rem', width: '100%' }}>
      <SectionHeader 
        title="Event Lifecycle & Solutions"
        subtitle="Discover how Planify simplifies the journey from initial planning to final reviews"
      />

      {/* ── INTERACTIVE LIFECYCLE CHART SECTION ── */}
      <Card glass style={{ padding: '3.5rem 3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-text-heading)', marginBottom: 12 }}>
            Your event lifecycle, from start to finish
          </h2>
          <p style={{ fontSize: 16, color: 'var(--color-text-muted)', maxWidth: 650, margin: '0 auto', fontWeight: 500 }}>
            With tools to manage the event journey in one place, you'll have less on your plate so you can focus on what matters.
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4rem',
          flexWrap: 'wrap'
        }}>
          {/* Left: Beautiful Interactive Circular SVG Chart */}
          <div style={{ position: 'relative', width: 440, height: 440, flexShrink: 0 }}>
            <svg width="440" height="440" viewBox="0 0 200 200">
              {/* Outer border dash ring */}
              <circle cx="100" cy="100" r="94" fill="none" stroke="var(--color-border)" strokeWidth="1.2" strokeDasharray="3 3" />
              
              {/* 4 Quadrants */}
              {/* Planning (Top Right) */}
              <path 
                d="M 100 100 L 100 12 A 88 88 0 0 1 188 100 Z" 
                fill={activeStage === 'planning' ? '#6366f1' : 'var(--color-neutral-100)'}
                stroke="var(--color-bg-card)"
                strokeWidth="3.5"
                style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                onClick={() => setActiveStage('planning')}
              />
              {/* Promotion (Bottom Right) */}
              <path 
                d="M 100 100 L 188 100 A 88 88 0 0 1 100 188 Z" 
                fill={activeStage === 'promotion' ? '#a855f7' : 'var(--color-neutral-100)'}
                stroke="var(--color-bg-card)"
                strokeWidth="3.5"
                style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                onClick={() => setActiveStage('promotion')}
              />
              {/* Day of Event (Bottom Left) */}
              <path 
                d="M 100 100 L 100 188 A 88 88 0 0 1 12 100 Z" 
                fill={activeStage === 'dayofevent' ? '#06b6d4' : 'var(--color-neutral-100)'}
                stroke="var(--color-bg-card)"
                strokeWidth="3.5"
                style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                onClick={() => setActiveStage('dayofevent')}
              />
              {/* Post Event (Top Left) */}
              <path 
                d="M 100 100 L 12 100 A 88 88 0 0 1 100 12 Z" 
                fill={activeStage === 'postevent' ? '#10b981' : 'var(--color-neutral-100)'}
                stroke="var(--color-bg-card)"
                strokeWidth="3.5"
                style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                onClick={() => setActiveStage('postevent')}
              />

              {/* Inner cutout to make it a donut chart */}
              <circle cx="100" cy="100" r="54" fill="var(--color-bg-card)" stroke="var(--color-bg-card)" strokeWidth="3.5" />

              {/* Text labels placed inside the segments */}
              <text 
                x="144" 
                y="56" 
                textAnchor="middle" 
                dominantBaseline="middle" 
                fontSize="9" 
                fontWeight="800" 
                fill={activeStage === 'planning' ? '#ffffff' : 'var(--color-text-muted)'} 
                style={{ pointerEvents: 'none', letterSpacing: '0.04em', fontFamily: 'var(--font-display)', transition: 'fill 0.3s' }}
              >
                PLANNING
              </text>
              
              <text 
                x="144" 
                y="144" 
                textAnchor="middle" 
                dominantBaseline="middle" 
                fontSize="9" 
                fontWeight="800" 
                fill={activeStage === 'promotion' ? '#ffffff' : 'var(--color-text-muted)'} 
                style={{ pointerEvents: 'none', letterSpacing: '0.04em', fontFamily: 'var(--font-display)', transition: 'fill 0.3s' }}
              >
                PROMOTION
              </text>

              <text 
                x="56" 
                y="144" 
                textAnchor="middle" 
                dominantBaseline="middle" 
                fontSize="8.5" 
                fontWeight="800" 
                fill={activeStage === 'dayofevent' ? '#ffffff' : 'var(--color-text-muted)'} 
                style={{ pointerEvents: 'none', letterSpacing: '0.01em', fontFamily: 'var(--font-display)', transition: 'fill 0.3s' }}
              >
                DAY OF EVENT
              </text>

              <text 
                x="56" 
                y="56" 
                textAnchor="middle" 
                dominantBaseline="middle" 
                fontSize="9" 
                fontWeight="800" 
                fill={activeStage === 'postevent' ? '#ffffff' : 'var(--color-text-muted)'} 
                style={{ pointerEvents: 'none', letterSpacing: '0.04em', fontFamily: 'var(--font-display)', transition: 'fill 0.3s' }}
              >
                POST EVENT
              </text>
            </svg>

            {/* Inner Circular Branding Text Overlay (Not rotated) */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              width: 160,
              pointerEvents: 'none'
            }}>
              <div style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '0.05em' }}>Planify</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--color-text-heading)', margin: '2px 0' }}>{currentStage.title}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.1 }}>Improve your event planning</div>
            </div>
          </div>

          {/* Right: Interactive Accordion / Details */}
          <div style={{ flex: 1, minWidth: 300, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {STAGES.map(s => {
              const active = s.key === activeStage
              return (
                <div 
                  key={s.key} 
                  onClick={() => setActiveStage(s.key)}
                  style={{
                    padding: '16px 20px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    background: active ? `${s.color}08` : 'var(--color-bg-card)',
                    borderColor: active ? s.color : 'var(--color-border)',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: active ? 'var(--shadow-sm)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: s.color }} />
                      <span style={{ fontSize: 16, fontWeight: 800, color: active ? 'var(--color-text-heading)' : 'var(--color-text-muted)' }}>
                        {s.title}
                      </span>
                    </div>
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      style={{ 
                        transform: active ? 'rotate(180deg)' : 'rotate(0deg)', 
                        transition: 'transform 0.2s',
                        color: active ? s.color : 'var(--color-neutral-400)' 
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                  
                  {active && (
                    <div style={{ marginTop: 12, paddingLeft: 20 }} className="scale-in">
                      <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: 12, fontWeight: 500 }}>
                        {s.desc}
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {s.items.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-text-heading)', fontWeight: 600 }}>
                            <span style={{ color: s.color }}>✓</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </Card>

      {/* ── CVENT SOLUTIONS PRODUCTS SECTION ── */}
      <div>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-text-heading)' }}>
            Core Planify Solutions
          </h2>
          <p style={{ fontSize: 15, color: 'var(--color-text-muted)', fontWeight: 500, marginTop: 4 }}>
            Tailored tools designed for online registrations, mobile application hubs, and video webinar events.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: 30
        }}>
          {/* Card 1: Registration */}
          <Card hover style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ height: 240, overflow: 'hidden', position: 'relative' }}>
              <img 
                src="/images/registration_mockup.png" 
                alt="Registration" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-primary)' }}>
                Registration
              </div>
              <h3 style={{ fontSize: 23, fontWeight: 800, color: 'var(--color-text-heading)', lineHeight: 1.3 }}>
                Capture event registrations in beautiful online experiences
              </h3>
              <p style={{ fontSize: 15, color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
                Build fully customized registration pages, manage attendee pathways, issue digital pass barcodes, and review check-in validations instantly.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: 14, color: 'var(--color-primary)', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 4 }}>
                Design custom branded sites <span>&gt;</span>
              </div>
            </div>
          </Card>

          {/* Card 2: Mobile Event Apps */}
          <Card hover style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ height: 240, overflow: 'hidden', position: 'relative' }}>
              <img 
                src="/images/mobile_app_mockup.png" 
                alt="Mobile App" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-primary)' }}>
                Mobile Event Apps
              </div>
              <h3 style={{ fontSize: 23, fontWeight: 800, color: 'var(--color-text-heading)', lineHeight: 1.3 }}>
                Connect to your audience with personalized app experiences
              </h3>
              <p style={{ fontSize: 15, color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
                Give attendees instant access to room agendas, speaker highlights, downloadable resources, and feedback review loops on the move.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: 14, color: 'var(--color-primary)', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 4 }}>
                Build engaging mobile event apps <span>&gt;</span>
              </div>
            </div>
          </Card>

          {/* Card 3: Webinar Hosting */}
          <Card hover style={{ padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ height: 240, overflow: 'hidden', position: 'relative' }}>
              <img 
                src="/images/webinar_mockup.png" 
                alt="Webinar" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-primary)' }}>
                Webinar Platform
              </div>
              <h3 style={{ fontSize: 23, fontWeight: 800, color: 'var(--color-text-heading)', lineHeight: 1.3 }}>
                Create interactive webinars on a powerful, flexible platform
              </h3>
              <p style={{ fontSize: 15, color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
                Deliver high-quality video broadcasts, support active speaker presentations, enable live attendee chats, and display dynamic support guides.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: 14, color: 'var(--color-primary)', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 4 }}>
                Plan webinars attendees will love <span>&gt;</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
