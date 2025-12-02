const API_URL = '/api';

// --- Auth Helpers ---

async function checkAuth() {
    try {
        const res = await fetch(`${API_URL}/auth/me`);
        const data = await res.json();
        if (data.status === 'success') {
            return data.data.user;
        }
        return null;
    } catch (err) {
        return null;
    }
}

async function logout() {
    await fetch(`${API_URL}/auth/logout`, { method: 'POST' });
    window.location.href = '/auth/login.html';
}

// --- UI Helpers ---

function showAlert(type, message, containerId = 'alert-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.className = `alert alert-${type}`;
    container.textContent = message;
    container.style.display = 'block';

    setTimeout(() => {
        container.style.display = 'none';
    }, 5000);
}

function formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// --- File Operations ---

async function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_URL}/files/upload`, {
        method: 'POST',
        body: formData
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Upload failed');
    }

    return await res.json();
}

async function loadFiles() {
    const res = await fetch(`${API_URL}/files/list`);
    const data = await res.json();

    if (data.status === 'success') {
        renderFiles(data.data.files);
    }
}

function renderFiles(files) {
    const list = document.getElementById('file-list');
    if (!list) return;

    if (files.length === 0) {
        list.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 2rem;">No files uploaded yet.</div>';
        return;
    }

    list.innerHTML = files.map(file => `
    <div class="file-item">
      <div class="file-info">
        <div class="file-icon">
          ${getFileIcon(file.mime_type)}
        </div>
        <div class="file-meta">
          <span class="file-name">${file.file_name}</span>
          <span class="file-size">${formatSize(file.size)} • ${formatDate(file.created_at)}</span>
        </div>
      </div>
      <div class="file-actions">
        <button class="action-btn" onclick="previewFile('${file.id}', '${file.mime_type}')" title="Preview">
          👁️
        </button>
        <button class="action-btn" onclick="downloadFile('${file.id}')" title="Download">
          ⬇️
        </button>
        <button class="action-btn" onclick="deleteFile('${file.id}')" title="Delete" style="color: var(--error)">
          🗑️
        </button>
      </div>
    </div>
  `).join('');
}

function getFileIcon(mimeType) {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType === 'application/pdf') return '📄';
    return '📁';
}

async function deleteFile(id) {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
        const res = await fetch(`${API_URL}/files/delete/${id}`, { method: 'DELETE' });
        if (res.ok) {
            loadFiles(); // Refresh list
        } else {
            alert('Failed to delete file');
        }
    } catch (err) {
        console.error(err);
        alert('Error deleting file');
    }
}

async function downloadFile(id) {
    window.location.href = `${API_URL}/files/download/${id}`;
}

async function previewFile(id, mimeType) {
    const modal = document.getElementById('preview-modal');
    const content = document.getElementById('preview-content');

    content.innerHTML = '<div class="spinner" style="display:block; margin: 2rem auto;"></div>';
    modal.classList.add('active');

    try {
        const res = await fetch(`${API_URL}/files/preview/${id}`);
        if (!res.ok) throw new Error('Preview failed');

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        if (mimeType.startsWith('image/')) {
            content.innerHTML = `<img src="${url}" style="max-width: 100%; max-height: 80vh; border-radius: 8px;">`;
        } else if (mimeType === 'application/pdf') {
            content.innerHTML = `<iframe src="${url}" style="width: 100%; height: 80vh; border: none; border-radius: 8px;"></iframe>`;
        } else if (mimeType.startsWith('text/')) {
            const text = await blob.text();
            content.innerHTML = `<pre style="background: #0f172a; padding: 1rem; border-radius: 8px; overflow: auto; max-height: 80vh;">${text}</pre>`;
        } else {
            content.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
          <p>Preview not available for this file type.</p>
          <button class="btn btn-primary" onclick="downloadFile('${id}')" style="margin-top: 1rem;">Download to View</button>
        </div>
      `;
        }
    } catch (err) {
        content.innerHTML = `<p style="color: var(--error); text-align: center;">Error loading preview</p>`;
    }
}

// Close modal
document.addEventListener('click', (e) => {
    const modal = document.getElementById('preview-modal');
    if (e.target === modal || e.target.classList.contains('close-modal')) {
        if (modal) modal.classList.remove('active');
    }
});
