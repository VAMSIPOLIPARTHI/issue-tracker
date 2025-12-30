import { db, auth } from "./firebase.js";
import {
    collection,
    query,
    orderBy,
    getDocs,
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { timeAgo, priorityClass } from "./utils.js";

window.logout = async () => {
    try {
        await signOut(auth);
        location.href = "index.html";
    } catch (e) {
        console.error("Logout failed:", e);
    }
};

// Global state
let allIssues = [];

onAuthStateChanged(auth, async user => {
    if (!user) return (location.href = "index.html");
    console.log("Logged in as:", user.email, "UID:", user.uid);

    const userEl = document.getElementById("user");
    if (userEl) userEl.innerText = user.email;

    try {
        const q = query(collection(db, "issues"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);

        allIssues = [];
        snap.forEach(d => {
            allIssues.push({ id: d.id, ...d.data() });
        });

        window.renderIssues();

    } catch (e) {
        console.error("Error fetching issues:", e);
        const list = document.getElementById("issues");
        list.innerHTML = `
            <tr>
                <td colspan="6" class="px-4 py-8 text-center text-red-400">
                    <div class="flex flex-col items-center gap-2">
                        <span class="material-symbols-outlined text-3xl">gpp_maybe</span>
                        <span class="font-bold">Access Denied</span>
                        <span class="text-sm text-gray-400">Please update your Firestore Security Rules in the Firebase Console.</span>
                        <code class="mt-2 bg-gray-900 px-2 py-1 rounded text-xs select-all">allow read, write: if request.auth != null;</code>
                    </div>
                </td>
            </tr>
        `;
    }
});

window.renderIssues = () => {
    const statusFilter = document.getElementById("filter-status").value;
    const priorityFilter = document.getElementById("filter-priority").value;
    const sortOrder = document.getElementById("sort-order").value;

    let filtered = allIssues.filter(i => {
        if (statusFilter !== "All" && i.status !== statusFilter) return false;
        if (priorityFilter !== "All" && i.priority !== priorityFilter) return false;
        return true;
    });

    if (sortOrder === "newest") {
        filtered.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
    } else {
        filtered.sort((a, b) => a.createdAt?.seconds - b.createdAt?.seconds);
    }

    const list = document.getElementById("issues");
    list.innerHTML = "";

    if (filtered.length === 0) {
        list.innerHTML = `<tr><td colspan="6" class="px-4 py-8 text-center text-gray-500">No issues found</td></tr>`;
        return;
    }

    filtered.forEach(i => {
        const row = document.createElement("tr");
        row.className = "group hover:bg-border-dark/30 transition-colors cursor-pointer";

        // Status color helper
        let statusColor = "text-gray-400";
        let statusBg = "bg-gray-500/10";
        let statusIcon = "circle";

        if (i.status === "Open") { statusColor = "text-green-500"; statusBg = "bg-green-500/10"; statusIcon = "adjust"; }
        else if (i.status === "In Progress") { statusColor = "text-blue-500"; statusBg = "bg-blue-500/10"; statusIcon = "pending"; }
        else if (i.status === "Done") { statusColor = "text-purple-400"; statusBg = "bg-purple-500/10"; statusIcon = "check_circle"; }

        // Forward flow enforcement: Open -> Done is disabled
        const isDoneDisabled = i.status === 'Open' ? 'disabled' : '';

        row.innerHTML = `
            <td class="px-4 py-4 text-gray-500 font-mono">#${i.id.slice(0, 6)}</td>
            <td class="px-4 py-4">
                <div class="flex flex-col gap-1">
                    <span class="text-white font-medium group-hover:text-primary transition-colors">${i.title}</span>
                    <span class="text-gray-500 text-xs line-clamp-1">${i.description || 'No description'}</span>
                </div>
            </td>
            <td class="px-4 py-4">
                <span class="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${priorityClass(i.priority).replace("text-", "bg-").replace("500", "500/10").replace("400", "500/10")} ${priorityClass(i.priority)} ring-${priorityClass(i.priority).replace("text-", "").replace("500", "500/20").replace("400", "500/20")}">
                        ${i.priority}
                </span>
            </td>
            <td class="px-4 py-4">
                <select id="status-${i.id}" onclick="event.stopPropagation()" onchange="changeStatus('${i.id}', this.value, '${i.status}')" class="inline-flex items-center gap-1 rounded-md ${statusBg} px-2 py-1 text-xs font-medium ${statusColor} ring-1 ring-inset ring-white/10 hover:ring-white/30 transition-all">
                    <option value="Open" ${i.status === 'Open' ? 'selected' : ''}>Open</option>
                    <option value="In Progress" ${i.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                    <option value="Done" ${i.status === 'Done' ? 'selected' : ''} ${isDoneDisabled}>Done</option>
                </select>
            </td>
            <td class="px-4 py-4">
                <div class="flex items-center gap-2">
                    <div class="flex items-center justify-center bg-gray-700 text-gray-300 text-[10px] font-bold rounded-full size-6 ring-2 ring-background-dark">
                        ${i.assignedTo ? i.assignedTo.substring(0, 2).toUpperCase() : 'UN'}
                    </div>
                    <span class="text-gray-400 text-xs">${i.assignedTo || 'Unassigned'}</span>
                </div>
            </td>
            <td class="px-4 py-4 text-right">
                <div class="flex flex-col items-end">
                    <span class="text-gray-300">${timeAgo(i.createdAt)}</span>
                    <span class="text-gray-600 text-xs">by ${i.createdBy ? i.createdBy.split('@')[0] : 'Unknown'}</span>
                </div>
            </td>
        `;

        list.appendChild(row);
    });
};

window.changeStatus = async (id, newStatus, currentStatus) => {
    // Define status order
    const statusOrder = { 'Open': 1, 'In Progress': 2, 'Done': 3 };
    const currentOrder = statusOrder[currentStatus] || 0;
    const newOrder = statusOrder[newStatus] || 0;

    // Validation: Strict forward flow
    // 1. Prevent skipping steps (e.g. Open -> Done)
    if (currentStatus === 'Open' && newStatus === 'Done') {
        alert("Invalid transition: You must mark the issue as 'In Progress' before setting it to 'Done'.");
        location.reload();
        return;
    }

    // 2. Prevent backward movement
    if (newOrder < currentOrder) {
        alert(`Invalid transition: You cannot revert status from '${currentStatus}' to '${newStatus}'.`);
        location.reload();
        return;
    }

    try {
        await updateDoc(doc(db, "issues", id), { status: newStatus });
        location.reload();
    } catch (e) {
        console.error("Error updating issue status:", e);
        alert("Failed to update status: " + e.message);
    }
};
