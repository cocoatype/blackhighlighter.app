// Tab switching for screenshot galleries
const tabButtons = document.querySelectorAll('.gallery .tabs button');
const sections = document.querySelectorAll('.gallery .set');
const status = document.getElementById('status');

const statusText = {
  ios: "Showing 5 iPhone screenshots · Framed, ready for print or web",
  ipad: "Showing 4 iPad screenshots · Framed, ready for print or web",
  mac: "Showing 4 Mac App Store screenshots · 16:10 framed compositions",
  desktop: "Showing 4 desktop crops · Direct app captures, paper background",
  icon: "Showing 1 app icon · 1024×1024 PNG"
};

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    tabButtons.forEach(b => b.setAttribute('aria-selected', b === btn ? 'true' : 'false'));
    sections.forEach(s => s.classList.toggle('active', s.dataset.section === tab));
    if (status) status.textContent = statusText[tab] || '';
  });
});

// Copy boilerplate
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.boilerplate');
    const text = [...card.querySelectorAll('p')]
      .filter(p => !p.classList.contains('word-count'))
      .map(p => p.textContent.trim())
      .join('\n\n');
    navigator.clipboard?.writeText(text);
    const orig = btn.innerHTML;
    btn.classList.add('copied');
    btn.innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" width="11" height="11"><path d="M3 8l3 3 7-7"/></svg> Copied';
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = orig;
    }, 1600);
  });
});
