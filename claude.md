I want you to implement a minimal, production-ready MVP of a web platform called Memora (placeholder name) where communities can share favorite places, food stalls, quotes, or memories and let others engage via likes/upvotes or polls. Build it with clean engineering practices, but prioritize speed of deployment and iteration over complex infra.

Project Goals

Ship a working version quickly to test with a real community.

Users can:

Create prompts/questions.

Respond with text or polls.

Upvote/like responses.

Share links to prompts (viral mechanic: “challenge a friend”).

Keep it playful, lightweight, mobile-first.

Tech Stack (lean choices)

Frontend: React + Vite + TypeScript, TailwindCSS, Framer Motion (for playful interactions).

Backend: Node.js + TypeScript with Express (keep it simple).

Database: PostgreSQL (managed service — e.g., Supabase or Neon). Use Prisma for schema + migrations.

Auth: Firebase Auth (Google OAuth + Email) to avoid building JWT/token infra from scratch.

Hosting:

Frontend → Vercel (auto SSL, deploy previews).

Backend → Render or Railway (simple, auto-deploy from GitHub).

Monitoring: Console logs + Sentry for error tracking.

CI/CD: GitHub Actions — run lint + test + auto-deploy to Vercel/Render on main branch.

Features to Implement

1. Prompt Creation

User can post a prompt/question (title, body, type: text or poll).

Option to scope to a community (e.g., “Class of 2010”).

2. Responses

Text response → upvotable.

Poll response → user selects one option, results update.

3. Community Feed

Infinite scroll feed of prompts & responses.

Sort: recent or trending.

4. Sharing / Virality

Each prompt has a share button (short link generated via Supabase edge functions or external service like Rebrandly).

“Challenge a friend” → copies prefilled invite text + link.

5. Minimal Moderation

Report button (store flagged content).

No full moderation dashboard yet, just DB entry.

API (minimal endpoints)

POST /prompts — create prompt.

GET /prompts — list prompts (filters: community_id, sort).

GET /prompts/:id — prompt detail.

POST /prompts/:id/responses — add text/poll response.

POST /responses/:id/upvote — toggle upvote.

POST /reports — flag content.

Data Model (Prisma schema)

User: id, name, email, avatar_url, auth_provider.

Community: id, name, slug.

Prompt: id, community_id, author_id, title, body, type (text|poll), created_at.

PollOption: id, prompt_id, text, vote_count.

Response: id, prompt_id, author_id, text, upvotes_count, created_at.

Upvote: id, user_id, response_id.

Report: id, resource_type, resource_id, reporter_id, reason.

Engineering Practices

TypeScript strict mode.

ESLint + Prettier.

Unit tests with Jest (backend).

Simple Playwright smoke test (frontend: create prompt → respond → upvote).

GitHub Actions CI (run lint + tests, then deploy to Vercel/Render).

README with setup steps.

Deliverables

Repo structure

/frontend (React app)

/backend (Express API + Prisma)

Dockerfiles for frontend & backend (optional, only if helpful for local dev).

Prisma schema + migrations.

Firebase Auth integration (with example Google login flow).

Minimal CI/CD workflow YAML.

README with setup instructions.

OpenAPI spec (basic) for backend endpoints.

Sample seed script (community + sample users).

Output Now

Scaffold repo structure.

Show minimal working backend (Express + Prisma + /prompts endpoint).

Show minimal frontend (React + Vite + Tailwind + “create prompt” form + fetch prompts).

GitHub Actions workflow for lint + test + deploy.

Keep it minimal and working — not over-engineered. The goal is to get a demo in front of real users quickly while keeping the codebase clean and extensible.

The prisma seed script will be given later.

=== Developement Version 2.0 ===
Project: Community Sharing & Engagement Platform

Objective:
Design a playful, social-first platform where users can share their favorite places, food stalls, quotes, or nostalgic memories (e.g., a teacher’s quote) and let the community engage through likes, upvotes, or polls. The platform should feel fun, viral, and easy to contribute to — like a cross between Polymarket (for polls/upvotes) and NUSWhispers (for community sharing), but targeted at smaller groups (e.g., high school friends, alumni batches).

Key Features to Design:

Prompt/Question Component

A card or widget that initiates a new topic/question (e.g., “What’s your favorite late-night food stall near campus?”).

Should encourage quick participation with playful design.

User Response Component

Two modes:

Text Response → visible to community, upvotable.

Poll Response → options shown with results displayed dynamically.

Responses should be sharable and have clear engagement (likes/upvotes).

Community Feed

Displays ongoing prompts and responses.

Infinite scroll, cards style.

Ability to reshare or boost (to drive virality, like the ice bucket challenge).

Engagement & Viral Triggers

Upvote/like animations (playful micro-interactions).

Share to external platforms (WhatsApp, IG stories).

“Challenge a friend” feature to keep the loop viral.

Playful Theme & Aesthetic

Inspired by: Shopify Draggable
 → light, bouncy, draggable interactions.

Bright colors, rounded cards, floating elements.

Gamified feel: badges, streaks, playful transitions.

Pages/Flows Needed:

Landing / Community Feed

Create Prompt Flow

Respond to Prompt (text or poll)

Share/Challenge Flow

Profile or My Contributions

Mood & Tone:

Playful, nostalgic, energetic.

Not corporate; feels like a group of friends keeping a memory book alive.

Animations/micro-interactions matter (draggable, bouncy, sticky notes feel).

* Users can create their own community e.g CHIJ Class of 2015 and use thread-like feature as UI to keep content engaging

=== Developement Version 2.1 ===

We’ve already built the first version of our community-sharing platform (React frontend + Node/Express backend + Prisma/Postgres). Now I need you to tidy up the features and adjust the UX.

Tasks

Community thread visibility

After a user submits a new prompt (currently via the “Create Prompt” form), the community thread should automatically update to show the newly created post inline under the correct community.

Implement real-time optimistic updates in the frontend feed (so the post appears instantly, even before backend confirmation).

Rename “Create Prompt”

Change the wording to something more engaging and intuitive, e.g. “Start a Thread” or “Ask the Community” (please recommend the best option).

Ensure this updated label appears consistently in buttons, modals, and forms.

Community threads display

Each community should show a chronological list of threads/prompts underneath it.

Structure:

Community card → Title

Threads listed (latest first) with upvote + response count.

Clicking a thread expands to show responses.

Implementation details

Frontend: React + Tailwind + Framer Motion (playful animation when new thread appears).

Backend: Update GET /communities/:id to include associated prompts + responses in the payload.

Database: Ensure Prompt has communityId relation.

Add tests for the new endpoint and the thread rendering.

Deliverables

Updated backend route with populated threads under each community.

Updated frontend components so a new thread appears immediately under its community.

Consistent label change from “Create Prompt” → new name.

Small animation when threads are added.

Git diff (or full file outputs) showing the changes.

=== Development 2.1 === 
Now, refine the platform with the following fixes and enhancements.

Fixes

Like button

Ensure the like/upvote button works reliably.

Handle toggle state correctly (liked/unliked).

Persist state via API → update DB.

Animate the like (e.g., heart pop / confetti burst).

Card component sizing

Currently, when a user clicks “Challenge Friend” (share modal), the modal appears cramped inside the card component.

Redesign so the share modal opens cleanly (e.g., center screen modal or bottom drawer) instead of embedded in the card.

Ensure card height remains compact and consistent in feed.

UI/UX Suggestions (sharing + engagement)

Move share buttons (WhatsApp, Telegram, Copy Link) into a clear, dedicated modal with playful icons.

Show like + share counts below each card.

Add subtle animations (fade-in, slide-up) when modals open.

Improve hierarchy in card layout:

Title → prompt body → community info → engagement buttons (like, share, comment).

New Feature — Thread-like replies

Allow each post/prompt to have threaded comments (like Twitter replies).

Structure:

Post card → main content.

Below: “Reply” button → opens inline input field.

Replies displayed in collapsible thread view under the post.

Backend: Add Thread model (or reuse Response with parentId for nesting).

Show thread count on the card (e.g., “View 4 replies”).

To-Do List

Fix like button (toggle + persist + animation).

Redesign share modal → center-screen modal or drawer.

Update card sizing/layout for readability.

Add share buttons (WhatsApp, Telegram, Copy Link) with counters.

Show like + share counts under each card.

Implement thread-like replies (nested responses).

Add “View thread” toggle under each card.

Backend: extend schema (Response with parentId) and update API routes.

Frontend: update feed to show nested replies.

Add tests for like toggle, share modal, and thread replies.