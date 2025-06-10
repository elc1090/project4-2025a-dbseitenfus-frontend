
const URL_BASE = "https://project3-2025a-dbseitenfus-backend.onrender.com/api";

function getApiToken() {
    return `Token ${localStorage.getItem("token")}`;
}

// Authentication
export async function login(username, password) {
    const res = await fetch(`${URL_BASE}/login/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
        throw new Error(`Login failed: ${res.statusText}`);
    }

    return res;
}

//User

export async function getAuthenticatedUser() {
    const res = await fetch(`${URL_BASE}/user/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getApiToken()
        }
    });
    return res.json();
}

export async function getUsers() {
    const res = await fetch(`${URL_BASE}/user/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getApiToken()
        },
    });
    return res.json();
}

export async function createUser(user) {
    const res = await fetch(`${URL_BASE}/register/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user),
    });
    return res;
}

export async function updateUser(user) {
    const res = await fetch(`${URL_BASE}/user/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getApiToken()
        },
        body: JSON.stringify(user),
    });
    return res.json();
}

export async function deleteUser(userId) {
    const res = await fetch(`${URL_BASE}/user/${userId}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getApiToken()
        },
        body: JSON.stringify(data),
    });
    return res.json();
}

// Document

export async function getDocuments() {
    const res = await fetch(`${URL_BASE}/documents/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getApiToken()
        }
    });

    const data = await res.json();
  
  return Array.isArray(data) ? data : []; 
}

export async function createDocument(document) {
    const res = await fetch(`${URL_BASE}/documents/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getApiToken()
        },
        body: JSON.stringify(document),
    });
    return res.json()
}

export async function getDocument(documentId) {
    const res = await fetch(`${URL_BASE}/documents/${documentId}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getApiToken()
        }
    });

    if (!res.ok) {
        console.log(`Error fetching document with ID ${documentId}: ${res.statusText}`);
    }

    return res.json();
}

export async function saveDocument(documentId, title, content, plain_text) {
    const res = await fetch(`${URL_BASE}/documents/${documentId}/save/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getApiToken()
        },
        body: JSON.stringify({
            title,
            content,
            plain_text
        })
    })

    return res.json();
}

export async function deleteDocument(documentId) {
    const res = await fetch(`${URL_BASE}/documents/${documentId}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getApiToken()
        }
    });

    if (!res.ok) {
        console.log(`Error deleting document with ID ${documentId}: ${res.statusText}`);
    }

    return res;
}