### 1. Why did you choose the frontend stack you used?

I chose HTML, Tailwind CSS, and vanilla JavaScript because they are lightweight, fast, and easy to maintain without unnecessary complexity. This stack allowed me to focus on core functionality and user experience instead of framework overhead. Tailwind CSS helped me build a consistent, responsive UI quickly, while vanilla JavaScript gave me full control over authentication, form handling, and Firestore interactions. Since the application is frontend-only and deployed on Vercel, this stack fits the project perfectly.

---

### 2. Explain your Firestore data structure

Firestore is organized into simple, flat collections to keep queries efficient and the structure easy to extend. The main collections are `users` and `issues`. User documents store basic profile information and creation timestamps. Issue documents store the issue title, description, status, priority, creator ID, timestamps, and extracted keywords. This structure avoids deep nesting, supports filtering and sorting, and can easily be extended later with comments, assignments, or activity history.

---

### 3. Explain how you handled similar issues

When a user creates a new issue, the system checks existing issues for similarity by comparing keywords extracted from the title and description. If overlapping keywords are found, related issues are shown to the user before submission. This helps prevent duplicate issues and encourages users to reuse existing solutions. The approach is intentionally simple and runs entirely on the frontend to keep the application fast and backend-free.

---

### 4. Mention what was confusing or challenging

The most challenging parts were configuring Firebase Authentication correctly, especially password reset and email behavior, and understanding Firestore security rules. Deploying a pure static project on Vercel without a traditional build step was also confusing at first. Managing environment variables securely in a frontend-only setup required careful handling to avoid exposing sensitive information.

---

### 5. Mention what you would improve next

Next, I would improve the similarity detection logic using more advanced text analysis techniques, add role-based access control, and introduce comments and activity tracking for issues. I would also replace basic alerts with better UI feedback and add analytics to understand how users interact with the system.

