// Cal State LA EcoCAR — Home Page Interactivity

function installFeaturedVideo() {
  const wrapper = document.querySelector('[data-video-wrapper]');
  if (!wrapper || wrapper.dataset.ecoVideoReady) return;
  wrapper.dataset.ecoVideoReady = 'true';
  wrapper.setAttribute('role', 'button');
  wrapper.setAttribute('tabindex', '0');
  wrapper.setAttribute('aria-label', 'Play Cal State LA EcoCAR video');

  wrapper.innerHTML = `
    <div class="home-video-preview">
      <iframe src="https://www.youtube-nocookie.com/embed/oibPfvqW1zg?autoplay=1&mute=1&loop=1&playlist=oibPfvqW1zg&controls=0&modestbranding=1&playsinline=1&rel=0" 
              title="Cal State LA EcoCAR video preview" 
              allow="autoplay; encrypted-media" 
              tabindex="-1"></iframe>
    </div>
    <div class="home-video-follow" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
      <span>Play video</span>
    </div>
    <div class="video-control-button home-video-control" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
    </div>
  `;

  const follower = wrapper.querySelector('.home-video-follow');
  const control = wrapper.querySelector('.home-video-control');

  const move = (e) => {
    const rect = wrapper.getBoundingClientRect();
    follower.style.transform = `translate(${e.clientX - rect.left}px, ${e.clientY - rect.top}px) translate(-50%, -50%) scale(1)`;
  };

  wrapper.addEventListener('pointerenter', (e) => {
    move(e);
    follower.classList.add('is-visible');
    control?.classList.add('is-hidden');
  });

  wrapper.addEventListener('pointermove', move);

  wrapper.addEventListener('pointerleave', () => {
    follower.classList.remove('is-visible');
    control?.classList.remove('is-hidden');
  });

  const openModal = () => {
    if (document.querySelector('.home-video-modal')) return;
    const modal = document.createElement('div');
    modal.className = 'home-video-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Cal State LA EcoCAR video');
    modal.innerHTML = `
      <button class="home-video-close" type="button" aria-label="Close video">×</button>
      <div class="home-video-frame">
        <iframe src="https://www.youtube-nocookie.com/embed/oibPfvqW1zg?autoplay=1&rel=0" 
                title="Cal State LA EcoCAR video" 
                allow="autoplay; encrypted-media; picture-in-picture" 
                allowfullscreen></iframe>
      </div>
    `;
    document.body.appendChild(modal);
    document.body.classList.add('eco-video-open');

    const closeModal = () => {
      modal.remove();
      document.body.classList.remove('eco-video-open');
      wrapper.focus();
    };

    modal.querySelector('.home-video-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    modal.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
    modal.querySelector('.home-video-close').focus();
  };

  wrapper.addEventListener('click', openModal);
  wrapper.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal();
    }
  });
}

function installFeaturedVideoScale() {
  const section = document.querySelector('.landing-video-section');
  if (!section || section.dataset.ecoScaleReady) return;
  section.dataset.ecoScaleReady = 'true';
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    section.style.transform = 'scale(1)';
    return;
  }
  let frame = 0;
  const measure = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const end = Math.max(1, section.offsetTop);
      const scale = 0.5 + 0.5 * Math.min(1, Math.max(0, scrollY / end));
      section.style.transform = `translate3d(0,0,0) scale(${scale})`;
    });
  };
  section.style.transform = 'translate3d(0,0,0) scale(0.5)';
  window.addEventListener('scroll', measure, { passive: true });
  window.addEventListener('resize', measure, { passive: true });
  measure();
}

function positionCaseCursor(container) {
  const content = container.querySelector('.typed-content');
  const cursor = container.querySelector('.cursor-container');
  if (!content || !cursor) return;
  const base = container.getBoundingClientRect();
  let x = 0, y = 0;
  if (content.textContent) {
    const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
    let node, last;
    while ((node = walker.nextNode())) {
      if (node.nodeValue?.length) last = node;
    }
    if (last) {
      const range = document.createRange();
      range.setStart(last, last.nodeValue.length - 1);
      range.setEnd(last, last.nodeValue.length);
      const end = range.getBoundingClientRect();
      x = end.right - base.left;
      y = end.top - base.top;
    }
  }
  x = Math.max(0, x);
  y = Math.max(0, y);
  cursor.style.setProperty('--cursor-pos-x', `${x}px`);
  cursor.style.setProperty('--cursor-pos-y', `${y}px`);
  cursor.style.transform = `translate(${x}px, ${y}px)`;
}

function typeCaseTitle(container) {
  const content = container.querySelector('.typed-content');
  const cursor = container.querySelector('.cursor-container');
  const text = container.dataset.ecoCaseTitle || '';
  if (!content || !cursor) return;
  const run = (Number(container.dataset.ecoTypingRun) || 0) + 1;
  container.dataset.ecoTypingRun = String(run);
  cursor.style.opacity = '1';

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    content.textContent = text;
    positionCaseCursor(container);
    return;
  }
  content.textContent = '';
  positionCaseCursor(container);
  let index = 0;
  const tick = () => {
    if (Number(container.dataset.ecoTypingRun) !== run) return;
    index += 1;
    content.textContent = text.slice(0, index);
    positionCaseCursor(container);
    if (index < text.length) setTimeout(tick, 38);
  };
  setTimeout(tick, 90);
}

function installUseCaseTyping() {
  const section = document.querySelector('.landing-use-case-section');
  if (!section || section.dataset.ecoTypingReady) return;
  section.dataset.ecoTypingReady = 'true';
  let activeIndex = '';

  const sync = () => {
    const active = section.querySelector('.slide-image.is-active');
    const next = active?.getAttribute('data-slide-index') || '';
    if (!active || next === activeIndex) return;
    activeIndex = next;
    section.querySelectorAll('[data-eco-case-title] .cursor-container').forEach(c => c.style.opacity = '0');
    const title = active.querySelector('[data-eco-case-title]');
    if (title) typeCaseTitle(title);
  };

  const observer = new MutationObserver(() => requestAnimationFrame(sync));
  section.querySelectorAll('.slide-image').forEach(slide => {
    observer.observe(slide, { attributes: true, attributeFilter: ['class'] });
  });
  requestAnimationFrame(sync);
}

function installLoopingUseCaseSlider(force = false) {
  const section = document.querySelector('.landing-use-case-section');
  const slider = section?.querySelector('[data-slider]');
  const track = slider?.querySelector('[data-track]');
  const copyWrapper = section?.querySelector('[data-copy-wrapper]');
  if (!section || !slider || !track || !copyWrapper || (section.dataset.ecoLoopReady && !force)) return;
  section.dataset.ecoLoopReady = 'true';

  const slides = [...track.querySelectorAll('.slide-image')];
  const copies = [...copyWrapper.querySelectorAll('.slider-copy')];
  const count = slides.length;
  let index = Math.max(0, slides.findIndex(slide => slide.classList.contains('is-active')));
  let moving = false;

  const setCopy = (next) => {
    copies.forEach((copy, i) => {
      const active = i === next;
      copy.classList.toggle('is-active', active);
      [...copy.children].forEach(child => {
        child.style.opacity = active ? '1' : '0';
        child.style.visibility = active ? 'visible' : 'hidden';
        child.style.transform = active ? 'translateY(0)' : 'translateY(24px)';
      });
    });
  };

  const go = (direction) => {
    if (moving || count < 2) return;
    moving = true;
    const next = (index + direction + count) % count;
    const from = slides[index];
    const to = slides[next];

    to.classList.add('eco-loop-visible');
    to.style.transition = 'none';
    to.style.transform = `translateX(${direction > 0 ? 100 : -100}%)`;
    to.style.opacity = '1';
    void to.offsetWidth;

    from.classList.add('eco-loop-visible');
    from.style.transition = 'transform .48s cubic-bezier(.22,.7,.18,1)';
    to.style.transition = 'transform .48s cubic-bezier(.22,.7,.18,1)';

    requestAnimationFrame(() => {
      from.style.transform = `translateX(${direction > 0 ? -100 : 100}%)`;
      to.style.transform = 'translateX(0)';
    });

    setCopy(next);

    setTimeout(() => {
      from.classList.remove('is-active', 'eco-loop-visible');
      from.style.cssText = '';
      to.classList.add('is-active');
      to.classList.remove('eco-loop-visible');
      to.style.cssText = '';
      index = next;
      slider.dataset.activeIndex = String(index);
      moving = false;
    }, 500);
  };

  const controls = section.querySelector('.slider-controls');
  if (!controls) return;
  const clean = controls.cloneNode(true);
  controls.replaceWith(clean);

  const prev = clean.querySelector('[data-arrow-left]');
  const next = clean.querySelector('[data-arrow-right]');

  const enable = () => [prev, next].forEach(btn => {
    if (btn) {
      btn.disabled = false;
      btn.removeAttribute('disabled');
    }
  });
  enable();
  new MutationObserver(enable).observe(clean, { subtree: true, attributes: true, attributeFilter: ['disabled'] });

  prev?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    go(-1);
  }, true);

  next?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    go(1);
  }, true);

  setCopy(index);
}

// Header scroll reactivity (sticky, shadow, and hide/reveal)
function installHeaderScroll() {
  const header = document.querySelector('[data-header]');
  if (!header || header.dataset.ecoScrollReady) return;
  header.dataset.ecoScrollReady = 'true';
  let lastY = window.scrollY;

  window.addEventListener('scroll', () => {
    if (header.classList.contains('menu-open')) return;
    const current = window.scrollY;
    if (current > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    const delta = current - lastY;
    if (delta > 8 && current > 80) {
      header.classList.add('hidden');
    } else if (delta < -8) {
      header.classList.remove('hidden');
    }
    if (Math.abs(delta) > 8) {
      lastY = current;
    }
  }, { passive: true });
}

// Mobile menu toggle handling
function installMobileNavToggle() {
  const toggleBtn = document.querySelector('[data-mobile-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const header = document.querySelector('[data-header]');
  if (!toggleBtn || !mobileMenu || toggleBtn.dataset.ecoReady) return;
  toggleBtn.dataset.ecoReady = 'true';

  const closeMenu = () => {
    mobileMenu.classList.remove('is-open', 'open');
    header?.classList.remove('menu-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  };

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const willOpen = !mobileMenu.classList.contains('open') && !mobileMenu.classList.contains('is-open');
    mobileMenu.classList.toggle('open', willOpen);
    mobileMenu.classList.toggle('is-open', willOpen);
    header?.classList.toggle('menu-open', willOpen);
    toggleBtn.setAttribute('aria-expanded', String(willOpen));
    document.body.classList.toggle('no-scroll', willOpen);
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}


// Ensure bottom section never displays OS downloads
function protectDownloadSection() {
  const container = document.querySelector('[data-cta-container]');
  if (!container) return;
  const hasDownloadText = container.textContent.includes('Download for');
  if (hasDownloadText) {
    container.innerHTML = '<a href="https://docs.google.com/forms/d/1NJ0FKSSMiyIEpGi3uje7MIppVhCQ5TqaDEJZUg7HKjA/viewform" target="_blank" rel="noopener noreferrer" class="call-to-action button button-primary-inverse"><span>Join the team</span></a><a href="team.html" class="call-to-action button button-secondary-inverse"><span>Meet the Leads</span></a>';
  }
}

function initHome() {
  protectDownloadSection();
  installHeaderScroll();
  installFeaturedVideo();
  installFeaturedVideoScale();
  installUseCaseTyping();
  installLoopingUseCaseSlider();
  installMobileNavToggle();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHome);
} else {
  initHome();
}
window.addEventListener('load', () => {
  initHome();
  setTimeout(() => installLoopingUseCaseSlider(true), 120);
});
