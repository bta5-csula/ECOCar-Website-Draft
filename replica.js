// Cal State LA EcoCAR — Subpage Interactivity

const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');

menuButton?.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

mobileNav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

document.querySelectorAll('.cases-stage .case-tabs, .cases-stage .case-display, .join-card').forEach(el => {
  el.classList.add('reveal');
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// SVG Vector Icons for Project Areas (No emojis)
const caseSvgs = {
  bdu: '<svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>',
  battery: '<svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="6" width="18" height="12" rx="2"></rect><line x1="23" y1="11" x2="23" y2="13"></line><polygon points="10 8 7 13 11 13 9 17 14 11 10 11 10 8" fill="#F59E0B"></polygon></svg>',
  drive: '<svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
  controls: '<svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="#8B5CF6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>',
  can: '<svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="#06B6D4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M13 6h3a2 2 0 0 1 2 2v7"></path><line x1="6" y1="9" x2="6" y2="21"></line></svg>',
  thermal: '<svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path></svg>'
};

const caseData = {
  bdu: ['Battery Disconnect Unit', 'Contactors, precharge, fusing and busbars form the safety-critical assembly that connects—and disconnects—the high-voltage battery.', caseSvgs.bdu],
  battery: ['High-Voltage Battery', 'Cells become modules, modules become a pack, and voltage, current, energy and thermal limits shape the entire vehicle architecture.', caseSvgs.battery],
  drive: ['Rear Drive Integration', 'The electric rear axle, motors and inverters must fit beneath the vehicle with sound mounts, load paths and clearance.', caseSvgs.drive],
  controls: ['Controls / Embedded', 'Firmware reads sensors, makes decisions, drives outputs and brings every system to a safe state when something goes wrong.', caseSvgs.controls],
  can: ['CAN Network', 'Vehicle modules communicate on a shared bus. The team listens, decodes signals and develops the messages that coordinate the vehicle.', caseSvgs.can],
  thermal: ['Thermal Systems', 'Heat sets the operating limit. Cooling plates, coolant loops and ambient conditions determine how hard the battery and drive unit can work.', caseSvgs.thermal]
};

document.querySelectorAll('.case-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.case-tab').forEach(item => item.classList.remove('active'));
    tab.classList.add('active');
    const data = caseData[tab.dataset.case];
    if (!data) return;
    const display = document.querySelector('.case-display');
    display?.classList.add('is-changing');
    window.setTimeout(() => {
      const titleEl = document.querySelector('#case-title');
      const copyEl = document.querySelector('#case-copy');
      const symbolEl = document.querySelector('#case-symbol');
      if (titleEl) titleEl.textContent = data[0];
      if (copyEl) copyEl.textContent = data[1];
      if (symbolEl) symbolEl.innerHTML = data[2];
      display?.classList.remove('is-changing');
    }, 180);
  });
});

document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    document.querySelectorAll('.story').forEach(story => story.classList.add('is-filtering'));
    window.setTimeout(() => {
      document.querySelectorAll('.story').forEach(story => {
        story.hidden = button.dataset.filter !== 'All' && story.dataset.category !== button.dataset.filter;
        story.classList.remove('is-filtering');
      });
    }, 180);
  });
});
