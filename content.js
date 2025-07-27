// Wait for the playlist dialog to appear
const observer = new MutationObserver(() => {
  const playlistDialog = document.querySelector('ytd-add-to-playlist-renderer');
  
  if (playlistDialog && !playlistDialog.querySelector('.playlist-search')) {
    addSearchFunctionality(playlistDialog);
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

function addSearchFunctionality(dialog) {
  const container = document.createElement('div');
  container.className = 'playlist-search';
  container.style.padding = '0 16px 16px';
  
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search playlists...';
  searchInput.style.width = '100%';
  searchInput.style.padding = '8px';
  searchInput.style.boxSizing = 'border-box';
  
  container.appendChild(searchInput);
  
  // Find the correct insertion point
  const targetContainer = dialog.querySelector('#content') || dialog.querySelector('#contents');
  if (targetContainer) {
    targetContainer.parentElement.insertBefore(container, targetContainer);
  } else {
    dialog.prepend(container);
  }

  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    
    // Updated playlist item selector
    const playlistItems = dialog.querySelectorAll(
      'ytd-playlist-add-to-option-renderer, [role="option"]'
    );
    
    playlistItems.forEach(item => {
      // Updated title selector
      const titleElement = item.querySelector('#label') || 
                           item.querySelector('.label') ||
                           item.querySelector('[aria-label]') ||
                           item.querySelector('.yt-core-attributed-string');
      
      if (titleElement) {
        const title = titleElement.textContent?.toLowerCase() || 
                      titleElement.getAttribute('aria-label')?.toLowerCase() || 
                      '';
        item.style.display = title.includes(searchTerm) ? '' : 'none';
      }
    });
  });
}