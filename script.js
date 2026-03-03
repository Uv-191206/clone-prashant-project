/* =============================================
   RESEARCH INDIA — MAIN SCRIPT
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* ---- NAVBAR SCROLL ---- */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    /* ---- MOBILE MENU ---- */
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileClose = document.getElementById('mobileClose');
    const mLinks = document.querySelectorAll('.m-link');

    hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
    mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
    mLinks.forEach(link => link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
    }));

    /* ---- PARTICLES ---- */
    const particleContainer = document.getElementById('particles');
    const colors = ['#f59e0b', '#fb923c', '#60a5fa', '#34d399', '#c084fc'];

    for (let i = 0; i < 40; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 5 + 2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const dur = (Math.random() * 8 + 6).toFixed(1);
        const delay = (Math.random() * 10).toFixed(1);
        const opacity = (Math.random() * 0.5 + 0.2).toFixed(2);
        p.style.cssText = `
      left: ${Math.random() * 100}%;
      bottom: ${Math.random() * 40}%;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      box-shadow: 0 0 ${size * 3}px ${color};
      --dur: ${dur}s;
      --delay: ${delay}s;
      --op: ${opacity};
    `;
        particleContainer.appendChild(p);
    }

    /* ---- ACCORDION ---- */
    const accItems = document.querySelectorAll('.acc-item');
    accItems.forEach(item => {
        const header = item.querySelector('.acc-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            accItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.acc-header').setAttribute('aria-expanded', 'false');
            });
            if (!isActive) {
                item.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
            }
        });
    });

    /* ---- SCROLL-TRIGGERED ANIMATIONS (IntersectionObserver) ---- */
    // Problem cards
    const problemCards = document.querySelectorAll('.problem-card');
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay || 0);
                setTimeout(() => entry.target.classList.add('visible'), delay);
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    problemCards.forEach(card => cardObserver.observe(card));

    /* ---- COUNTER ANIMATION ---- */
    const statCards = document.querySelectorAll('.stat-card');
    const counters = [
        { el: document.getElementById('stat1'), target: 3 },
        { el: document.getElementById('stat2'), target: 82 },
        { el: document.getElementById('stat3'), target: 12 },
        { el: document.getElementById('stat4'), target: 65 },
    ];
    const fills = document.querySelectorAll('.stat-fill');

    let statsAnimated = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                statsAnimated = true;

                // Animate bars
                fills.forEach(fill => {
                    const w = fill.style.width;
                    fill.style.width = '0';
                    requestAnimationFrame(() => {
                        setTimeout(() => fill.style.width = w, 100);
                    });
                });

                // Animate counters
                counters.forEach(({ el, target }) => {
                    if (!el) return;
                    let current = 0;
                    const duration = 1800;
                    const start = performance.now();

                    const step = (timestamp) => {
                        const elapsed = timestamp - start;
                        const progress = Math.min(elapsed / duration, 1);
                        const ease = 1 - Math.pow(1 - progress, 3);
                        current = Math.round(ease * target);
                        el.textContent = current;
                        if (progress < 1) requestAnimationFrame(step);
                    };
                    requestAnimationFrame(step);
                });
            }
        });
    }, { threshold: 0.3 });

    const dataSection = document.getElementById('data');
    if (dataSection) statsObserver.observe(dataSection);

    /* ---- MODAL ---- */
    const modal = document.getElementById('modal');
    const modalClose = document.getElementById('modalClose');
    const modalIcon = document.getElementById('modalIcon');
    const modalTitle = document.getElementById('modalTitle');
    const modalText = document.getElementById('modalText');

    const modalMessages = {
        pledge: {
            icon: '✅',
            title: 'Pledge Signed!',
            text: 'Thank you for committing to responsible, high-quality research publishing. Together, we raise the bar for Indian academia.',
        },
        network: {
            icon: '🌐',
            title: 'Explore Networks',
            text: 'Visit ResearchGate, Academia.edu, or ORCID to connect with thousands of researchers. International collaboration can multiply your citation impact.',
        },
        advocate: {
            icon: '📬',
            title: 'Advocacy Template',
            text: 'Write to your institution\'s academic senate urging adoption of FWCI-based promotion criteria. Copy your UGC/AICTE regional office for maximum reach. Template copied to clipboard!',
        },
    };

    function openModal(type) {
        const m = modalMessages[type];
        modalIcon.textContent = m.icon;
        modalTitle.textContent = m.title;
        modalText.textContent = m.text;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }

    document.getElementById('btn-pledge').addEventListener('click', () => openModal('pledge'));
    document.getElementById('btn-network').addEventListener('click', () => openModal('network'));
    document.getElementById('btn-advocate').addEventListener('click', () => openModal('advocate'));

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    /* ---- NEWSLETTER SUBMIT ---- */
    window.handleNewsletterSubmit = function (e) {
        e.preventDefault();
        const email = document.getElementById('nlEmail').value;
        modalIcon.textContent = '📧';
        modalTitle.textContent = 'Subscribed!';
        modalText.textContent = `You're on the list (${email}). Expect monthly research insights, policy updates, and data on India's citation journey.`;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        e.target.reset();
    };

    /* ---- ACTIVE NAV LINK HIGHLIGHT ---- */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active-link');
                    if (link.getAttribute('href') === `#${entry.target.id}`) {
                        link.classList.add('active-link');
                    }
                });
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(s => sectionObserver.observe(s));

    /* ---- SMOOTH STAGGER for solution cards ---- */
    const solutionCards = document.querySelectorAll('.solution-card');
    const solutionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                entry.target.style.transitionDelay = `${i * 80}ms`;
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                solutionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    solutionCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        solutionObserver.observe(card);
    });

    /* ---- TIMELINE ITEMS ANIMATION ---- */
    const tlItems = document.querySelectorAll('.tl-item');
    const tlObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, i * 150);
                tlObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    tlItems.forEach((item, i) => {
        item.style.opacity = '0';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        item.style.transform = item.classList.contains('left') ? 'translateX(-30px)' : 'translateX(30px)';
        tlObserver.observe(item);
    });

    /* ---- ADD ACTIVE-LINK STYLE ---- */
    const styleEl = document.createElement('style');
    styleEl.textContent = `.nav-links a.active-link { color: #fff; background: rgba(245,158,11,0.12); }`;
    document.head.appendChild(styleEl);

});
