// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active navigation highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.tutorial-card, .vibe-feature-card, .nav-card, .resource-card').forEach(el => {
    observer.observe(el);
});

// Progress indicator for tutorial sections
function updateProgressIndicator() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollY / documentHeight) * 100;

    // Create or update progress bar
    let progressBar = document.querySelector('.progress-bar');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #2563eb, #8b5cf6);
            z-index: 10000;
            transition: width 0.3s ease;
        `;
        document.body.appendChild(progressBar);
    }
    progressBar.style.width = `${progress}%`;
}

window.addEventListener('scroll', updateProgressIndicator);

// Copy code functionality
document.querySelectorAll('.code-example, .command-example code').forEach(codeBlock => {
    codeBlock.style.position = 'relative';
    codeBlock.style.cursor = 'pointer';
    
    codeBlock.addEventListener('click', async () => {
        const text = codeBlock.textContent || codeBlock.innerText;
        
        try {
            await navigator.clipboard.writeText(text);
            showCopyFeedback(codeBlock);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showCopyFeedback(codeBlock);
        }
    });
});

function showCopyFeedback(element) {
    const originalBg = element.style.backgroundColor;
    element.style.backgroundColor = '#10b981';
    element.style.transition = 'background-color 0.3s ease';
    
    setTimeout(() => {
        element.style.backgroundColor = originalBg;
    }, 300);
}

// Interactive checklist functionality
document.querySelectorAll('.checklist-item input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const label = this.nextElementSibling;
        if (this.checked) {
            label.style.textDecoration = 'line-through';
            label.style.opacity = '0.6';
        } else {
            label.style.textDecoration = 'none';
            label.style.opacity = '1';
        }
        
        // Update progress
        updateChecklistProgress();
    });
});

function updateChecklistProgress() {
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    const checked = document.querySelectorAll('.checklist-item input[type="checkbox"]:checked');
    const progress = (checked.length / checkboxes.length) * 100;
    
    // You could display this progress somewhere if needed
    console.log(`Checklist progress: ${progress.toFixed(0)}%`);
}

// Search functionality (if you want to add a search feature)
function addSearchFunctionality() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search tutorial...';
    searchInput.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 0.5rem 1rem;
        border: 1px solid #e1e5e9;
        border-radius: 0.5rem;
        background: white;
        z-index: 999;
        width: 250px;
    `;
    
    document.body.appendChild(searchInput);
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const text = section.textContent.toLowerCase();
            if (text.includes(searchTerm) || searchTerm === '') {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for quick search (if search is enabled)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Escape to close mobile menu
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
    
    // Ctrl/Cmd + / to show keyboard shortcuts help
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        showKeyboardShortcuts();
    }
});

function showKeyboardShortcuts() {
    const shortcuts = [
        { key: 'Ctrl + K', description: 'Quick search' },
        { key: 'Ctrl + /', description: 'Show shortcuts' },
        { key: 'Escape', description: 'Close mobile menu' },
        { key: 'Ctrl + Space', description: 'AI code completion' },
        { key: 'Ctrl + Shift + P', description: 'Command palette' }
    ];
    
    let shortcutsHtml = '<div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.2); z-index: 10000; max-width: 400px;">';
    shortcutsHtml += '<h3 style="margin-bottom: 1rem; color: #1e293b;">Keyboard Shortcuts</h3>';
    
    shortcuts.forEach(shortcut => {
        shortcutsHtml += `<div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; padding: 0.5rem; background: #f8fafc; border-radius: 0.25rem;">`;
        shortcutsHtml += `<span style="font-weight: 600; color: #2563eb;">${shortcut.key}</span>`;
        shortcutsHtml += `<span style="color: #64748b;">${shortcut.description}</span>`;
        shortcutsHtml += `</div>`;
    });
    
    shortcutsHtml += '<button onclick="this.parentElement.remove()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #2563eb; color: white; border: none; border-radius: 0.25rem; cursor: pointer; width: 100%;">Close</button>';
    shortcutsHtml += '</div>';
    
    // Add backdrop
    const backdrop = document.createElement('div');
    backdrop.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999;';
    backdrop.onclick = () => {
        backdrop.remove();
        document.querySelector('[style*="position: fixed; top: 50%; left: 50%"]').remove();
    };
    
    document.body.appendChild(backdrop);
    document.body.insertAdjacentHTML('beforeend', shortcutsHtml);
}

// Theme toggle (optional enhancement)
function addThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.innerHTML = '🌙';
    themeToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #2563eb;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 1.5rem;
        z-index: 999;
        transition: all 0.3s ease;
    `;
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        themeToggle.innerHTML = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
    });
    
    document.body.appendChild(themeToggle);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add any initialization code here
    updateProgressIndicator();
    
    // Optional: Uncomment these lines if you want these features
    // addSearchFunctionality();
    // addThemeToggle();
    
    console.log('Kiro IDE Tutorial loaded successfully!');
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
window.addEventListener('scroll', debounce(() => {
    updateProgressIndicator();
}, 10));

// Add loading state for images
document.querySelectorAll('.placeholder-image').forEach(img => {
    img.addEventListener('load', function() {
        this.classList.add('loaded');
    });
});

// Tooltip functionality
function addTooltips() {
    const tooltipElements = document.querySelectorAll('[title]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = element.getAttribute('title');
            tooltip.style.cssText = `
                position: absolute;
                background: #1e293b;
                color: white;
                padding: 0.5rem 0.75rem;
                border-radius: 0.25rem;
                font-size: 0.875rem;
                z-index: 10000;
                pointer-events: none;
                white-space: nowrap;
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = element.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
            
            element.addEventListener('mouseleave', () => {
                tooltip.remove();
            }, { once: true });
        });
    });
}

// Initialize tooltips
addTooltips();