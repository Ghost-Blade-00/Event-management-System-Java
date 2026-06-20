# Planify - Event Management System

A full-stack Event Management System built using **React.js**, **Spring Boot**, and **MongoDB Atlas**. The platform enables users to discover, register, and manage events while providing administrators with tools to create, publish, and monitor events efficiently.

---

## Project Overview

Planify is designed to simplify event management by providing a centralized platform for event organizers and attendees. Users can browse events, register for participation, manage their registrations, and interact with an integrated support chatbot. Administrators can create and manage events, track registrations, and monitor event statistics through a dedicated dashboard.

---

## Features

### User Features

* User Registration and Login
* Secure JWT Authentication
* Browse Available Events
* Search Events
* Event Registration
* View Registered Events
* Digital Ticket Management
* Event Check-In System
* Responsive User Interface
* Integrated Support Chatbot

### Admin Features

* Create Events
* Update Event Details
* Publish Events
* Cancel Events
* Delete Events
* Manage Event Registrations
* Event Statistics Dashboard
* Session Management

### Support Chatbot

* Event Information Assistance
* Registration Guidance
* Ticket Support
* Check-In Information
* Frequently Asked Questions
* 24/7 User Support Experience

---

## Technology Stack

### Frontend

* React.js
* Vite
* JavaScript
* CSS3

### Backend

* Spring Boot 3
* Spring Security
* Spring Data MongoDB
* JWT Authentication
* Maven

### Database

* MongoDB Atlas

### Deployment

* Vercel
* Render

---

## Project Structure

```bash
eventapp/
│
├── backend/
│   ├── src/main/java/com/eventmgmt
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── model/
│   │   ├── dto/
│   │   └── config/
│   │
│   ├── src/main/resources/
│   └── pom.xml
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## Authentication & Security

The application uses JWT-based authentication with Spring Security to ensure secure access to protected resources.

### Security Features

* JWT Authentication
* BCrypt Password Encryption
* Role-Based Authorization
* Spring Security Integration
* CORS Configuration
* Request Validation

---

## Database Collections

### Users

Stores user account information and roles.

### Events

Stores event details including title, description, venue, date, capacity, and status.

### Registrations

Stores event registration records.

### Chat Messages

Stores chatbot conversation history.

---

## Installation & Setup

### Clone Repository

```bash
git clone <repository-url>

cd eventapp
```

### Backend Setup

```bash
cd backend

mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## Screenshots

### Landing Page



```md
<img width="1536" height="691" alt="image" src="https://github.com/user-attachments/assets/7217e98d-c0c9-4d24-be9c-e81bbfcec70a" />

```

### User Registration


```md
<img width="1536" height="684" alt="image" src="https://github.com/user-attachments/assets/a021805a-67a0-46b9-bb8d-f5f5d70b5302" />

```

### User Login



```md
<img width="1534" height="681" alt="image" src="https://github.com/user-attachments/assets/dee8946d-e4df-49e9-b89a-7d3dc1c95c7f" />

```

### Event Listing


```md
<img width="1536" height="694" alt="image" src="https://github.com/user-attachments/assets/753b5798-d122-46ce-9fb6-b1ecea43f604" />

```

### Dashboard


```md
<img width="1536" height="688" alt="image" src="https://github.com/user-attachments/assets/a9b0bcd8-8e92-43d9-b5a3-f051e72a9ddc" />

```

### Chatbot Support



```md
<img width="330" height="404" alt="image" src="https://github.com/user-attachments/assets/8eba0e4e-2440-453c-88b2-fa640cfe883c" />

```

### 24/7 Customer Support


```md
<img width="1536" height="693" alt="image" src="https://github.com/user-attachments/assets/92f9215b-ab7e-49f3-a59c-c6da43c8267b" />

```

---

### Participant Check-In

Validate ticket codes and record attendance in real time.

```md
<img width="1536" height="702" alt="image" src="https://github.com/user-attachments/assets/843004c8-689c-4410-86e5-a4eec2f7207a" />
```

---

### My Tickets & Registrations

Registered users can access all upcoming events, registration status, ticket IDs, and attendee badges from a centralized dashboard.
```md
<img width="1536" height="429" alt="image" src="https://github.com/user-attachments/assets/bcc65016-8dbe-4ff5-8eff-2bbf666bebc3" />
```

---

### Digital Attendee Pass

Each successful registration generates a digital attendee pass containing a unique ticket code for event check-in and attendance verification.
```md
<img width="1536" height="683" alt="image" src="https://github.com/user-attachments/assets/3c5f1b95-4483-410a-8d28-68ccbebf014b" />
```
---

### Core Platform Solutions

Planify provides multiple event management solutions including registration management, mobile event applications, webinar hosting, and attendee engagement tools.
```md
<img width="1536" height="631" alt="image" src="https://github.com/user-attachments/assets/af722eb7-9740-492c-b3df-0fc4b799d9fe" />
```
---

### Event Lifecycle Management

The platform supports the complete event lifecycle from planning and promotion to execution and post-event analysis.
```md
<img width="1536" height="687" alt="image" src="https://github.com/user-attachments/assets/dfb7e1fc-79df-4625-9e42-283cd0c12a5c" />
```

---

## Sample User Registration

To explore the application, create an account using the registration page.

Example:

```text
Name: Demo User
Email: demo@domain.com
Password: demo@123
```

---

## Key Functionalities

* Event Creation and Management
* User Registration and Authentication
* Event Registration Workflow
* Event Publishing and Cancellation
* Dashboard Analytics
* Session Scheduling
* Ticket and Check-In Management
* Support Chatbot
* MongoDB Data Persistence

---

## Future Enhancements

* QR Code Based Check-In
* Email Notifications
* Event Analytics Dashboard
* Payment Gateway Integration
* Google Authentication
* Real-Time Notifications
* AI-Powered Event Assistant

---

