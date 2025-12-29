# Issue Tracker

A modern, responsive issue tracking application built with vanilla JavaScript, Tailwind CSS, and Firebase.

## Features

### Core Functionality
- **Dashboard**: View all issues with sorting and filtering capabilities.
- **Project Management**: Create, delete, and manage multiple projects.
- **Issue Tracking**: Create issues with priorities, statuses, and assignees.
- **Project Context**: Issues created within a project are automatically linked to it.
- **Smart Assist**: Detects potential duplicate issues based on title similarity.

### Technical Highlights
- **Authentication**: Secure email/password login using Firebase Auth.
- **Real-time Database**: Data persistence using Cloud Firestore.
- **Responsive Design**: Fully responsive UI built with Tailwind CSS.
- **Robust Navigation**: Intuitive navigation flow between dashboard, projects, and issue creation.

## Setup Instructions

### 1. Prerequisites
- Node.js installed (for running the local server).
- A Firebase project created in the [Firebase Console](https://console.firebase.google.com/).

### 2. Installation
1.  Clone or download this repository.
2.  Install dependencies (if any specific build tools are added later, currently just static serving is needed).

### 3. Firebase Configuration
1.  Create a file named `js/firebase.js` (if not already present, use the template below).
2.  Replace the `firebaseConfig` object with your project's configuration from the Firebase Console Project Settings.

```javascript
// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
```

### 4. Firestore Security Rules
**CRITICAL**: You must set up Firestore Security Rules for the application to work.
1.  Go to **Firebase Console** -> **Firestore Database** -> **Rules**.
2.  Paste the following rules to allow read/write access for authenticated users:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
*(For development, you might temporarily use `allow read, write: if true;` but secure it before production).*

### 5. Running Locally
Run a local server to view the app (accessing the file system directly causes CORS issues with modules).

```bash
npx serve .
```
Open `http://localhost:3000` (or the port shown in terminal).

## Troubleshooting

### "Missing or insufficient permissions"
- This almost always means your Firestore Security Rules are not set up correctly. See Section 4 above.

### "Project ID missing"
- The application uses URL parameters to track projects. If you see this, try navigating back to the "Projects" page and clicking the project again.

### "The query requires an index"
- If you see an error about a missing index in the console, click the link provided in the error message to automatically create the required index in Firebase.

## Deployment

### Deploying to Vercel

1.  Push this code to a GitHub repository.
2.  Import the project into Vercel.
3.  **Environment Variables**: In the Vercel Project Settings, add the following variables (copy values from your Firebase Console):
    *   `FIREBASE_API_KEY`
    *   `FIREBASE_AUTH_DOMAIN`
    *   `FIREBASE_PROJECT_ID`
    *   `FIREBASE_STORAGE_BUCKET`
    *   `FIREBASE_MESSAGING_SENDER_ID`
    *   `FIREBASE_APP_ID`
4.  **Build Command**: Vercel should automatically detect `npm run build` (which runs `node generate-config.js`), or you can set the Build Command to `npm run build`.
5.  Deploy! The script will automatically generate the `js/config.js` file with your secrets during the build.

## Technology Stack
- **Frontend**: HTML5, Vanilla JavaScript (ES6 Modules)
- **Styling**: Tailwind CSS (via CDN)
- **Backend/DB**: Firebase Authentication, Cloud Firestore
- **Icons**: Google Material Symbols
- **Font**: Inter
