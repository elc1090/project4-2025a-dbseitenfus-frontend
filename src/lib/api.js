
const URL_BASE = "https://project4-2025a-dbseitenfus-backend.onrender.com/api";
// const URL_BASE = "https://project3-2025a-dbseitenfus-backend.onrender.com/api";

// Authentication
export async function login(email, password) {
    const res = await fetch(`${URL_BASE}/login/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        throw new Error(`Login failed: ${res.statusText}`);
    }

    return res;
}

//User

export async function getAuthenticatedUser(token) {
    const res = await fetch(`${URL_BASE}/user/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        }
    });
    return res.json();
}

export async function getUsers(token) {
    const res = await fetch(`${URL_BASE}/user/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
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

export async function updateUser(user, token) {
    const res = await fetch(`${URL_BASE}/user/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        },
        body: JSON.stringify(user),
    });
    return res.json();
}

export async function deleteUser(userId, token) {
    const res = await fetch(`${URL_BASE}/user/${userId}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        },
        body: JSON.stringify(data),
    });
    return res.json();
}

// Document

export async function getDocuments(token) {
    const res = await fetch(`${URL_BASE}/documents/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        }
    });

    if (!res.ok) {
        console.log(`Error fetching documents: ${res.statusText}`);
    }

    const data = await res.json();
  
  return Array.isArray(data) ? data : []; 
}

export async function createDocument(document, token) {
    const res = await fetch(`${URL_BASE}/documents/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        },
        body: JSON.stringify(document),
    });
    return res.json()
}

export async function getDocument(documentId, token) {
    const res = await fetch(`${URL_BASE}/documents/${documentId}/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        }
    });

    if (!res.ok) {
        console.log(`Error fetching document with ID ${documentId}: ${res.statusText}`);
    }

    return res.json();
}

export async function saveDocument(documentId, title, content, plain_text, token) {
    const res = await fetch(`${URL_BASE}/documents/${documentId}/save/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        },
        body: JSON.stringify({
            title,
            content,
            plain_text
        })
    })

    return res.json();
}

export async function deleteDocument(documentId, token) {
    const res = await fetch(`${URL_BASE}/documents/${documentId}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        }
    });

    if (!res.ok) {
        console.log(`Error deleting document with ID ${documentId}: ${res.statusText}`);
    }

    return res;
}

export async function tts(text, token) {
    const res = await fetch(`${URL_BASE}/tts/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ text }),
    });

    if (!res.ok) {
        throw new Error(`TTS request failed: ${res.statusText}`);
    }

    return res;
}