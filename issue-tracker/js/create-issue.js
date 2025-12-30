import { db, auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
    addDoc,
    collection,
    query,
    where,
    getDocs,
    serverTimestamp,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Initialize Page
window.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    let projectId = urlParams.get('projectId');

    // Robust Fallback
    if (!projectId) {
        projectId = localStorage.getItem('currentProjectId');
        // If we recovered it, update URL for consistency
        if (projectId) {
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.set('projectId', projectId);
            window.history.replaceState({}, '', newUrl);
        }
    }

    if (projectId) {
        document.getElementById("project-banner").classList.remove("hidden");
        document.getElementById("back-link").href = `project-details.html?id=${projectId}`;
        document.getElementById("back-link").innerHTML = `<span class="material-symbols-outlined text-[18px] mr-1">arrow_back</span>Back to Project`;

        try {
            // We need to wait for auth to be ready to read if rules are strict, 
            // but for UI responsiveness we start fast. 
            // Better pattern: wait for onAuthStateChanged in separate block if needed.
            // For now, assume public read or rely on auth state from firebase.js if already initialized.
            // Actually, best to fetch inside onAuthStateChanged or catch error.
            onAuthStateChanged(auth, async user => {
                if (user) {
                    const docSnap = await getDoc(doc(db, "projects", projectId));
                    if (docSnap.exists()) {
                        document.getElementById("project-name-display").innerText = docSnap.data().name;
                    } else {
                        document.getElementById("project-name-display").innerText = "Unknown Project (ID Invalid)";
                    }
                }
            });
        } catch (e) {
            console.error("Error fetching project details:", e);
        }
    }
});

window.createIssue = async () => {
    try {
        const title = document.getElementById("title").value;
        const desc = document.getElementById("desc").value;
        const priority = document.getElementById("priority").value;
        const status = document.getElementById("status").value;
        const assignedTo = document.getElementById("assigned").value;

        const keywords = title.toLowerCase().split(" ");

        const q = query(
            collection(db, "issues"),
            where("searchKeywords", "array-contains-any", keywords)
        );

        const snap = await getDocs(q);
        if (!snap.empty) {
            if (!confirm("Similar issues exist. Continue?")) return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('projectId');

        console.log("Creating issue for Project ID:", projectId);

        await addDoc(collection(db, "issues"), {
            title,
            description: desc,
            priority,
            status,
            assignedTo,
            createdBy: auth.currentUser.email,
            createdAt: serverTimestamp(),
            searchKeywords: keywords,
            projectId: projectId || null // Start linking issues to projects
        });

        alert("Issue Created");
        if (projectId) {
            location.href = `project-details.html?id=${projectId}`;
        } else {
            location.href = "dashboard.html";
        }
    } catch (e) {
        console.error("Error creating issue:", e);
        alert("Failed to create issue: " + e.message);
    }
};
