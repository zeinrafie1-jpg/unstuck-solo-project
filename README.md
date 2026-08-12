# UnStuck

An AI-powered decision coaching app that helps people navigate being stuck between two options — not with a generic pros & cons list, but with structured reasoning that specifically checks whether you're weighing a genuine tradeoff or just avoiding the harder, better choice out of anxiety.

**Live app:** [https://unstuck-solo-project.vercel.app/]
**Repo:** [https://github.com/zeinrafie1-jpg/unstuck-solo-project]

> Note: the backend is hosted on Render's free tier, which spins down after periods of inactivity. If the app feels slow on first load, give it 30-60 seconds to wake up. This is expected, not a bug.

---

## Screenshots

*(coming soon)*

---

## The idea

Most decision making tools just ask you to list pros and cons. UnStuck does something different: you describe the two options you're stuck between and what's making it hard, and the AI responds with four things:

- **What's really going on** — a read on the actual emotional or practical situation
- **The real tradeoff** — genuine pros and cons of each option
- **An avoidance check** — is this a genuine downside, or discomfort/anxiety dressed up as a reason?
- **A direct lean** — an actual recommendation with reasoning, not "it's up to you"

You can then discuss further with the AI in a live, streamed conversation, and revisit past decisions later.

## Why I built it this way

- **Not a to-do list, not a chatbot.** The value is in the structured reasoning and the avoidance check specifically.
- **Real-time streaming.** The follow-up conversation streams token by token via Server-Sent Events, the same pattern production AI apps use.
- **Secure by design.** JWT based auth with HTTP-only cookies (not localStorage), password hashing with bcrypt, and every decision scoped server-side to the authenticated user — never trusting client-supplied identity.

## Tech stack

**Frontend:** React (Vite), React Router, Context API for auth state
**Backend:** Node.js, Express, MongoDB (Mongoose)
**AI:** Anthropic API, with Server-Sent Events for streaming responses
**Auth:** JWT + HTTP-only cookies, bcrypt password hashing
**Deployment:** Vercel (frontend), Render (backend), MongoDB Atlas (database)

## Features

- Email/password authentication with persisted sessions and protected routes
- Create a decision - describe two options and the context, get a structured AI analysis
- AI-generated decision titles, framed as clear questions
- View all past decisions, with a recommendation badge on each
- Revisit any past decision in full detail
- Discuss further with the AI on any decision - streamed live, saved to the conversation history
- Delete past decisions

## What I'm still working on

- [ ] Automated tests (Jest/Supertest) for core auth and decision logic
- [ ] CI pipeline via GitHub Actions
- [ ] Visual design pass
- [ ] Streaming the initial structured response (currently only the follow-up chat streams)

## Running it locally

### Prerequisites
- Node.js
- A MongoDB Atlas account (or local MongoDB instance)
- An Anthropic API key

### Setup

Clone the repo:
```bash
git clone [https://github.com/zeinrafie1-jpg/unstuck-solo-project]
cd unstuck-solo-project
```

**Backend:**
```bash
cd api
npm install
```
Create a `.env` file in `api/` with:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ANTHROPIC_API_KEY=your_anthropic_api_key
FRONTEND_URL=http://localhost:5173
```
Run it:
```bash
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
```
Create a `.env` file in `frontend/` with:
```
VITE_API_URL=http://localhost:5000/api
```
Run it:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Architecture notes

- **Auth flow:** signup/login issue a JWT stored in an HTTP-only cookie (not localStorage, to protect against XSS). A `protect` middleware verifies the token on every protected route and attaches the user's ID to the request — the frontend never tells the backend who it is; identity is always derived from the verified token.
- **Streaming:** the follow-up chat uses `anthropic.messages.stream()` on the backend, piped to the frontend via Server-Sent Events (`text/event-stream`), and consumed on the frontend using the Fetch API's `ReadableStream` (rather than `EventSource`, since the endpoint requires POST + credentials, which `EventSource` doesn't support).
- **Data model:** each decision stores the user's input, the AI's structured analysis, and an array of follow-up messages — all scoped to the owning user via a server-verified `userId`, never a client-supplied value.
