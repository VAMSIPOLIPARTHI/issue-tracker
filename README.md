Below is a **clean, professional README section** you can **directly paste** into your project’s `README.md`.
It’s written in a way that **interviewers, evaluators, and recruiters** like 👍
Clear, honest, and technical—but not overcomplicated.

---

# 📘 Project Design & Decisions

## 1. Why did you choose the frontend stack you used?

I chose a **pure HTML, Tailwind CSS, and vanilla JavaScript** stack for this project to keep the application lightweight, fast, and framework-independent.

* **HTML** provides a simple and semantic structure for a multi-page application.
* **Tailwind CSS** allows rapid UI development with consistent styling and built-in dark mode support without writing large custom CSS files.
* **Vanilla JavaScript** was used to maintain full control over application logic, avoid framework overhead, and better understand authentication and data flow.

This stack is ideal for small-to-medium applications and works seamlessly with **Firebase** and **Vercel** for frontend-only deployments.

---

## 2. Explain your Firestore data structure

The Firestore database is structured to be simple, scalable, and easy to query.

### 🔹 Collections

#### `users`

```json
{
  "uid": "firebase_user_id",
  "name": "User Name",
  "email": "user@example.com",
  "createdAt": "timestamp"
}
```

#### `issues`

```json
{
  "title": "Login button not working",
  "description": "Clicking login does nothing",
  "status": "open",
  "priority": "high",
  "createdBy": "user_uid",
  "createdAt": "timestamp",
  "keywords": ["login", "button", "auth"]
}
```

This structure:

* Avoids deep nesting
* Enables fast filtering by status and priority
* Allows easy expansion for comments, assignments, or history

---

## 3. Explain how you handled similar issues

To reduce duplicate issue creation, a **basic similarity detection mechanism** was implemented during issue creation.

* The issue title and description are tokenized into keywords.
* Existing issues are scanned for overlapping keywords.
* Similar issues are shown to the user before submission.

This approach:

* Helps users discover existing solutions
* Prevents duplicate issues
* Keeps the issue list clean

The logic is intentionally lightweight to keep frontend performance fast without requiring a backend or ML model.

---

## 4. What was confusing or challenging?

Some of the main challenges faced during development were:

* Configuring Firebase Authentication correctly, especially password reset and email handling.
* Understanding Firestore security rules and ensuring only authenticated users could access data.
* Deploying a pure static site on Vercel without a traditional build output directory.
* Managing environment variables securely in a frontend-only deployment.

These challenges helped deepen my understanding of real-world deployment and cloud service configuration.

---

## 5. What would you improve next?

Given more time, the following improvements would be implemented:

* Add role-based access control (admin vs user).
* Improve similar issue detection using TF-IDF or basic NLP techniques.
* Add comments and activity history for issues.
* Implement better UI feedback using toast notifications instead of alerts.
* Add analytics and usage insights for administrators.

---

The live version of the project is available at https://issue-tracker-flax-two.vercel.app/
