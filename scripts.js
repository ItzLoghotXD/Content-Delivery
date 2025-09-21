if (window.__cd_loaded) {
  console.warn("scripts.js: already loaded");
} else {
  window.__cd_loaded = true;

  
  const skipFiles = [
    "index.html",
  ];

  // File type mappings and icons
  const fileTypes = {
    // Images
    'jpg': { type: 'image', icon: '🖼️' },
    'jpeg': { type: 'image', icon: '🖼️' },
    'png': { type: 'image', icon: '🖼️' },
    'gif': { type: 'image', icon: '🖼️' },
    'webp': { type: 'image', icon: '🖼️' },
    'svg': { type: 'image', icon: '🎨' },
    'ico': { type: 'image', icon: '🖼️' },
    
    // Videos
    'mp4': { type: 'video', icon: '🎬' },
    'avi': { type: 'video', icon: '🎬' },
    'mkv': { type: 'video', icon: '🎬' },
    'mov': { type: 'video', icon: '🎬' },
    'wmv': { type: 'video', icon: '🎬' },
    'flv': { type: 'video', icon: '🎬' },
    'webm': { type: 'video', icon: '🎬' },
    
    // Audio
    'mp3': { type: 'audio', icon: '🎵' },
    'wav': { type: 'audio', icon: '🎵' },
    'flac': { type: 'audio', icon: '🎵' },
    'ogg': { type: 'audio', icon: '🎵' },
    'aac': { type: 'audio', icon: '🎵' },
    'm4a': { type: 'audio', icon: '🎵' },
    
    // Code files
    'js': { type: 'code', icon: '⚡' },
    'ts': { type: 'code', icon: '⚡' },
    'html': { type: 'code', icon: '🌐' },
    'css': { type: 'code', icon: '🎨' },
    'json': { type: 'code', icon: '📋' },
    'xml': { type: 'code', icon: '📋' },
    'py': { type: 'code', icon: '🐍' },
    'java': { type: 'code', icon: '☕' },
    'cpp': { type: 'code', icon: '⚙️' },
    'c': { type: 'code', icon: '⚙️' },
    'php': { type: 'code', icon: '🐘' },
    'rb': { type: 'code', icon: '💎' },
    'go': { type: 'code', icon: '🐹' },
    'rs': { type: 'code', icon: '🦀' },
    'sh': { type: 'code', icon: '💻' },
    'sql': { type: 'code', icon: '🗃️' },
    
    // Documents
    'pdf': { type: 'document', icon: '📄' },
    'doc': { type: 'document', icon: '📝' },
    'docx': { type: 'document', icon: '📝' },
    'txt': { type: 'document', icon: '📄' },
    'md': { type: 'document', icon: '📋' },
    'rtf': { type: 'document', icon: '📝' },
    'odt': { type: 'document', icon: '📝' },
    
    // Archives
    'zip': { type: 'archive', icon: '📦' },
    'rar': { type: 'archive', icon: '📦' },
    '7z': { type: 'archive', icon: '📦' },
    'tar': { type: 'archive', icon: '📦' },
    'gz': { type: 'archive', icon: '📦' },
    'bz2': { type: 'archive', icon: '📦' },
    
    // Default
    'default': { type: 'file', icon: '📄' }
  };

  // Get file info
  function getFileInfo(filename) {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    return fileTypes[ext] || fileTypes.default;
  }

  // Format file size
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  // Create breadcrumb navigation
  function createBreadcrumb(currentPath) {
    const breadcrumb = document.getElementById('breadcrumb');
    if (!breadcrumb) return;

    const parts = currentPath.split('/').filter(part => part);
    let breadcrumbHTML = '<a href="/" class="breadcrumb-item">~</a>';

    let path = '';
    parts.forEach((part, index) => {
      path += '/' + part;
      breadcrumbHTML += '<span class="breadcrumb-separator">/</span>';
      if (index === parts.length - 1) {
        breadcrumbHTML += `<span class="breadcrumb-current">${part}</span>`;
      } else {
        breadcrumbHTML += `<a href="${path}/" class="breadcrumb-item">${part}</a>`;
      }
    });

    breadcrumb.innerHTML = breadcrumbHTML;
  }

  // Search functionality
  function initSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', function(e) {
      const query = e.target.value.toLowerCase();
      const fileItems = document.querySelectorAll('.file-item');

      fileItems.forEach(item => {
        const fileName = item.querySelector('.file-name');
        if (!fileName) return;

        const originalText = fileName.dataset.original || fileName.textContent;
        fileName.dataset.original = originalText;

        if (query === '') {
          fileName.innerHTML = originalText;
          item.style.display = '';
        } else {
          const lowerText = originalText.toLowerCase();
          if (lowerText.includes(query)) {
            const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
            fileName.innerHTML = originalText.replace(regex, '<span class="search-highlight">$1</span>');
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        }
      });

      updateFileStats();
    });
  }

  // Update file statistics
  function updateFileStats() {
    const fileStats = document.getElementById('file-stats');
    if (!fileStats) return;

    const fileItems = document.querySelectorAll('.file-item:not(.parent-dir)');
    const visibleItems = document.querySelectorAll('.file-item:not(.parent-dir):not([style*="display: none"])');
    const directories = document.querySelectorAll('.file-item.directory:not([style*="display: none"])').length;
    const files = visibleItems.length - directories;

    let statsText = '';
    if (visibleItems.length !== fileItems.length) {
      statsText = `${files} files, ${directories} folders (${visibleItems.length}/${fileItems.length} shown)`;
    } else {
      statsText = `${files} files, ${directories} folders`;
    }

    fileStats.textContent = statsText;
  }

  // File list creation
  function createFileList(files, currentPath, container) {
    const ul = document.createElement('ul');
    ul.className = 'file-list';

    // Add parent directory link
    if (currentPath) {
      const li = document.createElement('li');
      li.className = 'file-item parent-dir';
      
      const link = document.createElement('a');
      link.href = '../';
      link.className = 'file-link';
      
      link.innerHTML = `
        <div class="file-icon">📁</div>
        <div class="file-info">
          <div class="file-name">(parent directory)</div>
        </div>
      `;
      
      li.appendChild(link);
      ul.appendChild(li);
    }

    // Sort files: directories first, then by name
    files.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;
      return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
    });

    // Create file items
    files.forEach(file => {

      if (file.type !== 'dir') {
        if (skipFiles.includes(file.name)) return;
      }
      
      const li = document.createElement('li');
      const fileInfo = getFileInfo(file.name);
      
      li.className = `file-item ${file.type === 'dir' ? 'directory' : fileInfo.type}`;
      
      const link = document.createElement('a');
      link.className = 'file-link';
      
      if (file.type === 'dir') {
        link.href = encodeURI(file.name) + '/';
      } else {
        link.href = encodeURI(file.name);
      }

      const icon = file.type === 'dir' ? '📁' : fileInfo.icon;
      const fileName = file.type === 'dir' ? file.name + '/' : file.name;
      
      let fileMetaHTML = '';
      if (file.size && file.type !== 'dir') {
        fileMetaHTML = `<div class="file-meta">Size: ${formatFileSize(file.size)}</div>`;
      }

      let actionsHTML = '';
      if (file.type !== 'dir') {
        const downloadUrl = file.download_url || link.href;
        const rawUrl = file.download_url || link.href;
        
        actionsHTML = `
          <div class="file-actions">
            <a href="${rawUrl}" class="action-btn raw" target="_blank">View Raw</a>
            <a href="${downloadUrl}" class="action-btn download" download>Download</a>
          </div>
        `;
      }

      link.innerHTML = `
        <div class="file-icon">${icon}</div>
        <div class="file-info">
          <div class="file-name">${fileName}</div>
          ${fileMetaHTML}
        </div>
        ${actionsHTML}
      `;

      // Prevent action buttons from triggering main link
      const actionBtns = link.querySelectorAll('.action-btn');
      actionBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          e.preventDefault();
          
          if (this.classList.contains('download')) {
            // Force download using fetch and blob
            fetch(this.href)
              .then(response => response.blob())
              .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const tempLink = document.createElement('a');
                tempLink.href = url;
                tempLink.download = file.name;
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
                window.URL.revokeObjectURL(url);
              })
              .catch(err => {
                console.error('Download failed:', err);
                // Fallback to direct download
                const tempLink = document.createElement('a');
                tempLink.href = this.href;
                tempLink.download = file.name;
                tempLink.target = '_blank';
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
              });
          } else {
            window.open(this.href, '_blank');
          }
        });
      });

      li.appendChild(link);
      ul.appendChild(li);
    });

    container.appendChild(ul);
    
    // Initialize search and update stats
    setTimeout(() => {
      initSearch();
      updateFileStats();
    }, 100);
  }

  // Override the main function to use features
  const originalMain = window.main;
  
  // Main function
  (async function Main() {
    const container = document.getElementById("file-list");
    const heading = document.getElementById("heading");
    const titleEl = document.getElementById("title");

    if (container) container.innerHTML = '<div class="loading"><div class="loading-spinner"></div><div class="loading-text">Loading files...</div></div>';

    let pathname = window.location.pathname || "/";
    if (window.location.hostname !== `ItzLoghotXD.github.io`) {
      if (pathname === `/Content-Delivery` || pathname === `/Content-Delivery/`) {
        pathname = "/";
      } else if (pathname.startsWith(`/Content-Delivery/`)) {
        pathname = pathname.slice(`Content-Delivery`.length + 1);
      }
    }

    let currentPath = pathname.replace(/^\/+|\/+$/g, "");
    currentPath = currentPath.replace(/(?:index|404)\.html$/, "").replace(/\/+$/,"");

    // Update page title and heading
    const pathDisplay = currentPath || "";
    if (heading) heading.textContent = "Index of /" + pathDisplay;
    if (titleEl) titleEl.textContent = "Index of /" + pathDisplay + " | CDN";
    document.title = titleEl ? titleEl.textContent : document.title;

    // Create breadcrumb navigation
    createBreadcrumb(currentPath);

    const apiPath = encodeURIComponent(currentPath);
    const apiUrl = `https://api.github.com/repos/ItzLoghotXD/Content-Delivery/contents/${apiPath}?ref=main`;

    try {
      const res = await fetch(apiUrl);
      const files = await res.json();

      if (!Array.isArray(files)) {
        const msg = files && files.message ? files.message : "No files or unexpected response.";
        if (container) container.innerHTML = `<div class="error-message">Error: ${msg}</div>`;
        console.error("GitHub API response:", files);
        return;
      }

      if (container) container.innerHTML = "";

      // Use file list creation
      createFileList(files, currentPath, container);

    } catch (err) {
      console.error(err);
      if (container) container.innerHTML = '<div class="error-message">Error loading files (see console).</div>';
    }
  })();

  // Add keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const searchInput = document.getElementById('search-input');
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }
    
    // Escape to clear search
    if (e.key === 'Escape') {
      const searchInput = document.getElementById('search-input');
      if (searchInput && searchInput === document.activeElement) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        searchInput.blur();
      }
    }
  });

  // Add error message styles if not already defined
  if (!document.querySelector('style[data-error-styles]')) {
    const errorStyles = document.createElement('style');
    errorStyles.setAttribute('data-error-styles', 'true');
    errorStyles.textContent = `
      .error-message {
        padding: var(--spacing-xl);
        text-align: center;
        color: var(--accent-red);
        background: rgba(240, 113, 120, 0.1);
        border: 1px solid rgba(240, 113, 120, 0.3);
        border-radius: var(--border-radius);
        margin: var(--spacing-lg);
        font-family: 'JetBrains Mono', monospace;
      }
    `;
    document.head.appendChild(errorStyles);
  }
}