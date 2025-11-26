# Agnos Candidate Assignment — Frontend (Patient + Staff)

## Overview
This project implements a responsive patient intake form and a staff monitoring view synchronized in real time using Socket.IO.

## Tech stack
- Frontend: Next.js, React, TailwindCSS, Shadcn, Zustand
- Backend: Node, Express
- Realtime: Socket.IO (server + client)
- Backend hosting: Render (simple Node server using in-memory)
- Frontend hosting: Vercel

## Quickstart (local)
1. Backend
    - cd backend
    - npm install
    - npm run dev

    ### result
    Server listen on http://localhost:6969

2. Frontend
    - cd frontend
    - npm install
    - set .env = NEXT_PUBLIC_SOCKET_URL = http://localhost:6969
    - npm run dev

## Deployment
- Deploy backend (Node) to Render Get public URL : (https://patient-appointment-form.vercel.app/).
- Deploy frontend to Vercel. Set `NEXT_PUBLIC_SOCKET_URL` env var to backend URL : 'https://patient-appointment-node-socket.onrender.com/'.
** Render will drop server when Inactive for sometime, will take roughly 50 second to recovering 


## Project Structure
(see tree in repo root README)

## Real-time synchronization flow
- GENERAL_EVENT.JOIN : let admin join admin room and get all the current data
- GENERAL_EVENT.LEAVE : let admin leave anyroom
- GENERAL_EVENT.SNAPSHOT : fire when click on current sessionId to monitoring form in real-time

- PATIENT_EVENT.UPDATE : let patient send updated current data that filled in form
- PATIENT_EVENT.STATUS : let patient send updated current status to update current session status
- PATIENT_EVENT.STATUS_CARD : let patient send updated current status (small package) to update session listing

-ADMIN_EVENT.REQUEST_SESSION_LIST : let admin request all session list when join (WIP)
-ADMIN_EVENT.REQUEST_SESSION : let admin request curtain session to monitoring (WIP)

## Bonus features implemented
- Debounced typing updates
- Idle detection
- Monitring status of all current and past patient
- Snapshot support for staff join