import React, { useState, useEffect, useRef } from 'react'
import * as Icons from './Icons.jsx'
import { eventApi } from '../utils/api.js'

// Simple endpoint caller
import { api } from '../utils/api.js'

export const chatApi = {
  getHistory: () => api('/chats'),
  saveMessage: (msg) => api('/chats', { method: 'POST', body: JSON.stringify(msg) })
}

export default function Chatbot({ user }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [events, setEvents] = useState([])
  const chatEndRef = useRef(null)

  // Fetch active events to answer queries intelligently
  useEffect(() => {
    if (open) {
      eventApi.list('').then(d => {
        setEvents(d?.content || [])
      }).catch(() => {})
    }
  }, [open])

  // Fetch chat history from DB
  useEffect(() => {
    if (user) {
      chatApi.getHistory()
        .then(data => {
          if (data && data.length > 0) {
            setMessages(data)
          } else {
            // Default welcome message
            setMessages([
              {
                id: 'welcome',
                sender: 'BOT',
                text: `Hello ${user.fullName.split(' ')[0]}! I am your Planify AI Support Assistant. How can I help you with our event management system today?`,
                timestamp: new Date().toISOString()
              }
            ])
          }
        })
        .catch(() => {
          // Fallback to local welcome if API fails
          setMessages([
            {
              id: 'welcome',
              sender: 'BOT',
              text: `Hello ${user.fullName.split(' ')[0]}! I am your Planify AI Support Assistant. How can I help you with our event management system today?`,
              timestamp: new Date().toISOString()
            }
          ])
        })
    }
  }, [user])

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = async (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text) return

    setInput('')
    const userMsg = {
      sender: 'USER',
      text: text,
      timestamp: new Date().toISOString()
    }

    // Append user message local state
    setMessages(prev => [...prev, userMsg])
    
    // Save User message to DB
    if (user) {
      chatApi.saveMessage(userMsg).catch(() => {})
    }

    setLoading(true)

    // Simulate short AI thought delay
    setTimeout(async () => {
      const replyText = generateBotReply(text)
      const botMsg = {
        sender: 'BOT',
        text: replyText,
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, botMsg])
      setLoading(false)

      // Save Bot response to DB
      if (user) {
        chatApi.saveMessage(botMsg).catch(() => {})
      }
    }, 850)
  }

  const generateBotReply = (query) => {
    const q = query.trim().toLowerCase()

    // 1. Check if asking about active events
    if (q.includes('event') || q.includes('list') || q.includes('show') || q.includes('schedule') || q.includes('program')) {
      if (events && events.length > 0) {
        const listStr = events.slice(0, 5).map(ev => {
          const dateStr = new Date(ev.startDateTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
          return `- ${ev.title} (${ev.category} on ${dateStr} at ${ev.venue})`
        }).join('\n')
        return `We currently have ${events.length} active events on Planify. Here are some upcoming ones:\n\n${listStr}\n\nTo view full details or register, please head to the Events page. You can ask me about a specific event by typing its name!`
      } else {
        return `There are currently no active events scheduled in the system. Organizers can create new events using the "New Event" form in the Events page.`
      }
    }

    // 2. Check for specific event title matches in our loaded events list
    const matchedEvent = events.find(ev => {
      const title = ev.title.toLowerCase()
      return q.includes(title) || title.split(' ').some(word => word.length > 3 && q.includes(word))
    })
    if (matchedEvent) {
      const startStr = new Date(matchedEvent.startDateTime).toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
      })
      return `Here are the details for "${matchedEvent.title}":
- Category: ${matchedEvent.category}
- Date: ${startStr}
- Venue: ${matchedEvent.venue} (${matchedEvent.venueAddress || 'Address not listed'})
- Capacity: ${matchedEvent.registeredCount} / ${matchedEvent.capacity} registered
- Status: ${matchedEvent.status}

Let me know if you would like information on other sessions or registration details!`
    }

    // 3. Keyword matching for support, check-in, tickets
    if (q.includes('check-in') || q.includes('checkin') || q.includes('attendance') || q.includes('validate') || q.includes('door')) {
      return `To check in attendees:
1. Navigate to the "Check-In" tab in the top navigation header.
2. Enter the attendee's ticket alphanumeric string code (e.g. EVT-XXXX-XXXX).
3. Click "Validate & Check In". The system checks for duplicates and registers attendance. If the attendee has already checked in, it will show a warning: "Attendance Marked Already".`
    }

    if (q.includes('ticket') || q.includes('badge') || q.includes('my tickets') || q.includes('print') || q.includes('barcode')) {
      return `To view or print your digital badges and tickets:
1. Navigate to the "My Tickets" tab.
2. You will see a list of your registrations.
3. Click the "Badge" button to open your digital pass modal containing your attendee profile and ticket barcode.
4. Click "Print Attendee Pass" to print it directly from your browser.`
    }

    if (q.includes('create') || q.includes('organize') || q.includes('host') || q.includes('new event') || q.includes('add event')) {
      return `If you are registered as an Organizer or Admin, you can easily create new events:
1. Navigate to the "Events" tab.
2. Click the "New Event" button at the top right.
3. Fill out the event name, venue, start/end times, limit capacity, category, and custom cover image URL.
4. Click "Create Event" and publish it so attendees can register.`
    }

    if (q.includes('support') || q.includes('email') || q.includes('contact') || q.includes('help') || q.includes('hypeflume') || q.includes('customer')) {
      return `You can reach our customer support team directly at:
Email: hypeflume036@gmail.com

Alternatively, you can open a support ticket under the "Support" link in your profile dropdown menu.`
    }

    if (q.includes('reviews') || q.includes('feedback') || q.includes('ratings') || q.includes('stars') || q.includes('satisfaction') || q.includes('ratings')) {
      return `To leave feedback for an event you attended:
1. Go to the "Events" tab.
2. Click the event card to open its detail page.
3. Go to the "Reviews" tab, select a star rating (1-5), write your feedback, and click "Submit Review".
4. Organizers can see these satisfaction metrics directly in their host dashboard.`
    }

    if (q.includes('mode') || q.includes('theme') || q.includes('dark') || q.includes('light') || q.includes('color')) {
      return `To toggle between Dark and Light mode:
1. Click on your profile dropdown menu in the top navigation bar.
2. Click the "Dark Mode" / "Light Mode" toggle option to switch the theme instantly.`
    }

    if (q.includes('role') || q.includes('permission') || q.includes('admin') || q.includes('organizer') || q.includes('participant')) {
      return `Planify has three user roles:
- Admin: Full system control, including overviewing metrics and checking in attendees.
- Organizer: Can create and manage their own events, view dashboards, and check in attendees.
- Participant: Can browse events, register, view tickets/badges, and submit reviews.`
    }

    if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('greetings')) {
      return `Hello! How can I assist you with the Planify Event System today? You can ask about:
- Viewing active events
- Ticket badge printing
- Door check-ins
- Creating new events
- Leaving event feedback
- Contacting support`
    }

    // Default fallback
    return `I am the Planify Support Bot. I am trained specifically on our Event Management system.

Could you please specify your query? I can assist you with details of active events, ticket badge printouts, check-ins, or contacting customer support at hypeflume036@gmail.com.`
  }

  return (
    <div className="no-print" style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}>
      {/* Chat bubble button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #00c6ff 0%, #0066f2 100%)',
            color: '#ffffff',
            border: 'none',
            boxShadow: '0 8px 30px rgba(0, 102, 242, 0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      {/* Expanded chat panel */}
      {open && (
        <div style={{
          width: 380,
          height: 480,
          background: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 24,
          boxShadow: 'var(--shadow-dropdown)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #00c6ff 0%, #0066f2 100%)',
            padding: '16px 20px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icons.PlanifyLogo size={20} style={{ filter: 'brightness(0) invert(1)' }} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.2px' }}>Planify Support Bot</div>
                <div style={{ fontSize: 11, opacity: 0.85, fontWeight: 600 }}>Event Support Agent</div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', display: 'flex', padding: 4 }}
            >
              <Icons.XIcon size={20} />
            </button>
          </div>

          {/* Messages list */}
          <div style={{
            flex: 1,
            padding: 20,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            background: 'var(--color-neutral-50)'
          }}>
            {messages.map((m, idx) => {
              const isBot = m.sender === 'BOT'
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isBot ? 'flex-start' : 'flex-end',
                    maxWidth: '85%',
                    alignSelf: isBot ? 'flex-start' : 'flex-end'
                  }}
                >
                  <div style={{
                    background: isBot ? 'var(--color-bg-card)' : 'var(--color-primary)',
                    color: isBot ? 'var(--color-text-main)' : '#ffffff',
                    padding: '10px 14px',
                    borderRadius: isBot ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                    fontSize: 13,
                    fontWeight: 500,
                    lineHeight: 1.4,
                    border: isBot ? '1px solid var(--color-border)' : 'none',
                    whiteSpace: 'pre-wrap',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    {m.text}
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--color-neutral-400)', marginTop: 4, padding: '0 4px' }}>
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )
            })}
            
            {loading && (
              <div style={{ display: 'flex', gap: 6, alignSelf: 'flex-start', padding: '10px 14px', background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '16px 16px 16px 4px' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-neutral-400)', animation: 'spin 1s linear infinite' }} />
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-neutral-400)', animation: 'spin 1s linear infinite', animationDelay: '0.2s' }} />
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-neutral-400)', animation: 'spin 1s linear infinite', animationDelay: '0.4s' }} />
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Form Input */}
          <form
            onSubmit={handleSend}
            style={{
              padding: '12px 16px',
              borderTop: '1px solid var(--color-border)',
              background: 'var(--color-bg-card)',
              display: 'flex',
              gap: 10,
              alignItems: 'center'
            }}
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about tickets, check-ins, events..."
              style={{
                flex: 1,
                padding: '10px 14px',
                fontSize: 13,
                border: '1px solid var(--color-border)',
                borderRadius: 99,
                background: 'var(--color-bg-input)',
                boxShadow: 'none'
              }}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'var(--color-primary)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: input.trim() ? 1 : 0.5
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
