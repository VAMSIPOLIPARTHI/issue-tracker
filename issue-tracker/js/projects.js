import { db, auth } from "./firebase.js";
import {
    collection,
    addDoc,
    query,
    orderBy,
    getDocs,
    serverTimestamp,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { timeAgo } from "./utils.js";

// Auth Check & Load Projects
onAuthStateChanged(auth, async user => {
    if (!user) return (location.href = "index.html");
    document.getElementById("user").innerText = user.email;

    await loadProjects(user);
});

// Logout Helper
window.logout = async () => {
    await signOut(auth);
    location.href = "index.html";
};

// Create Project Logic
window.createProject = async () => {
    const name = document.getElementById("project-name").value;
    const desc = document.getElementById("project-desc").value;

    if (!name) return alert("Project name is required");

    try {
        await addDoc(collection(db, "projects"), {
            name: name,
            description: desc,
            createdBy: auth.currentUser.email,
            ownerId: auth.currentUser.uid,
            createdAt: serverTimestamp()
        });

        document.getElementById("create-project-modal").close();
        document.getElementById("project-name").value = "";
        document.getElementById("project-desc").value = "";

        // Reload list
        await loadProjects(auth.currentUser);

    } catch (e) {
        console.error("Error creating project:", e);
        alert("Failed to create project: " + e.message);
    }
};

window.deleteProject = async (id) => {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;

    try {
        await deleteDoc(doc(db, "projects", id));
        await loadProjects(auth.currentUser);
    } catch (e) {
        console.error("Error deleting project:", e);
        alert("Failed to delete project: " + e.message);
    }
}

window.openProject = (id) => {
    console.log("Opening project:", id);
    if (id) {
        localStorage.setItem('currentProjectId', id);
        window.location.href = `project-details.html?id=${id}`;
    } else {
        alert("Invalid Project ID");
    }
}

// Load Projects Logic
async function loadProjects(user) {
    const grid = document.getElementById("projects-grid");
    grid.innerHTML = '<p class="text-gray-500">Loading...</p>';

    try {
        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);

        grid.innerHTML = "";

        if (snap.empty) {
            grid.innerHTML = `
        <div class="col-span-full flex flex-col items-center justify-center p-8 border border-dashed border-border-dark rounded-xl bg-surface-dark/50">
            <span class="material-symbols-outlined text-gray-500 text-4xl mb-2">folder_off</span>
            <p class="text-gray-400 font-medium">No projects found</p>
            <p class="text-gray-500 text-sm mt-1">Create your first project to get started.</p>
        </div>
      `;
            return;
        }

        snap.forEach(d => {
            const p = d.data();
            const div = document.createElement("div");
            div.className = "bg-surface-dark border border-border-dark rounded-xl p-5 hover:border-primary/50 transition-colors group relative";

            div.innerHTML = `
        <div class="flex justify-between items-start mb-3" onclick="window.openProject('${d.id}')" style="cursor:pointer">
            <div class="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <span class="material-symbols-outlined">folder</span>
            </div>
        </div>
        <button onclick="event.stopPropagation(); window.deleteProject('${d.id}')" class="absolute top-5 right-5 text-gray-500 hover:text-red-500 transition-colors z-10 p-1">
            <span class="material-symbols-outlined text-[20px]">delete</span>
        </button>
        
        <div onclick="window.openProject('${d.id}')" style="cursor:pointer">
            <h3 class="text-white font-bold text-lg mb-1 group-hover:text-primary transition-colors">${p.name}</h3>
            <p class="text-gray-400 text-sm line-clamp-2 mb-4 h-10">${p.description || "No description provided."}</p>
            <div class="flex items-center justify-between pt-4 border-t border-border-dark">
                <span class="text-xs text-gray-500">Created ${timeAgo(p.createdAt)}</span>
                <div class="flex -space-x-2">
                    <div class="size-6 rounded-full bg-gray-700 border border-background-dark flex items-center justify-center text-[10px] text-white">
                        ${p.createdBy ? p.createdBy.substring(0, 2).toUpperCase() : 'ME'}
                    </div>
                </div>
            </div>
        </div>
      `;
            grid.appendChild(div);
        });

    } catch (e) {
        console.error("Error loading projects:", e);
        grid.innerHTML = `
        <div class="col-span-full p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center">
            <p class="font-bold">Error loading projects</p>
            <p class="text-xs mt-1">Please check your Firestore Security Rules.</p>
        </div>
    `;
    }
}
