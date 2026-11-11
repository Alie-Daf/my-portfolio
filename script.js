const root = document.documentElement;
const nav = document.querySelector('.nav');
const progress = document.querySelector('.progress');
const timeline = document.querySelector('.timeline');
const themeToggle = document.getElementById('themeToggle');
const navLinks = [...document.querySelectorAll('.nav-links a')];
const sections = navLinks.map(link => document.querySelector(link.getAttribute('href')));

themeToggle.addEventListener('click', () => {
  const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = nextTheme;
  themeToggle.setAttribute('aria-pressed', String(nextTheme === 'dark'));

  try {
    localStorage.setItem('theme', nextTheme);
  } catch (error) {
    // Theme persistence is optional when storage is unavailable.
  }
});

function updateScrollEffects() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${maxScroll > 0 ? window.scrollY / maxScroll : 0})`;
  nav.classList.toggle('scrolled', window.scrollY > 20);

  const activePosition = window.scrollY + window.innerHeight * 0.4;
  let activeIndex = -1;
  sections.forEach((section, index) => {
    if (section && section.offsetTop <= activePosition) activeIndex = index;
  });
  navLinks.forEach((link, index) => {
    if (index === activeIndex) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
    link.classList.toggle('active', index === activeIndex);
  });

  const timelineBounds = timeline.getBoundingClientRect();
  const timelineProgress = (window.innerHeight * 0.7 - timelineBounds.top) / Math.max(timelineBounds.height, 1);
  timeline.style.setProperty('--p', Math.min(1, Math.max(0, timelineProgress)));
}

themeToggle.setAttribute('aria-pressed', String(root.dataset.theme === 'dark'));
updateScrollEffects();
window.addEventListener('scroll', updateScrollEffects, { passive: true });
window.addEventListener('resize', updateScrollEffects);

document.querySelectorAll('.proj-head').forEach(button => {
  button.addEventListener('click', () => {
    const project = button.closest('.proj');
    const willOpen = !project.classList.contains('open');

    document.querySelectorAll('.proj.open').forEach(openProject => {
      openProject.classList.remove('open');
      openProject.querySelector('.proj-head').setAttribute('aria-expanded', 'false');
    });

    if (willOpen) {
      project.classList.add('open');
      button.setAttribute('aria-expanded', 'true');
    }
  });
});

const emailButton = document.getElementById('copyMail');
const copyState = document.getElementById('copyState');

emailButton.addEventListener('click', async () => {
  const email = emailButton.dataset.email;
  let copied = false;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(email);
      copied = true;
    } else {
      const range = document.createRange();
      range.selectNodeContents(emailButton.querySelector('span'));
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      copied = document.execCommand('copy');
    }
  } catch (error) {
    copied = false;
  }

  copyState.textContent = copied ? 'Copied' : 'Press Ctrl+C';
  window.setTimeout(() => {
    copyState.textContent = 'Copy';
    window.getSelection().removeAllRanges();
  }, 1800);
});
