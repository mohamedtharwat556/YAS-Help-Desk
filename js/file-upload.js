/* ============================================================
   YAS Help Desk — File Upload System
   Real file upload handling with base64 encoding for localStorage
   ============================================================ */

'use strict';

const YAS_FILE_UPLOAD_KEY = 'yas_uploaded_files';

/* ── File Storage ─────────────────────────────────────────────── */
function getAllUploadedFiles() {
  try {
    return JSON.parse(localStorage.getItem(YAS_FILE_UPLOAD_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveUploadedFile(fileData) {
  const files = getAllUploadedFiles();
  files.push(fileData);
  localStorage.setItem(YAS_FILE_UPLOAD_KEY, JSON.stringify(files));
  return fileData;
}

function deleteUploadedFile(fileId) {
  const files = getAllUploadedFiles().filter(f => f.id !== fileId);
  localStorage.setItem(YAS_FILE_UPLOAD_KEY, JSON.stringify(files));
}

/* ── File Processing ───────────────────────────────────────────── */
async function processFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const base64 = e.target.result;
      const fileData = {
        id: 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        sizeFormatted: formatFileSize(file.size),
        data: base64,
        uploadedAt: new Date().toISOString()
      };
      resolve(fileData);
    };
    
    reader.onerror = () => reject(new Error('فشل في قراءة الملف'));
    reader.readAsDataURL(file);
  });
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/* ── File Validation ──────────────────────────────────────────── */
function validateFile(file) {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'حجم الملف كبير جداً. الحد الأقصى 10MB'
    };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'نوع الملف غير مدعوم. الأنواع المدعومة: PNG, JPG, PDF, DOC, DOCX'
    };
  }
  
  return { valid: true };
}

/* ── File Upload UI ─────────────────────────────────────────── */
function initFileUpload(containerId, inputId, listId, options = {}) {
  const container = document.getElementById(containerId);
  const input = document.getElementById(inputId);
  const list = document.getElementById(listId);
  
  if (!container || !input || !list) return;
  
  const maxFiles = options.maxFiles || 5;
  const maxSize = options.maxSize || 10 * 1024 * 1024;
  let uploadedFiles = [];
  
  // Drag and drop
  container.addEventListener('dragover', (e) => {
    e.preventDefault();
    container.classList.add('drag-over');
  });
  
  container.addEventListener('dragleave', () => {
    container.classList.remove('drag-over');
  });
  
  container.addEventListener('drop', (e) => {
    e.preventDefault();
    container.classList.remove('drag-over');
    handleFiles(e.dataTransfer.files);
  });
  
  // Click to upload
  container.addEventListener('click', () => {
    input.click();
  });
  
  input.addEventListener('change', () => {
    handleFiles(input.files);
  });
  
  async function handleFiles(files) {
    if (uploadedFiles.length + files.length > maxFiles) {
      YAS.showToast(`يمكنك رفع حد أقصى ${maxFiles} ملفات`, 'error');
      return;
    }
    
    for (const file of files) {
      const validation = validateFile(file);
      if (!validation.valid) {
        YAS.showToast(validation.error, 'error');
        continue;
      }
      
      try {
        // Show loading state
        const tempId = 'temp_' + Date.now();
        addFileToList(tempId, file.name, formatFileSize(file.size), true);
        
        const fileData = await processFile(file);
        saveUploadedFile(fileData);
        uploadedFiles.push(fileData);
        
        // Update UI
        removeFileFromList(tempId);
        addFileToList(fileData.id, fileData.name, fileData.sizeFormatted, false, fileData.type);
        
        YAS.showToast('تم رفع الملف بنجاح', 'success');
      } catch (error) {
        YAS.showToast('فشل في رفع الملف', 'error');
        console.error(error);
      }
    }
  }
  
  function addFileToList(id, name, size, loading = false, type = '') {
    const item = document.createElement('div');
    item.className = 'file-item';
    item.id = 'file-' + id;
    
    let icon = getFileIcon(type);
    if (loading) icon = '<div class="loading-spinner"></div>';
    
    item.innerHTML = `
      <div class="file-item-icon">${icon}</div>
      <div class="file-item-info">
        <div class="file-item-name">${name}</div>
        <div class="file-item-size">${size}</div>
      </div>
      ${!loading ? `
        <button class="file-item-remove" data-file-id="${id}" aria-label="حذف الملف">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      ` : ''}
    `;
    
    list.appendChild(item);
    
    // Add remove handler
    if (!loading) {
      item.querySelector('.file-item-remove').addEventListener('click', (e) => {
        e.stopPropagation();
        removeFile(id);
      });
    }
  }
  
  function removeFileFromList(id) {
    const item = document.getElementById('file-' + id);
    if (item) item.remove();
  }
  
  function removeFile(id) {
    uploadedFiles = uploadedFiles.filter(f => f.id !== id);
    deleteUploadedFile(id);
    removeFileFromList(id);
    YAS.showToast('تم حذف الملف', 'success');
  }
  
  function getFileIcon(type) {
    if (type.startsWith('image/')) {
      return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
    } else if (type === 'application/pdf') {
      return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>';
    } else {
      return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>';
    }
  }
  
  // Return uploaded files
  return {
    getFiles: () => uploadedFiles,
    clearFiles: () => {
      uploadedFiles = [];
      list.innerHTML = '';
    }
  };
}

/* ── File Display in Ticket Details ───────────────────────────── */
function displayAttachedFiles(containerId, fileIds) {
  const container = document.getElementById(containerId);
  if (!container || !fileIds || fileIds.length === 0) return;
  
  const allFiles = getAllUploadedFiles();
  const files = allFiles.filter(f => fileIds.includes(f.id));
  
  if (files.length === 0) return;
  
  container.innerHTML = `
    <div class="attached-files-section">
      <h4 style="margin-bottom: var(--space-3); font-size: 0.9375rem;">الملفات المرفقة</h4>
      <div class="attached-files-grid">
        ${files.map(file => `
          <div class="attached-file-card">
            <div class="attached-file-preview">
              ${file.type.startsWith('image/') 
                ? `<img src="${file.data}" alt="${file.name}" class="file-image-preview" onclick="viewFile('${file.id}')">`
                : getFileIconSVG(file.type)
              }
            </div>
            <div class="attached-file-info">
              <div class="attached-file-name" title="${file.name}">${file.name}</div>
              <div class="attached-file-size">${file.sizeFormatted}</div>
            </div>
            <div class="attached-file-actions">
              <button class="icon-btn btn-sm" onclick="downloadFile('${file.id}')" title="تحميل">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </button>
              ${file.type.startsWith('image/') ? `
                <button class="icon-btn btn-sm" onclick="viewFile('${file.id}')" title="عرض">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function getFileIconSVG(type) {
  if (type === 'application/pdf') {
    return '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>';
  }
  return '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>';
}

/* ── File Download ───────────────────────────────────────────── */
function downloadFile(fileId) {
  const allFiles = getAllUploadedFiles();
  const file = allFiles.find(f => f.id === fileId);
  
  if (!file) {
    YAS.showToast('الملف غير موجود', 'error');
    return;
  }
  
  const link = document.createElement('a');
  link.href = file.data;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/* ── File Viewer Modal ───────────────────────────────────────── */
function viewFile(fileId) {
  const allFiles = getAllUploadedFiles();
  const file = allFiles.find(f => f.id === fileId);
  
  if (!file || !file.type.startsWith('image/')) {
    YAS.showToast('لا يمكن عرض هذا الملف', 'error');
    return;
  }
  
  // Create modal
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.id = 'file-viewer-modal';
  modal.innerHTML = `
    <div class="modal file-viewer-modal">
      <div class="modal-header">
        <h3 class="modal-title">${file.name}</h3>
        <button class="modal-close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body" style="display: flex; justify-content: center; align-items: center; background: #000;">
        <img src="${file.data}" alt="${file.name}" style="max-width: 100%; max-height: 70vh; object-fit: contain;">
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary modal-close">إغلاق</button>
        <button class="btn btn-primary" onclick="downloadFile('${fileId}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          تحميل
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Close handlers
  modal.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

/* ── CSS for File Upload ─────────────────────────────────────── */
const fileUploadCSS = `
.drag-over {
  border-color: var(--primary) !important;
  background: var(--primary-light) !important;
}

.file-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--surface-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-2);
  animation: slideIn 0.3s ease;
}

.file-item-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface);
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  flex-shrink: 0;
}

.file-item-info {
  flex: 1;
  min-width: 0;
}

.file-item-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-item-size {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 2px;
}

.file-item-remove {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--danger-light);
  border: none;
  border-radius: var(--radius-sm);
  color: var(--danger);
  cursor: pointer;
  transition: all 0.2s;
}

.file-item-remove:hover {
  background: var(--danger);
  color: white;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Attached Files Section */
.attached-files-section {
  margin-top: var(--space-5);
  padding: var(--space-4);
  background: var(--surface-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}

.attached-files-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-3);
}

.attached-file-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-3);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  transition: all 0.2s;
}

.attached-file-card:hover {
  border-color: var(--primary);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.attached-file-preview {
  width: 100%;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-secondary);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.file-image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
}

.attached-file-info {
  flex: 1;
  min-width: 0;
}

.attached-file-name {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.attached-file-size {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.attached-file-actions {
  display: flex;
  gap: var(--space-2);
  justify-content: flex-end;
}

/* File Viewer Modal */
.file-viewer-modal {
  max-width: 90vw;
  max-height: 90vh;
}

.file-viewer-modal .modal-body {
  padding: 0;
  border-radius: var(--radius-lg);
}
`;

// Inject CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = fileUploadCSS;
document.head.appendChild(styleSheet);

/* ── Global Functions ─────────────────────────────────────────── */
window.YASFileUpload = {
  init: initFileUpload,
  displayFiles: displayAttachedFiles,
  download: downloadFile,
  view: viewFile,
  getAll: getAllUploadedFiles,
  save: saveUploadedFile,
  delete: deleteUploadedFile
};
