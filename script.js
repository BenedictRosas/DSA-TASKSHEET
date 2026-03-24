// Topic order for navigation
const topicOrder = ['arrays', 'lists', 'tuples', 'matrix', 'linked', 'stack', 'queue', 'maps', 'dictionary', 'trees', 'graphs', 'sorting', 'searching'];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  loadProgress();
  updateProgressBar();
  updateTopicCount();
  initializeKeyboardShortcuts();
  initializeSearch();
  loadViewPreferences();
});

// ========================================
// SECTION SWITCHING
// ========================================
function showSection(id, btn) {
  const sections = document.querySelectorAll('.content');
  const buttons = document.querySelectorAll('.nav-btn');

  sections.forEach(section => section.classList.remove('active'));
  buttons.forEach(button => button.classList.remove('active'));

  document.getElementById(id).classList.add('active');
  if (btn) btn.classList.add('active');

  // Auto-close sidebar on mobile
  if (window.innerWidth <= 768) {
    document.getElementById('sidebar').classList.remove('show');
  }

  // Scroll to top of content
  document.querySelector('main').scrollTo(0, 0);

  // Save current section
  localStorage.setItem('currentSection', id);
  
  // Restore view preference for this section
  restoreViewPreference(id);
}

// ========================================
// VIEW SWITCHING (Presentation / Code / Split)
// ========================================
function switchView(sectionId, viewType) {
  const section = document.getElementById(sectionId);
  const viewContainer = section.querySelector('.view-container');
  const toggleBtns = section.querySelectorAll('.toggle-btn');

  // Update container data attribute
  viewContainer.setAttribute('data-view', viewType);

  // Update active button
  toggleBtns.forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-view') === viewType) {
      btn.classList.add('active');
    }
  });

  // Save preference
  saveViewPreference(sectionId, viewType);
}

function saveViewPreference(sectionId, viewType) {
  const preferences = JSON.parse(localStorage.getItem('viewPreferences') || '{}');
  preferences[sectionId] = viewType;
  localStorage.setItem('viewPreferences', JSON.stringify(preferences));
}

function loadViewPreferences() {
  const currentSection = localStorage.getItem('currentSection');
  if (currentSection) {
    restoreViewPreference(currentSection);
  }
}

function restoreViewPreference(sectionId) {
  const preferences = JSON.parse(localStorage.getItem('viewPreferences') || '{}');
  const savedView = preferences[sectionId] || 'presentation';
  
  const section = document.getElementById(sectionId);
  if (section) {
    const viewContainer = section.querySelector('.view-container');
    const toggleBtns = section.querySelectorAll('.toggle-btn');
    
    viewContainer.setAttribute('data-view', savedView);
    
    toggleBtns.forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-view') === savedView) {
        btn.classList.add('active');
      }
    });
  }
}

// ========================================
// LANGUAGE SWITCHING (Python, JS, Java, C++)
// ========================================
function switchLanguage(sectionId, language) {
  const section = document.getElementById(sectionId);
  const langTabs = section.querySelectorAll('.lang-tab');
  const codeBlocks = section.querySelectorAll('.code-block');

  // Update active tab
  langTabs.forEach(tab => {
    tab.classList.remove('active');
    if (tab.textContent.toLowerCase().includes(language)) {
      tab.classList.add('active');
    }
  });

  // Show corresponding code block
  codeBlocks.forEach(block => {
    block.classList.remove('active');
    if (block.classList.contains(language)) {
      block.classList.add('active');
    }
  });

  // Save language preference
  saveLanguagePreference(sectionId, language);
}

function saveLanguagePreference(sectionId, language) {
  const preferences = JSON.parse(localStorage.getItem('languagePreferences') || '{}');
  preferences[sectionId] = language;
  localStorage.setItem('languagePreferences', JSON.stringify(preferences));
}

// ========================================
// CODE COPY FUNCTIONALITY
// ========================================
function copyCode(sectionId) {
  const section = document.getElementById(sectionId);
  const activeCodeBlock = section.querySelector('.code-block.active code');
  const copyBtn = section.querySelector('.copy-code-btn');
  
  if (!activeCodeBlock) return;

  const code = activeCodeBlock.textContent;
  
  navigator.clipboard.writeText(code).then(() => {
    // Visual feedback
    const originalText = copyBtn.innerHTML;
    copyBtn.innerHTML = '✓ Copied!';
    copyBtn.classList.add('copied');
    
    setTimeout(() => {
      copyBtn.innerHTML = originalText;
      copyBtn.classList.remove('copied');
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy code:', err);
    alert('Failed to copy code. Please try again.');
  });
}

// ========================================
// DARK MODE
// ========================================
const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
  document.body.classList.add('dark');
  themeToggle.textContent = '☀️ Light';
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggle.textContent = isDark ? "☀️ Light" : "🌙 Dark";
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// ========================================
// SIDEBAR TOGGLE
// ========================================
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");

  if (window.innerWidth <= 768) {
    sidebar.classList.toggle("show");
  } else {
    sidebar.classList.toggle("collapsed");
  }
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
  const sidebar = document.getElementById('sidebar');
  const menu = document.querySelector('.menu');
  
  if (window.innerWidth <= 768 && 
      sidebar.classList.contains('show') && 
      !sidebar.contains(e.target) && 
      !menu.contains(e.target)) {
    sidebar.classList.remove('show');
  }
});

// ========================================
// PROGRESS TRACKING
// ========================================
function toggleComplete(topicId) {
  const button = document.querySelector(`[data-topic="${topicId}"]`);
  const completeBtn = event.target;
  
  if (button.classList.contains('completed')) {
    button.classList.remove('completed');
    completeBtn.classList.remove('completed');
    completeBtn.textContent = 'Mark as Complete';
  } else {
    button.classList.add('completed');
    completeBtn.classList.add('completed');
    completeBtn.textContent = 'Completed';
    createConfetti(completeBtn);
  }
  
  saveProgress();
  updateProgressBar();
  updateTopicCount();
}

function saveProgress() {
  const completed = [];
  document.querySelectorAll('.nav-btn.completed').forEach(btn => {
    completed.push(btn.dataset.topic);
  });
  localStorage.setItem('completedTopics', JSON.stringify(completed));
}

function loadProgress() {
  const completed = JSON.parse(localStorage.getItem('completedTopics') || '[]');
  const currentSection = localStorage.getItem('currentSection');
  
  completed.forEach(topicId => {
    const button = document.querySelector(`[data-topic="${topicId}"]`);
    if (button) {
      button.classList.add('completed');
    }
    
    const completeBtn = document.querySelector(`#${topicId} .mark-complete-btn`);
    if (completeBtn) {
      completeBtn.classList.add('completed');
      completeBtn.textContent = 'Completed';
    }
  });

  // Restore last viewed section
  if (currentSection) {
    const btn = document.querySelector(`[data-topic="${currentSection}"]`);
    if (btn) {
      showSection(currentSection, btn);
    }
  }
}

function updateProgressBar() {
  const total = document.querySelectorAll('.nav-btn').length;
  const completed = document.querySelectorAll('.nav-btn.completed').length;
  const percentage = (completed / total) * 100;
  
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  
  progressBar.style.width = percentage + '%';
  progressText.textContent = Math.round(percentage) + '%';
}

function updateTopicCount() {
  const total = document.querySelectorAll('.nav-btn').length;
  const completed = document.querySelectorAll('.nav-btn.completed').length;
  
  const topicCount = document.getElementById('topicCount');
  topicCount.textContent = `${completed}/${total} completed`;
}

function resetProgress() {
  if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
    localStorage.removeItem('completedTopics');
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('completed');
    });
    
    document.querySelectorAll('.mark-complete-btn').forEach(btn => {
      btn.classList.remove('completed');
      btn.textContent = 'Mark as Complete';
    });
    
    updateProgressBar();
    updateTopicCount();
  }
}

// ========================================
// NAVIGATION
// ========================================
function navigateToNext(currentId) {
  const currentIndex = topicOrder.indexOf(currentId);
  if (currentIndex < topicOrder.length - 1) {
    const nextId = topicOrder[currentIndex + 1];
    const nextBtn = document.querySelector(`[data-topic="${nextId}"]`);
    showSection(nextId, nextBtn);
  }
}

function navigateToPrev(currentId) {
  const currentIndex = topicOrder.indexOf(currentId);
  if (currentIndex > 0) {
    const prevId = topicOrder[currentIndex - 1];
    const prevBtn = document.querySelector(`[data-topic="${prevId}"]`);
    showSection(prevId, prevBtn);
  }
}

// ========================================
// SEARCH FUNCTIONALITY
// ========================================
function initializeSearch() {
  const searchInput = document.getElementById('searchInput');
  
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const buttons = document.querySelectorAll('.nav-btn');
    
    buttons.forEach(btn => {
      const label = btn.querySelector('.nav-label').textContent.toLowerCase();
      btn.classList.remove('search-highlight');
      
      if (query && label.includes(query)) {
        btn.classList.add('search-highlight');
        btn.style.display = 'flex';
      } else if (query) {
        btn.style.display = 'none';
      } else {
        btn.style.display = 'flex';
      }
    });
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input'));
      searchInput.blur();
    }
  });
}

// ========================================
// KEYBOARD SHORTCUTS
// ========================================
function initializeKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ignore if typing in input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    switch(e.key.toLowerCase()) {
      case 'arrowright':
        e.preventDefault();
        navigateFromCurrent('next');
        break;
      case 'arrowleft':
        e.preventDefault();
        navigateFromCurrent('prev');
        break;
      case ' ':
        e.preventDefault();
        toggleCurrentComplete();
        break;
      case '/':
        e.preventDefault();
        document.getElementById('searchInput')?.focus();
        break;
      case 'd':
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          themeToggle.click();
        }
        break;
      case 'c':
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          toggleCurrentView('code');
        }
        break;
      case 's':
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          toggleCurrentView('split');
        }
        break;
      case '?':
        e.preventDefault();
        toggleShortcutsModal();
        break;
      case 'escape':
        closeShortcutsModal();
        break;
    }
  });

  document.getElementById('shortcutsHint')?.addEventListener('click', toggleShortcutsModal);
}

function navigateFromCurrent(direction) {
  const activeSection = document.querySelector('.content.active');
  if (!activeSection) return;
  
  const currentId = activeSection.id;
  if (direction === 'next') {
    navigateToNext(currentId);
  } else {
    navigateToPrev(currentId);
  }
}

function toggleCurrentComplete() {
  const activeSection = document.querySelector('.content.active');
  if (!activeSection) return;
  
  const completeBtn = activeSection.querySelector('.mark-complete-btn');
  if (completeBtn) {
    completeBtn.click();
  }
}

function toggleCurrentView(viewType) {
  const activeSection = document.querySelector('.content.active');
  if (!activeSection) return;
  
  const currentView = activeSection.querySelector('.view-container').getAttribute('data-view');
  
  // If already in that view, go back to presentation
  if (currentView === viewType) {
    viewType = 'presentation';
  }
  
  switchView(activeSection.id, viewType);
}

function toggleShortcutsModal() {
  const modal = document.getElementById('shortcutsModal');
  modal.classList.toggle('show');
}

function closeShortcutsModal() {
  document.getElementById('shortcutsModal').classList.remove('show');
}

// Click outside modal to close
document.getElementById('shortcutsModal')?.addEventListener('click', (e) => {
  if (e.target.id === 'shortcutsModal') {
    closeShortcutsModal();
  }
});

// ========================================
// CONFETTI EFFECT
// ========================================
function createConfetti(button) {
  const rect = button.getBoundingClientRect();
  const colors = ['#e50914', '#10b981', '#3b82f6', '#f59e0b'];
  
  for (let i = 0; i < 20; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.left = rect.left + rect.width / 2 + 'px';
    confetti.style.top = rect.top + rect.height / 2 + 'px';
    confetti.style.width = '8px';
    confetti.style.height = '8px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.borderRadius = '50%';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '10000';
    
    document.body.appendChild(confetti);
    
    const angle = (Math.PI * 2 * i) / 20;
    const velocity = 3 + Math.random() * 3;
    
    let x = 0, y = 0, opacity = 1;
    
    const animate = () => {
      x += Math.cos(angle) * velocity;
      y += Math.sin(angle) * velocity + 2;
      opacity -= 0.02;
      
      confetti.style.transform = `translate(${x}px, ${y}px)`;
      confetti.style.opacity = opacity;
      
      if (opacity > 0) {
        requestAnimationFrame(animate);
      } else {
        confetti.remove();
      }
    };
    
    animate();
  }
}

// ========================================
// AUTO-SAVE SCROLL POSITION
// ========================================
let scrollTimeout;
document.querySelector('main')?.addEventListener('scroll', (e) => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    const activeSection = document.querySelector('.content.active');
    if (activeSection) {
      localStorage.setItem(`scroll_${activeSection.id}`, e.target.scrollTop);
    }
  }, 200);
});

function restoreScrollPosition(sectionId) {
  const savedScroll = localStorage.getItem(`scroll_${sectionId}`);
  if (savedScroll) {
    setTimeout(() => {
      document.querySelector('main').scrollTop = parseInt(savedScroll);
    }, 100);
  }
}

// Update showSection to restore scroll
const originalShowSection = showSection;
showSection = function(id, btn) {
  originalShowSection(id, btn);
  restoreScrollPosition(id);
};