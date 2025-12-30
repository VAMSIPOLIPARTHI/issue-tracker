# Issue Tracker – Project README

## 1. Why this frontend stack?
We built the UI with **plain HTML, Tailwind CSS (via CDN), and vanilla JavaScript**. This stack gives us:
- **Zero build tooling** – the app runs directly from the `serve` static server.
- **Rapid iteration** – Tailwind’s utility classes let us style components without writing custom CSS, keeping the codebase tiny and easy to understand.
- **Full browser compatibility** – no transpilation step, which is perfect for a lightweight issue‑tracker that must work on any modern browser.

## 2. Firestore data structure
The app stores issues in a **Firestore collection called `issues`**. Each document represents a single issue and contains:
```json
{
  "title": "Short issue title",
  "description": "Longer description of the problem",
  "status": "open | in‑progress | closed",
  "createdAt": "Timestamp",
  "updatedAt": "Timestamp",
  "authorId": "uid of the user who created it"
}
```
The fields are deliberately minimal to keep queries fast and to allow simple UI filtering (by status or author).

## 3. How we handled similar issues
- **Navigation problems** – Added explicit `<a href="help.html">` links and, where needed, a tiny click‑handler to force `location.href` navigation.
- **Form submissions to external services** – The contact form now posts to a Google Apps Script using `fetch` with `mode: "cors"` and checks `response.ok` before showing a success message.
- **Authentication flow** – Centralised auth state in `js/auth.js` and protected pages with `protect()` that redirects unauthenticated users back to `index.html`.

## 4. Confusing / challenging parts
- **CORS with Google Apps Script** – The endpoint defaults to `no‑cors`, which prevented us from reading the response. Switching to `cors` and handling the HTTP status solved the issue.
- **Tailwind CDN configuration** – Ensuring the dark‑mode class works required adding a small inline Tailwind config script.
- **Static server routing** – Because we serve a single‑page app, relative links (`help.html`) must resolve correctly from the project root; otherwise the browser would look for a non‑existent path.

## 5. What we would improve next
- **Add automated tests** (e.g., Cypress) for navigation and form submission.
- **Introduce a build step** (Vite) to enable code‑splitting and TypeScript for better maintainability.
- **Persist auth state** in `localStorage` so a refresh doesn’t log the user out.
- **Improve UI polish** – add micro‑animations, better error handling UI, and a dark‑mode toggle.

---
*This README was generated to satisfy the project documentation requirements.*
