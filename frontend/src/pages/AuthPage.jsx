import React, { useState } from 'react'
import { authApi, saveSession } from '../utils/api.js'
import * as Icons from '../components/Icons.jsx'
import { Card, Badge } from '../components/UI.jsx'

export default function AuthPage({ onLogin }) {
  const [showModal, setShowModal] = useState(false)
  const [tab, setTab] = useState('login')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ 
    email: '', 
    password: '', 
    firstName: '', 
    lastName: '', 
    phone: '', 
    organization: '',
    designation: '' 
  })

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) return setError('Email and password are required')
    if (tab === 'register' && (!form.firstName || !form.lastName)) return setError('Full name is required')
    
    setLoading(true)
    setError('')
    try {
      if (tab === 'login') {
        const payload = { email: form.email, password: form.password }
        const data = await authApi.login(payload)
        saveSession(data)
        onLogin(data)
      } else {
        // Safe mapping of organization + designation for backend compatibility
        const orgCombined = form.organization + (form.designation ? ` (${form.designation})` : '')
        const payload = {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          phone: form.phone,
          organization: orgCombined
        }
        const data = await authApi.register(payload)
        saveSession(data)
        onLogin(data)
      }
    } catch (err) {
      setError(err.message)
      // Check if user was not found or bad credentials, redirect to registration
      if (tab === 'login' && (err.message.toLowerCase().includes('not found') || err.message.toLowerCase().includes('401') || err.message.toLowerCase().includes('invalid email'))) {
        setTimeout(() => {
          setTab('register')
          setError('We could not find an account with that email. We have redirected you to the registration page to create a new profile.')
        }, 1500)
      }
    }
    setLoading(false)
  }

  const handleOpenLogin = () => {
    setTab('login')
    setError('')
    setShowModal(true)
  }

  const handleOpenSignup = () => {
    setTab('register')
    setError('')
    setShowModal(true)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg-body)', width: '100%' }}>
      
      {/* ── LANDING NAVBAR HEADER ── */}
      <header style={{
        background: 'var(--color-bg-card)',
        borderBottom: '1px solid var(--color-border)',
        padding: '0 4rem',
        height: 84,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-sm)'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontWeight: 800, fontSize: 24, cursor: 'pointer' }}>
          <Icons.PlanifyLogo size={36} />
          <span style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', color: 'var(--color-text-heading)' }}>
            <span style={{ color: 'var(--color-primary)' }}>Plani</span>fy
          </span>
        </div>

        {/* Cvent-Style Corporate Navigation Links */}
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="desktop-only">
          {['Products', 'Event Types', 'Resources', 'About', 'Venue check-in'].map(link => (
            <a 
              key={link} 
              href="#" 
              onClick={e => { 
                e.preventDefault(); 
                if (link === 'About') {
                  document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  handleOpenLogin();
                }
              }}
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: 'var(--color-text-muted)',
                textDecoration: 'none',
                transition: 'color 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
            >
              {link} {link !== 'About' && <span style={{ fontSize: 10, opacity: 0.7 }}>▼</span>}
            </a>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <a 
            href="mailto:hypeflume036@gmail.com?subject=Planify Demo Request"
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: 'var(--color-primary)',
              textDecoration: 'none',
              padding: '9px 18px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-primary)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--color-primary-light)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            Request demo
          </a>
          <button 
            onClick={handleOpenLogin}
            style={{
              padding: '10px 22px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-primary)',
              color: '#ffffff',
              border: 'none',
              fontSize: 15,
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.25)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--color-primary-dark)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--color-primary)'}
          >
            Log in
          </button>
        </div>
      </header>

      {/* ── LANDING HERO WAVE BANNER ── */}
      <section 
        className="cvent-wave-bottom" 
        style={{
          background: 'linear-gradient(135deg, #020617 0%, #004dc7 50%, #4c1d95 100%)',
          padding: '6rem 4rem 8rem 4rem',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          width: '100%'
        }}
      >
        <div style={{ maxWidth: 1600, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center', position: 'relative', zIndex: 3 }}>
          
          {/* Left Column: Branding copy */}
          <div>
            <h1 style={{ fontSize: 52, fontWeight: 800, color: '#ffffff', marginBottom: 20, lineHeight: 1.15, letterSpacing: '-0.03em', fontFamily: 'var(--font-display)' }}>
              Get better results<br/>from your events.
            </h1>
            <p style={{ fontSize: 18, color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.6, marginBottom: 36, fontWeight: 500 }}>
              Planify is designed for human connection. Built with premium scheduling, registrations, and checking tools.
            </p>

            {/* Bullets */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 40 }}>
              {[
                'Find and book the right venues faster',
                'Reach the right audiences dynamically',
                'Track attendee engagement and live impact',
                'Prove revenue contribution and event ROI',
              ].map((text, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 16, fontWeight: 600 }}>
                  <span style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: '#10b981',
                    color: '#ffffff',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 900
                  }}>✓</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Landing CTAs */}
            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              <button 
                onClick={handleOpenSignup}
                style={{
                  padding: '14px 28px',
                  borderRadius: 'var(--radius-md)',
                  background: '#0066f2',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: 16,
                  fontWeight: 700,
                  boxShadow: '0 8px 24px rgba(0, 102, 242, 0.35)',
                  cursor: 'pointer'
                }}
              >
                Explore the Platform
              </button>
              <a 
                href="mailto:hypeflume036@gmail.com?subject=Requesting Planify Demo"
                style={{
                  color: '#ffffff',
                  fontSize: 16,
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                Request a Demo <span style={{ transition: 'transform 0.15s' }}>→</span>
              </a>
            </div>
          </div>

          {/* Right Column: Premium CSS Dashboard Mockup */}
          <div style={{ position: 'relative', height: 420 }} className="desktop-only">
            
            {/* Main browser card layer */}
            <div style={{
              position: 'absolute',
              top: 20,
              left: 20,
              width: '85%',
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 16,
              padding: 20,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(12px)',
              zIndex: 1
            }}>
              {/* Window controls */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
              </div>
              {/* Layout Content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ height: 12, background: 'rgba(255,255,255,0.1)', borderRadius: 3, width: '35%' }} />
                <div style={{ height: 28, background: 'rgba(0,102,242,0.2)', border: '1px solid rgba(0,102,242,0.3)', borderRadius: 6, width: '100%', display: 'flex', alignItems: 'center', paddingLeft: 10 }}>
                  <div style={{ height: 6, background: '#0066f2', borderRadius: 3, width: '40%' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 4 }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 12 }}>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 3, width: '40%', marginBottom: 6 }} />
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#10b981' }}>98.4%</div>
                    <div style={{ fontSize: 10, color: '#8da1c4', marginTop: 2 }}>Capacity Fill Rate</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 12 }}>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 3, width: '50%', marginBottom: 6 }} />
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#8b5cf6' }}>4,912</div>
                    <div style={{ fontSize: 10, color: '#8da1c4', marginTop: 2 }}>Total Registrations</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile screen badge layer overlapping */}
            <div style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              width: 190,
              background: 'linear-gradient(135deg, #0d1e3d 0%, #060913 100%)',
              border: '2px solid rgba(0, 102, 242, 0.4)',
              borderRadius: 24,
              padding: '16px 14px',
              boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: 40, height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 99 }} />
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 64, height: 64, background: '#ffffff', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4 }}>
                  {/* Mock Barcode visual */}
                  <div style={{ display: 'flex', gap: 2, height: '100%', width: '100%' }}>
                    {[2,4,1,3,2,1,4,2,1,3,1,4,2,3].map((w, idx) => (
                      <div key={idx} style={{ background: '#0f172a', flex: w, height: '100%' }} />
                    ))}
                  </div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#38bdf8' }}>TICKET VERIFIED</div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#ffffff', textAlign: 'center' }}>
                Planify Connect 2026
              </div>
            </div>

          </div>

        </div>

        {/* Decorative elements */}
        <div style={{ position: 'absolute', bottom: -10, left: 0, right: 0, height: 60, background: 'var(--color-bg-body)', clipPath: 'ellipse(60% 100% at 50% 100%)', zIndex: 1 }} />
      </section>

      {/* ── OVERLAY PROMO CARD ── */}
      <div style={{ padding: '0 4rem', marginTop: '-3rem', position: 'relative', zIndex: 5 }}>
        <div style={{
          maxWidth: 1600,
          margin: '0 auto',
          background: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 16,
          padding: '20px 30px',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 20,
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ display: 'inline-flex', color: 'var(--color-primary)', alignSelf: 'center' }}><Icons.MegaphoneIcon size={24} /></span>
            <div style={{ fontSize: 15, color: 'var(--color-text-main)', fontWeight: 600 }}>
              The agenda for <strong style={{ color: 'var(--color-primary)' }}>Planify CONNECT 2026</strong> is now live! Join us in Nashville on July 13-16.
            </div>
          </div>
          <button 
            onClick={handleOpenSignup}
            style={{
              padding: '10px 22px',
              background: 'var(--color-primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(79, 70, 229, 0.2)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--color-primary-dark)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--color-primary)'}
          >
            Register Now
          </button>
        </div>
      </div>

      {/* ── DETAILED ABOUT PLANIFY SECTION ── */}
      <section id="about-section" style={{ padding: '6rem 4rem', maxWidth: 1600, margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: 'var(--color-text-heading)', marginBottom: 12 }}>
            The Complete Event Management Platform
          </h2>
          <p style={{ fontSize: 16, color: 'var(--color-text-muted)', maxWidth: 700, margin: '0 auto', fontWeight: 500 }}>
            Planify provides all the tools you need to host conferences, webinars, workshops, and training courses in one premium dashboard.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 30 }}>
          {[
            {
              icon: Icons.TicketIcon,
              title: 'Online Registration',
              desc: 'Create secure registration forms, issue professional digital tickets, and capture attendee details dynamically.'
            },
            {
              icon: Icons.CalendarIcon,
              title: 'Agenda & Speaker Sessions',
              desc: 'Schedule agenda timelines, assign room locations, outline speaker summaries, and sync to external calendars (.ics).'
            },
            {
              icon: Icons.CheckInIcon,
              title: 'Live Check-In Tools',
              desc: 'Mark attendance at the door with our scanning terminal tool. Instant lookup and check-in confirmation.'
            },
            {
              icon: Icons.StarIcon,
              title: 'Attendee Reviews',
              desc: 'Collect 1-to-5 star ratings and written reviews from participants. Analyze satisfaction scores instantly.'
            }
          ].map(feat => {
            const IconComponent = feat.icon
            return (
              <Card key={feat.title} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconComponent size={24} />
                </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-text-heading)', margin: 0 }}>
                {feat.title}
              </h3>
              <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
                {feat.desc}
              </p>
            </Card>
            )
          })}
        </div>
      </section>

      {/* ── LOGIN / REGISTRATION MODAL OVERLAY ── */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '2.5rem' }}>
            
            {/* Close button */}
            <button 
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                background: 'none',
                border: 'none',
                color: 'var(--color-neutral-400)',
                cursor: 'pointer',
                padding: 4,
                display: 'flex',
                borderRadius: '50%'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-neutral-100)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Icons.XIcon size={20} />
            </button>

            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-text-heading)', marginBottom: 8, letterSpacing: '-0.02em' }}>
                {tab === 'login' ? 'Welcome back' : 'Create account'}
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 14, fontWeight: 500 }}>
                {tab === 'login'
                  ? 'Sign in to access your dashboard'
                  : 'Register to begin organizing or attending events'}
              </p>
            </div>

            {/* Tab switch */}
            <div style={{
              display: 'flex',
              background: 'var(--color-neutral-100)',
              borderRadius: 'var(--radius-md)',
              padding: 4,
              marginBottom: '1.5rem',
              gap: 4
            }}>
              {[
                { key: 'login', label: 'Sign In' },
                { key: 'register', label: 'Sign Up' }
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => { setTab(t.key); setError('') }}
                  style={{
                    flex: 1,
                    padding: '8px 0',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: tab === t.key ? 'var(--color-bg-card)' : 'transparent',
                    color: tab === t.key ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    boxShadow: tab === t.key ? 'var(--shadow-sm)' : 'none',
                    transition: 'all 0.15s'
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              
              {tab === 'register' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <InputField label="First name" value={form.firstName} onChange={set('firstName')} placeholder="Priya" required Icon={Icons.UserIcon} />
                  <InputField label="Last name" value={form.lastName} onChange={set('lastName')} placeholder="Sharma" required Icon={Icons.UserIcon} />
                </div>
              )}

              <InputField label="Email address" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required Icon={Icons.MailIcon} />
              
              <InputField label="Password" type="password" value={form.password} onChange={set('password')} placeholder={tab === 'register' ? 'Minimum 6 characters' : '••••••••'} required Icon={Icons.LockIcon} />

              {tab === 'register' && (
                <>
                  <InputField label="Phone number" type="tel" value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" required Icon={Icons.PhoneIcon} />
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <InputField label="Company / Org" value={form.organization} onChange={set('organization')} placeholder="Company Name" required Icon={Icons.BuildingIcon} />
                    <InputField label="Job Title / Designation" value={form.designation} onChange={set('designation')} placeholder="Developer" required Icon={Icons.BriefcaseIcon} />
                  </div>
                </>
              )}

              {/* Error Box */}
              {error && (
                <div className="scale-in" style={{
                  background: 'var(--color-danger-light)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  display: 'flex',
                  gap: 10,
                  alignItems: 'flex-start'
                }}>
                  <span style={{ color: 'var(--color-danger)', marginTop: 2 }}><Icons.AlertCircleIcon size={18} /></span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--color-danger-dark)', marginBottom: 2 }}>
                      Authentication Failed
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-danger)', lineHeight: 1.4, fontWeight: 500 }}>
                      {error}
                    </div>
                  </div>
                  <button type="button" onClick={() => setError('')} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: 0 }}>
                    <Icons.XIcon size={16} />
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px 0',
                  background: loading ? 'var(--color-neutral-300)' : 'var(--color-primary)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 4px 12px rgba(79, 70, 229, 0.25)',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#ffffff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                    Processing...
                  </span>
                ) : (
                  tab === 'login' ? 'Sign In' : 'Create Account'
                )}
              </button>

            </form>

            {/* Quick Access Profiles list at the bottom of login */}

          </div>
        </div>
      )}

    </div>
  )
}

function InputField({ label, type = 'text', value, onChange, placeholder, required, Icon }) {
  const [focused, setFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div style={{ textAlign: 'left' }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--color-neutral-700)', marginBottom: 6 }}>
        {label}
        {required && <span style={{ color: 'var(--color-danger)', marginLeft: 3 }}>*</span>}
      </label>
      <div style={{ position: 'relative' }}>
        {Icon && (
          <span style={{ 
            position: 'absolute', 
            left: 14, 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: focused ? 'var(--color-primary)' : 'var(--color-neutral-400)',
            transition: 'color 0.15s ease',
            pointerEvents: 'none',
            display: 'flex'
          }}>
            <Icon size={16} />
          </span>
        )}
        <input
          type={inputType} 
          value={value} 
          onChange={onChange}
          placeholder={placeholder} 
          required={required}
          onFocus={() => setFocused(true)} 
          onBlur={() => setFocused(false)}
          style={{
            width: '100%', 
            padding: `12px ${isPassword ? '46px' : '16px'} 12px ${Icon ? '42px' : '16px'}`, 
            fontSize: 14,
            fontFamily: 'var(--font-primary)',
            border: focused ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
            borderRadius: 10, 
            outline: 'none', 
            background: 'var(--color-bg-input)', 
            color: 'var(--color-text-heading)',
            boxShadow: focused ? '0 0 0 4px rgba(99,102,241,0.16)' : 'none',
            transition: 'all 0.15s ease'
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(p => !p)}
            style={{
              position: 'absolute',
              right: 14,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-neutral-400)',
              display: 'flex',
              padding: 4,
              borderRadius: '50%',
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-neutral-400)'}
          >
            {showPassword ? <Icons.EyeOffIcon size={16} /> : <Icons.EyeIcon size={16} />}
          </button>
        )}
      </div>
    </div>
  )
}
