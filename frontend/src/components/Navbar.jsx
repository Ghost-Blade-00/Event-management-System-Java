import React, { useState, useRef, useEffect } from 'react'
import { Avatar, Badge } from './UI.jsx'
import * as Icons from './Icons.jsx'

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', Icon: Icons.DashboardIcon },
  { key: 'events',    label: 'Events',    Icon: Icons.CalendarIcon },
  { key: 'checkin',   label: 'Check-In',  Icon: Icons.CheckInIcon },
  { key: 'myregs',    label: 'My Tickets',Icon: Icons.TicketIcon },
  { key: 'about',     label: 'About',     Icon: Icons.InfoIcon },
]

export default function Navbar({ page, setPage, user, onLogout, theme, toggleTheme, canGoBack, canGoForward, goBack, goForward }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const desktopMenuRef = useRef(null)
  const mobileMenuRef = useRef(null)

  // Close menu on outside click
  useEffect(() => {
    const handler = (e) => { 
      const isDesktopClick = desktopMenuRef.current && desktopMenuRef.current.contains(e.target)
      const isMobileClick = mobileMenuRef.current && mobileMenuRef.current.contains(e.target)
      if (!isDesktopClick && !isMobileClick) {
        setMenuOpen(false) 
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLinkClick = (key) => {
    setPage(key)
    setMenuOpen(false)
  }

  // Shared dropdown panel menu
  const renderDropdown = () => (
    <div style={{
      position: 'absolute', 
      right: 0, 
      top: 'calc(100% + 8px)',
      background: 'var(--color-bg-dropdown, #ffffff)', 
      border: '1px solid var(--color-border)', 
      borderRadius: 'var(--radius-lg)',
      minWidth: 240, 
      boxShadow: 'var(--shadow-dropdown)',
      zIndex: 200, 
      overflow: 'hidden',
      animation: 'scaleIn 0.15s cubic-bezier(0.16, 1, 0.3, 1) forwards'
    }}>
      {/* Profile header */}
      <div style={{ 
        padding: '18px 16px', 
        borderBottom: '1px solid var(--color-border)',
        background: 'linear-gradient(135deg, var(--color-primary-light) 0%, rgba(253, 244, 255, 0.05) 100%)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar name={user?.fullName} size={42} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--color-text-heading)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.fullName}
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 4 }}>
              {user?.email}
            </div>
            <Badge label={user?.role} />
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div style={{ padding: '6px' }}>
        {[
          { Icon: Icons.DashboardIcon, label: 'Dashboard',      action: () => handleLinkClick('dashboard') },
          { Icon: Icons.CalendarIcon,  label: 'My Events',      action: () => handleLinkClick('events') },
          { Icon: Icons.TicketIcon,    label: 'My Tickets',     action: () => handleLinkClick('myregs') },
          { Icon: Icons.CheckInIcon,   label: 'Check-In Tool',  action: () => handleLinkClick('checkin') },
        ].map(item => (
          <button 
            key={item.label} 
            onClick={item.action}
            style={{ 
              width: '100%', 
              textAlign: 'left', 
              padding: '10px 12px',
              border: 'none', 
              borderRadius: 'var(--radius-sm)', 
              fontSize: 13, 
              color: 'var(--color-text-muted)',
              display: 'flex', 
              alignItems: 'center', 
              gap: 10,
              background: 'transparent', 
              cursor: 'pointer', 
              fontWeight: 600,
              transition: 'all 0.12s' 
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--color-neutral-100)'
              e.currentTarget.style.color = 'var(--color-text-heading)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--color-text-muted)'
            }}
          >
            <item.Icon size={16} style={{ color: 'var(--color-neutral-400)' }} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Customer Support Section */}
      <div style={{ borderTop: '1px solid var(--color-border)', padding: '6px' }}>
        <button 
          onClick={() => handleLinkClick('support')}
          style={{ 
            width: '100%', 
            textAlign: 'left', 
            padding: '10px 12px',
            border: 'none', 
            borderRadius: 'var(--radius-sm)', 
            fontSize: 13, 
            color: 'var(--color-text-heading)',
            display: 'flex', 
            alignItems: 'center', 
            gap: 10,
            background: 'transparent', 
            cursor: 'pointer', 
            fontWeight: 600,
            transition: 'all 0.12s' 
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--color-neutral-100)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <Icons.InfoIcon size={16} style={{ color: 'var(--color-primary)' }} />
          <span>Contact Support</span>
        </button>
      </div>

      {/* Theme Selector Section */}
      <div style={{ borderTop: '1px solid var(--color-border)', padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)' }}>Theme Mode</span>
        <button 
          onClick={toggleTheme}
          style={{
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-neutral-100)',
            color: 'var(--color-text-heading)',
            fontSize: 12,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--color-neutral-200)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--color-neutral-100)'}
        >
          {theme === 'dark' ? <Icons.SunIcon size={14} /> : <Icons.MoonIcon size={14} />}
          <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
      </div>

      <div style={{ borderTop: '1px solid var(--color-border)', padding: '6px' }}>
        <button 
          onClick={() => { setMenuOpen(false); onLogout() }}
          style={{ 
            width: '100%', 
            textAlign: 'left', 
            padding: '10px 12px',
            border: 'none', 
            borderRadius: 'var(--radius-sm)', 
            fontSize: 13, 
            color: 'var(--color-danger)',
            display: 'flex', 
            alignItems: 'center', 
            gap: 10,
            background: 'transparent', 
            cursor: 'pointer', 
            fontWeight: 700,
            transition: 'all 0.12s' 
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--color-danger-light)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <Icons.LogOutIcon size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* ── DESKTOP NAVBAR VIEW ── */}
      <nav className="desktop-nav" style={{
        background: 'var(--color-bg-card)',
        borderBottom: '1px solid var(--color-border)',
        padding: '0 4rem',
        height: 84, /* Enlarge height */
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
      }}>
        {/* Logo */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 12,
          fontWeight: 800, 
          fontSize: 24, /* Enlarge logo font */
          color: 'var(--color-text-heading)', 
          flexShrink: 0,
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.03em',
          cursor: 'pointer'
        }} onClick={() => setPage('dashboard')}>
          <Icons.PlanifyLogo size={36} /> {/* Enlarge logo icon */}
          <span style={{ fontWeight: 800 }}>
            <span style={{ color: 'var(--color-primary)' }}>Plani</span>fy
          </span>
        </div>

        {/* Browser back and forward buttons */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginLeft: '1rem' }} className="no-print">
          <button 
            disabled={!canGoBack}
            onClick={goBack}
            style={{
              padding: '6px',
              borderRadius: '50%',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-card)',
              color: canGoBack ? 'var(--color-text-heading)' : 'var(--color-neutral-300)',
              cursor: canGoBack ? 'pointer' : 'not-allowed',
              opacity: canGoBack ? 1 : 0.4,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              minWidth: 32,
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.15s'
            }}
            title="Go Back"
          >
            <Icons.ChevronLeftIcon size={16} strokeWidth={2.5} />
          </button>
          <button 
            disabled={!canGoForward}
            onClick={goForward}
            style={{
              padding: '6px',
              borderRadius: '50%',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-card)',
              color: canGoForward ? 'var(--color-text-heading)' : 'var(--color-neutral-300)',
              cursor: canGoForward ? 'pointer' : 'not-allowed',
              opacity: canGoForward ? 1 : 0.4,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              minWidth: 32,
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.15s'
            }}
            title="Go Forward"
          >
            <Icons.ChevronRightIcon size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Nav Links */}
        <div style={{ display: 'flex', gap: 20, flex: 1, height: '100%', alignItems: 'center', marginLeft: '4rem' }}>
          {NAV_ITEMS.map(n => {
            const active = page === n.key
            return (
              <button 
                key={n.key} 
                onClick={() => setPage(n.key)}
                style={{
                  padding: '12px 20px', /* Larger padding */
                  border: 'none', 
                  background: 'transparent',
                  fontSize: 16, /* Increased font size */
                  fontWeight: active ? 700 : 600, 
                  cursor: 'pointer', 
                  transition: 'all 0.15s ease',
                  color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8,
                  position: 'relative'
                }}
                onMouseEnter={e => {
                  if (!active) e.currentTarget.style.color = 'var(--color-text-heading)'
                }}
                onMouseLeave={e => {
                  if (!active) e.currentTarget.style.color = 'var(--color-text-muted)'
                }}
              >
                <n.Icon size={18} strokeWidth={active ? 2.2 : 1.75} />
                <span>{n.label}</span>
                {active && (
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 20,
                    right: 20,
                    height: 3,
                    backgroundColor: 'var(--color-primary)',
                    borderRadius: '99px'
                  }} />
                )}
              </button>
            )
          })}
        </div>

        {/* User Dropdown */}
        <div style={{ position: 'relative' }} ref={desktopMenuRef}>
          <button 
            onClick={() => setMenuOpen(o => !o)}
            style={{
              display: 'flex', 
              alignItems: 'center', 
              gap: 10, 
              padding: '8px 16px 8px 8px', /* Increased padding */
              border: '1px solid var(--color-border)', 
              borderRadius: 99, 
              cursor: 'pointer',
              background: menuOpen ? 'var(--color-neutral-100)' : 'var(--color-bg-card)', 
              transition: 'all 0.15s ease',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Avatar name={user?.fullName} size={36} /> {/* Increased from 30 */}
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', lineHeight: 1.2 }}>
                {user?.fullName?.split(' ')[0]}
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em', marginTop: 1 }}>
                {user?.role?.toLowerCase()}
              </div>
            </div>
            <Icons.ChevronDownIcon 
              size={14} 
              strokeWidth={2} 
              style={{ 
                color: 'var(--color-neutral-400)',
                transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)' 
              }} 
            />
          </button>
          {menuOpen && renderDropdown()}
        </div>
      </nav>

      {/* ── MOBILE HEADER VIEW ── */}
      <header className="mobile-header">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 10,
          fontWeight: 800, 
          fontSize: 18, 
          color: 'var(--color-text-heading)', 
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.03em'
        }} onClick={() => setPage('dashboard')}>
          <Icons.PlanifyLogo size={28} />
          <span><span style={{ color: 'var(--color-primary)' }}>Plani</span>fy</span>
        </div>

        {/* Mobile controls: Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative' }} ref={mobileMenuRef}>
            <button 
              onClick={() => setMenuOpen(o => !o)}
              style={{
                display: 'flex', 
                alignItems: 'center', 
                border: 'none', 
                background: 'none', 
                cursor: 'pointer',
                padding: 0
              }}
            >
              <Avatar name={user?.fullName} size={34} />
            </button>
            {menuOpen && renderDropdown()}
          </div>
        </div>
      </header>

      {/* ── MOBILE BOTTOM NAVIGATION VIEW ── */}
      <div className="mobile-nav">
        {NAV_ITEMS.map(n => {
          const active = page === n.key
          return (
            <button 
              key={n.key} 
              onClick={() => setPage(n.key)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                border: 'none',
                background: 'transparent',
                flex: 1,
                height: '100%',
                padding: '4px 0',
                color: active ? 'var(--color-primary)' : 'var(--color-neutral-400)',
                transition: 'color 0.15s ease'
              }}
            >
              <n.Icon size={20} strokeWidth={active ? 2.3 : 1.75} />
              <span style={{ 
                fontSize: 10, 
                fontWeight: active ? 700 : 500, 
                letterSpacing: '0.01em' 
              }}>
                {n.label}
              </span>
            </button>
          )
        })}
      </div>
    </>
  )
}
