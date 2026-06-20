import React from 'react'
import * as Icons from './Icons.jsx'

// ── Design tokens ──────────────────────────────────────────────────────────────
export const COLORS = {
  primary: 'var(--color-primary, #4f46e5)',
  primaryDark: 'var(--color-primary-dark, #3730a3)',
  primaryLight: 'var(--color-primary-light, #eef2ff)',
  success: 'var(--color-success, #10b981)',
  warning: 'var(--color-warning, #f59e0b)',
  danger: 'var(--color-danger, #ef4444)',
  neutral: 'var(--color-neutral-600, #475569)',
}

// ── Avatar ────────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  { bg: '#eef2ff', fg: '#4f46e5' }, // indigo
  { bg: '#ecfdf5', fg: '#059669' }, // emerald
  { bg: '#f0f9ff', fg: '#0284c7' }, // sky
  { bg: '#fdf4ff', fg: '#c084fc' }, // purple
  { bg: '#fff7ed', fg: '#ea580c' }, // orange
  { bg: '#f0fdf4', fg: '#16a34a' }, // green
  { bg: '#fff1f2', fg: '#e11d48' }, // rose
  { bg: '#faf5ff', fg: '#9333ea' }, // violet
]

export function Avatar({ name = '?', size = 36 }) {
  const initials = name.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const charCode = initials.charCodeAt(0) || 0
  const colorScheme = AVATAR_COLORS[charCode % AVATAR_COLORS.length]
  
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', 
      background: colorScheme.bg, color: colorScheme.fg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, fontWeight: 700, flexShrink: 0,
      letterSpacing: '-0.5px', border: `1px solid ${colorScheme.fg}18`
    }}>{initials}</div>
  )
}

// ── Badge ─────────────────────────────────────────────────────────────────────
const BADGE_STYLES = {
  CONFIRMED:   { bg: 'rgba(16, 185, 129, 0.16)', fg: '#059669', label: 'Confirmed' },
  ATTENDED:    { bg: 'rgba(59, 130, 246, 0.16)', fg: '#1d4ed8', label: 'Attended' },
  WAITLISTED:  { bg: 'rgba(245, 158, 11, 0.16)',  fg: '#d97706', label: 'Waitlist' },
  CANCELLED:   { bg: 'rgba(239, 68, 68, 0.16)',  fg: '#dc2626', label: 'Cancelled' },
  PENDING:     { bg: 'rgba(100, 116, 139, 0.16)', fg: '#475569', label: 'Pending' },
  NO_SHOW:     { bg: 'rgba(148, 163, 184, 0.16)', fg: '#64748b', label: 'No Show' },
  
  PUBLISHED:   { bg: '#047857', fg: '#ffffff', label: 'Published' },
  DRAFT:       { bg: 'rgba(100, 116, 139, 0.18)', fg: '#475569', label: 'Draft' },
  COMPLETED:   { bg: 'rgba(59, 130, 246, 0.18)', fg: '#1d4ed8', label: 'Completed' },
  
  CONFERENCE:  { bg: 'rgba(139, 92, 246, 0.18)',  fg: '#7c3aed', label: 'Conference' },
  WORKSHOP:    { bg: 'rgba(249, 115, 22, 0.18)',  fg: '#ea580c', label: 'Workshop' },
  SEMINAR:     { bg: 'rgba(59, 130, 246, 0.18)',  fg: '#2563eb', label: 'Seminar' },
  NETWORKING:  { bg: 'rgba(16, 185, 129, 0.18)',  fg: '#059669', label: 'Networking' },
  WEBINAR:     { bg: 'rgba(236, 72, 153, 0.18)',  fg: '#db2777', label: 'Webinar' },
  TRAINING:    { bg: 'rgba(14, 165, 233, 0.18)',  fg: '#0284c7', label: 'Training' },
  OTHER:       { bg: 'rgba(100, 116, 139, 0.18)', fg: '#475569', label: 'Other' },
  
  ADMIN:       { bg: 'rgba(244, 63, 94, 0.2)',   fg: '#e11d48', label: 'Admin' },
  ORGANIZER:   { bg: 'rgba(139, 92, 246, 0.2)',  fg: '#7c3aed', label: 'Organizer' },
  PARTICIPANT: { bg: 'rgba(59, 130, 246, 0.2)',  fg: '#2563eb', label: 'Participant' },
}

export function Badge({ label }) {
  const styleInfo = BADGE_STYLES[label]
  const bg = styleInfo?.bg || '#f1f5f9'
  const fg = styleInfo?.fg || '#475569'
  const text = styleInfo?.label || label
  
  // Strip emojis from label text for a cleaner look if desired, or keep them for visual variety
  const cleanText = text.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '').trim()

  return (
    <span style={{
      background: bg, color: fg, fontSize: 11, padding: '3px 10px',
      borderRadius: 999, fontWeight: 600, letterSpacing: '0.01em',
      whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 4,
      border: `1px solid ${fg}15`
    }}>{cleanText}</span>
  )
}

// ── Button ────────────────────────────────────────────────────────────────────
export function Btn({ children, onClick, variant = 'default', size = 'md', disabled, style, type='button' }) {
  const variants = {
    primary:  { background: 'var(--color-primary)', color: '#fff', borderColor: 'var(--color-primary)', boxShadow: '0 2px 10px rgba(79, 70, 229, 0.25)' },
    success:  { background: 'var(--color-success)', color: '#fff', borderColor: 'var(--color-success)', boxShadow: '0 2px 10px rgba(16, 185, 129, 0.2)' },
    danger:   { background: 'var(--color-danger)', color: '#fff', borderColor: 'var(--color-danger)', boxShadow: '0 2px 10px rgba(239, 68, 68, 0.2)' },
    ghost:    { background: 'transparent', color: 'var(--color-text-main)', borderColor: 'transparent' },
    outline:  { background: 'transparent', color: 'var(--color-primary)', borderColor: 'var(--color-primary)' },
    default:  { background: 'var(--color-bg-card, #ffffff)', color: 'var(--color-text-main, var(--color-neutral-700))', borderColor: 'var(--color-border, var(--color-neutral-200))', boxShadow: 'var(--shadow-sm)' },
  }
  
  const sizes = {
    sm: { padding: '6px 14px', fontSize: 12, borderRadius: 'var(--radius-sm)' },
    md: { padding: '11px 22px', fontSize: 15, borderRadius: 'var(--radius-md)' },
    lg: { padding: '14px 28px', fontSize: 16, borderRadius: 'var(--radius-md)' },
  }

  const [active, setActive] = React.useState(false)
  const [hovered, setHovered] = React.useState(false)

  const handleMouseEnter = () => !disabled && setHovered(true)
  const handleMouseLeave = () => { setHovered(false); setActive(false) }
  const handleMouseDown = () => !disabled && setActive(true)
  const handleMouseUp = () => setActive(false)

  const variantStyle = variants[variant]
  
  // Custom button styling override based on hover
  let hoverOverride = {}
  if (hovered) {
    if (variant === 'default') {
      hoverOverride = { background: 'var(--color-neutral-100)', borderColor: 'var(--color-neutral-300)' }
    } else if (variant === 'outline') {
      hoverOverride = { background: 'rgba(99, 102, 241, 0.08)', borderColor: 'var(--color-primary-dark)' }
    } else if (variant === 'ghost') {
      hoverOverride = { background: 'var(--color-neutral-100)', color: 'var(--color-text-heading)' }
    } else if (variant === 'primary') {
      hoverOverride = { background: 'var(--color-primary-dark)', borderColor: 'var(--color-primary-dark)', boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)' }
    }
  }

  const activeScale = active ? { transform: 'scale(0.975)' } : {}

  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{ 
        ...variantStyle, 
        ...sizes[size], 
        fontWeight: 600,
        borderWidth: 1, 
        borderStyle: 'solid', 
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1, 
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)', 
        outline: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        ...hoverOverride,
        ...activeScale,
        ...style 
      }}
    >
      {children}
    </button>
  )
}

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, style, onClick, hover, glass }) {
  const [hovered, setHovered] = React.useState(false)
  return (
    <div onClick={onClick}
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
      className={glass ? 'glass-card' : ''}
      style={{
        background: 'var(--color-bg-card, #ffffff)', 
        borderRadius: 'var(--radius-lg, 16px)',
        border: `1px solid ${hovered ? 'var(--color-neutral-400)' : 'var(--color-border)'}`,
        padding: '2rem', /* Increased from 1.5rem */
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: hovered ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
        transform: hovered ? 'translateY(-2px)' : 'none',
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}>{children}</div>
  )
}

// ── Fill bar ──────────────────────────────────────────────────────────────────
export function FillBar({ pct, showLabel }) {
  const color = pct >= 90 ? 'var(--color-danger)' : pct >= 70 ? 'var(--color-warning)' : 'var(--color-success)'
  const safePct = Math.min(Math.max(pct, 0), 100)
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
      <div style={{ flex: 1, background: 'var(--color-neutral-100)', borderRadius: 99, height: 8, overflow: 'hidden', border: '1px solid var(--color-neutral-200)10' }}>
        <div style={{ 
          width: `${safePct}%`, 
          background: color, 
          height: '100%', 
          borderRadius: 99, 
          transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)' 
        }}/>
      </div>
      {showLabel && (
        <span style={{ 
          fontSize: 12, 
          fontWeight: 700, 
          color: 'var(--color-neutral-700)', 
          minWidth: 36,
          textAlign: 'right'
        }}>
          {Math.round(pct)}%
        </span>
      )}
    </div>
  )
}

// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner({ size = 32, center }) {
  const el = <div style={{ 
    width: size, 
    height: size, 
    border: `2px solid var(--color-neutral-200)`,
    borderTopColor: 'var(--color-primary)', 
    borderRadius: '50%', 
    animation: 'spin 0.6s linear infinite' 
  }}/>
  return center ? <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>{el}</div> : el
}

// ── Alert ─────────────────────────────────────────────────────────────────────
export function Alert({ type = 'info', children, onClose }) {
  const styles = {
    info:    { bg: 'var(--color-primary-light)', fg: 'var(--color-primary-dark)', border: 'rgba(99, 102, 241, 0.2)', icon: <Icons.InfoIcon size={18} /> },
    success: { bg: 'var(--color-success-light)', fg: 'var(--color-success-dark)', border: 'rgba(16, 185, 129, 0.2)', icon: <Icons.CheckIcon size={18} /> },
    error:   { bg: 'var(--color-danger-light)', fg: 'var(--color-danger-dark)', border: 'rgba(239, 68, 68, 0.2)', icon: <Icons.AlertCircleIcon size={18} /> },
    warning: { bg: 'var(--color-warning-light)', fg: 'var(--color-warning-dark)', border: 'rgba(245, 158, 11, 0.2)', icon: <Icons.AlertCircleIcon size={18} /> },
  }
  const s = styles[type] || styles.info
  return (
    <div style={{ 
      background: s.bg, 
      color: s.fg, 
      border: `1px solid ${s.border}`,
      borderRadius: 'var(--radius-md)', 
      padding: '12px 16px', 
      fontSize: 14, 
      display: 'flex',
      alignItems: 'center', 
      justifyContent: 'space-between',
      gap: 12, 
      marginBottom: 16,
      boxShadow: '0 2px 4px rgba(0,0,0,0.01)',
      fontWeight: 500
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ display: 'flex', flexShrink: 0 }}>{s.icon}</span>
        <span>{children}</span>
      </div>
      {onClose && (
        <button 
          onClick={onClose}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: s.fg, 
            padding: 4,
            cursor: 'pointer', 
            lineHeight: 1, 
            display: 'flex', 
            borderRadius: '50%' 
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <Icons.XIcon size={16} />
        </button>
      )}
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────
export function Empty({ icon, title, subtitle }) {
  // Map typical emoji icons or string names passed to clean custom renderings
  let SvgIcon = Icons.CalendarIcon
  if (icon === 'search' || icon === '🔍') SvgIcon = Icons.SearchIcon
  if (icon === 'ticket' || icon === '🎫') SvgIcon = Icons.TicketIcon
  if (icon === 'calendar' || icon === '📋') SvgIcon = Icons.CalendarIcon
  if (icon === 'users' || icon === '👥') SvgIcon = Icons.UsersIcon
  
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '5rem 2rem', 
      color: 'var(--color-neutral-400)',
      background: 'var(--color-bg-card, #ffffff)',
      border: '1px dashed var(--color-border)',
      borderRadius: 'var(--radius-lg)'
    }}>
      <div style={{ 
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 64,
        height: 64,
        borderRadius: '50%',
        background: 'var(--color-neutral-50)',
        color: 'var(--color-neutral-400)',
        marginBottom: 16
      }}>
        <SvgIcon size={32} strokeWidth={1.5} />
      </div>
      <div style={{ 
        fontSize: 16, 
        fontWeight: 700, 
        color: 'var(--color-text-heading)', 
        marginBottom: 4 
      }}>{title}</div>
      {subtitle && <div style={{ fontSize: 14, color: 'var(--color-neutral-400)' }}>{subtitle}</div>}
    </div>
  )
}

// ── Section header ────────────────────────────────────────────────────────────
export function SectionHeader({ title, subtitle, action }) {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      marginBottom: '1.75rem', 
      gap: 16,
      flexWrap: 'wrap'
    }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-text-heading)', marginBottom: 4 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 14, color: 'var(--color-text-muted)', fontWeight: 500 }}>{subtitle}</p>}
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  )
}

// ── Tab row ───────────────────────────────────────────────────────────────────
export function Tabs({ tabs, active, onChange }) {
  return (
    <div style={{ 
      display: 'flex', 
      gap: 4, 
      background: 'var(--color-neutral-100)', 
      borderRadius: varRadius('radius-md', 12),
      padding: 4, 
      marginBottom: '1.75rem', 
      width: 'fit-content' 
    }}>
      {tabs.map(t => {
        const isActive = active === t.key
        return (
          <button 
            key={t.key} 
            onClick={() => onChange(t.key)}
            style={{
              padding: '8px 16px', 
              border: 'none', 
              borderRadius: '9px', 
              fontSize: 13,
              fontWeight: 700, 
              transition: 'all 0.15s ease',
              background: isActive ? 'var(--color-bg-card, #ffffff)' : 'transparent',
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
              boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
            }}
          >
            {t.label}
            {t.count != null && (
              <span style={{ 
                marginLeft: 6, 
                fontSize: 11, 
                padding: '1px 6px', 
                borderRadius: 99,
                background: isActive ? 'var(--color-primary-light)' : 'var(--color-neutral-200)',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontWeight: 700
              }}>
                {t.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

// Helper to avoid build issues with variable usage
function varRadius(cssName, fallback) {
  return `var(--${cssName}, ${fallback}px)`
}

// ── Helper: format dates ──────────────────────────────────────────────────────
export function fmtDateTime(dt) {
  if (!dt) return '—'
  return new Date(dt).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}
export function fmtDate(dt) {
  if (!dt) return '—'
  return new Date(dt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}
export function fmtTime(dt) {
  if (!dt) return '—'
  return new Date(dt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

// ── Category icon ─────────────────────────────────────────────────────────────
export function catIcon(cat) {
  const mapping = {
    CONFERENCE: <Icons.BuildingIcon size={24} />,
    WORKSHOP: <Icons.BriefcaseIcon size={24} />,
    SEMINAR: <Icons.CalendarIcon size={24} />,
    NETWORKING: <Icons.UsersIcon size={24} />,
    WEBINAR: <Icons.DashboardIcon size={24} />,
    TRAINING: <Icons.CalendarIcon size={24} />,
    OTHER: <Icons.CalendarIcon size={24} />
  }
  return mapping[cat] || <Icons.CalendarIcon size={24} />
}
