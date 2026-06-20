import React from 'react'
import { PlanifyLogo } from './Icons.jsx'

export default function Footer({ onNavigate }) {
  return (
    <footer style={{
      background: 'var(--theme-footer-bg, #0b122e)',
      borderTop: '1px solid var(--theme-footer-border, #1e295d)',
      padding: '4rem 6rem 2.5rem 6rem',
      color: '#8da1c4',
      marginTop: 'auto',
      width: '100%'
    }}>
      <div style={{
        width: '100%',
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 36
      }}>
        {/* Top Logo and Social Section */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <PlanifyLogo size={32} />
            <span style={{
              fontSize: 22,
              fontWeight: 800,
              color: '#ffffff',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.02em'
            }}>
              <span style={{ color: '#38bdf8' }}>Plani</span>fy
            </span>
          </div>

          {/* Mock Social Media icons */}
          <div style={{ display: 'flex', gap: 20, marginTop: 4 }}>
            {['facebook', 'twitter', 'linkedin', 'youtube', 'instagram'].map(platform => (
              <a 
                key={platform} 
                href="#" 
                onClick={e => e.preventDefault()}
                style={{ 
                  color: '#8da1c4', 
                  transition: 'color 0.2s', 
                  fontSize: 14, 
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  textDecoration: 'none' 
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
                onMouseLeave={e => e.currentTarget.style.color = '#8da1c4'}
              >
                {platform === 'twitter' ? 'X' : platform}
              </a>
            ))}
          </div>
        </div>

        {/* Link Columns Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 32,
          borderTop: '1px solid rgba(141, 161, 196, 0.15)',
          borderBottom: '1px solid rgba(141, 161, 196, 0.15)',
          padding: '3rem 0'
        }}>
          {/* Sales Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h5 style={{ color: '#ffffff', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sales</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              <a href="#" onClick={e => { e.preventDefault(); onNavigate?.('about'); }} style={linkStyle}>Request a Demo</a>
              <a href="#" onClick={e => { e.preventDefault(); onNavigate?.('about'); }} style={linkStyle}>Pricing Overview</a>
              <a href="#" onClick={e => { e.preventDefault(); onNavigate?.('about'); }} style={linkStyle}>Contact Sales Team</a>
            </div>
          </div>

          {/* About Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h5 style={{ color: '#ffffff', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em' }}>About</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              <a href="#" onClick={e => { e.preventDefault(); onNavigate?.('about'); }} style={linkStyle}>Company Awards</a>
              <a href="#" onClick={e => { e.preventDefault(); onNavigate?.('about'); }} style={linkStyle}>Careers at Planify</a>
              <a href="#" onClick={e => { e.preventDefault(); onNavigate?.('about'); }} style={linkStyle}>Investor Relations</a>
              <a href="#" onClick={e => { e.preventDefault(); onNavigate?.('about'); }} style={linkStyle}>Newsroom Announcements</a>
              <a href="#" onClick={e => { e.preventDefault(); onNavigate?.('about'); }} style={linkStyle}>Global Partners</a>
            </div>
          </div>

          {/* Popular Products Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h5 style={{ color: '#ffffff', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Popular Products</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              <a href="#" onClick={e => { e.preventDefault(); onNavigate?.('events'); }} style={linkStyle}>Event Registration</a>
              <a href="#" onClick={e => { e.preventDefault(); onNavigate?.('about'); }} style={linkStyle}>Planify Mobile Apps</a>
              <a href="#" onClick={e => { e.preventDefault(); onNavigate?.('about'); }} style={linkStyle}>Attendee Engagement Hub</a>
              <a href="#" onClick={e => { e.preventDefault(); onNavigate?.('checkin'); }} style={linkStyle}>Check-In & Badging</a>
              <a href="#" onClick={e => { e.preventDefault(); onNavigate?.('about'); }} style={linkStyle}>Webinar Hosting Platform</a>
              <a href="#" onClick={e => { e.preventDefault(); onNavigate?.('about'); }} style={linkStyle}>Venue Sourcing Tools</a>
            </div>
          </div>

          {/* Free Resources Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h5 style={{ color: '#ffffff', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Free Resources</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              <a href="#" onClick={e => { e.preventDefault(); onNavigate?.('events'); }} style={linkStyle}>Event Industry Blog</a>
              <a href="#" onClick={e => { e.preventDefault(); onNavigate?.('about'); }} style={linkStyle}>Customer Case Studies</a>
              <a href="#" onClick={e => { e.preventDefault(); onNavigate?.('events'); }} style={linkStyle}>Virtual & Live Events</a>
              <a href="#" onClick={e => { e.preventDefault(); onNavigate?.('about'); }} style={linkStyle}>Watch On-Demand Webinars</a>
              <a href="#" onClick={e => { e.preventDefault(); onNavigate?.('events'); }} style={linkStyle}>Find Local Venues</a>
            </div>
          </div>

          {/* Support Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h5 style={{ color: '#ffffff', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Support</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              <a href="#" onClick={e => { e.preventDefault(); onNavigate?.('support'); }} style={{ ...linkStyle, color: '#38bdf8', fontWeight: 700 }}>Contact Support</a>
              <a href="#" onClick={e => { e.preventDefault(); onNavigate?.('about'); }} style={linkStyle}>Developer API Hub</a>
              <a href="#" onClick={e => { e.preventDefault(); onNavigate?.('about'); }} style={linkStyle}>Planify Knowledge Base</a>
              <a href="mailto:hypeflume036@gmail.com" style={linkStyle}>hypeflume036@gmail.com</a>
              <a href="#" onClick={e => { e.preventDefault(); onNavigate?.('about'); }} style={linkStyle}>Security Trust Center</a>
            </div>
          </div>
        </div>

        {/* Copyright and Legal Section */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          fontSize: 12
        }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <span>© Copyright {new Date().getFullYear()} Planify Inc. All rights reserved.</span>
            <span style={{ color: 'rgba(141, 161, 196, 0.3)' }}>|</span>
            <a href="#" onClick={e => { e.preventDefault(); onNavigate?.('about'); }} style={legalLinkStyle}>LEGAL NOTICE</a>
            <span style={{ color: 'rgba(141, 161, 196, 0.3)' }}>|</span>
            <a href="#" onClick={e => { e.preventDefault(); onNavigate?.('about'); }} style={legalLinkStyle}>PRIVACY POLICY</a>
            <span style={{ color: 'rgba(141, 161, 196, 0.3)' }}>|</span>
            <a href="#" onClick={e => { e.preventDefault(); onNavigate?.('about'); }} style={legalLinkStyle}>ACCESSIBILITY</a>
            <span style={{ color: 'rgba(141, 161, 196, 0.3)' }}>|</span>
            <a href="#" onClick={e => { e.preventDefault(); onNavigate?.('about'); }} style={legalLinkStyle}>TERMS OF SERVICE</a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#ffffff' }}>
            <span>English (US)</span>
          </div>
        </div>

      </div>
    </footer>
  )
}

const linkStyle = {
  color: '#8da1c4',
  textDecoration: 'none',
  transition: 'color 0.15s ease',
  fontWeight: 500,
  cursor: 'pointer'
}

const legalLinkStyle = {
  color: '#8da1c4',
  textDecoration: 'none',
  transition: 'color 0.15s ease',
  fontWeight: 600,
  cursor: 'pointer'
}
