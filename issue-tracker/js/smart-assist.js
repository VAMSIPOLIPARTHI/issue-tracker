import { db } from "./firebase.js";
import {
    collection,
    query,
    where,
    getDocs,
    limit
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/**
 * Fetch similar issues based on title keywords
 * @param {string} title
 * @param {HTMLElement} container - sidebar DOM element
 */
export async function loadSimilarIssues(title, container) {
    container.innerHTML = "";

    if (!title || title.length < 3) {
        container.innerHTML = "<p class='text-sm text-gray-400'>Start typing to see suggestions</p>";
        return;
    }

    const keywords = title.toLowerCase().split(" ").slice(0, 5);

    const q = query(
        collection(db, "issues"),
        where("searchKeywords", "array-contains-any", keywords),
        limit(5)
    );

    const snap = await getDocs(q);

    if (snap.empty) {
        container.innerHTML = "<p class='text-sm text-gray-400'>No similar issues found</p>";
        return;
    }

    snap.forEach(doc => {
        const issue = doc.data();

        const div = document.createElement("div");
        div.className = "p-3 border-b border-gray-700 hover:bg-gray-800 cursor-pointer";

        div.innerHTML = `
      <p class="text-sm font-medium text-white">${issue.title}</p>
      <p class="text-xs text-gray-400">${issue.status} • ${issue.priority}</p>
    `;

        container.appendChild(div);
    });
}
