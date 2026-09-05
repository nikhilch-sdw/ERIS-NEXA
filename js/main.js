/**
 * ERIS-NEXA ELEVATORS PVT. LTD. — MAIN CLIENT JAVASCRIPT
 * Features:
 * 1. Interactive Elevator Shaft & Speed HUD Simulator
 * 2. Live Reactive Lift & Cabin Configurator with Dynamic Engineering Calculations
 * 3. Product Portfolio Filtering & Deep Technical Specification Modals
 * 4. Safety Systems Interactive Inspector
 * 5. Media Lightbox & Video Player Modal
 * 6. Accessible Multi-step Quotation Wizard (<dialog closedby="any"> with Fallback)
 * 7. WhatsApp Pre-filled Dispatch Generator
 */

document.addEventListener('DOMContentLoaded', () => {
  initElevatorSimulator();
  initConfigurator();
  initProductFilters();
  initMediaLightbox();
  initModalsAndDialogs();
  initNavigation();
  initFAQAccordion();
});

/* ==========================================================================
   1. INTERACTIVE ELEVATOR SHAFT & SPEED HUD SIMULATOR
   ========================================================================== */
function initElevatorSimulator() {
  const car = document.getElementById('simElevatorCar');
  const cable = document.getElementById('simShaftCable');
  const floorMarkerLabels = document.querySelectorAll('.shaft-floor-marker');
  const floorButtons = document.querySelectorAll('.floor-btn');
  const hudFloor = document.getElementById('hudCurrentFloor');
  const hudSpeed = document.getElementById('hudSpeedGauge');
  const hudStatus = document.getElementById('hudLiftStatus');
  const hudLoad = document.getElementById('hudCabinLoad');
  const carDisplay = document.getElementById('simCarFloorText');

  if (!car || !cable) return;

  // Floor heights as percentage from shaft bottom (0 to 5)
  // Floors: G (0), 1 (1), 2 (2), 3 (3), 4 (4), PH (5)
  const floorPositions = {
    0: { bottomPct: 3, label: 'G (Ground)', short: 'G', cableHeight: '88%' },
    1: { bottomPct: 21, label: 'Floor 1', short: 'L1', cableHeight: '72%' },
    2: { bottomPct: 40, label: 'Floor 2', short: 'L2', cableHeight: '54%' },
    3: { bottomPct: 59, label: 'Floor 3', short: 'L3', cableHeight: '36%' },
    4: { bottomPct: 76, label: 'Floor 4', short: 'L4', cableHeight: '19%' },
    5: { bottomPct: 88, label: 'Penthouse', short: 'PH', cableHeight: '6%' }
  };

  let currentFloor = 0;
  let isMoving = false;
  let moveInterval = null;

  function moveToFloor(targetFloor) {
    if (targetFloor === currentFloor || isMoving) return;

    isMoving = true;
    const direction = targetFloor > currentFloor ? 'UP' : 'DOWN';
    const targetData = floorPositions[targetFloor];

    // Update Button States
    floorButtons.forEach(btn => {
      const btnFloor = parseInt(btn.dataset.floor, 10);
      btn.classList.toggle('active', btnFloor === targetFloor);
    });

    // Update Status to Accelerating
    if (hudStatus) {
      hudStatus.textContent = `TRAVELING ${direction}`;
      hudStatus.style.color = '#0284C7';
    }

    // Animate Speed Gauge smoothly
    let currentSpeed = 0.0;
    const maxSpeed = 1.75; // m/s
    clearInterval(moveInterval);

    moveInterval = setInterval(() => {
      if (currentSpeed < maxSpeed) {
        currentSpeed = Math.min(maxSpeed, currentSpeed + 0.35);
        if (hudSpeed) hudSpeed.textContent = `${currentSpeed.toFixed(2)} m/s`;
      }
    }, 120);

    // Apply Mechanical Car & Cable Movement
    car.style.bottom = `${targetData.bottomPct}%`;
    cable.style.height = targetData.cableHeight;

    // Mid-flight floor display update
    setTimeout(() => {
      if (carDisplay) carDisplay.textContent = targetData.short;
      if (hudFloor) hudFloor.textContent = targetData.label;

      // Update Floor markers
      floorMarkerLabels.forEach(marker => {
        marker.classList.toggle('active', parseInt(marker.dataset.floor, 10) === targetFloor);
      });
    }, 600);

    // Arrival & Leveling
    setTimeout(() => {
      clearInterval(moveInterval);
      if (hudSpeed) hudSpeed.textContent = '0.00 m/s';
      if (hudStatus) {
        hudStatus.textContent = 'DOORS LEVEL / SAFE';
        hudStatus.style.color = '#10B981';
      }

      // Randomize simulated passenger load slightly for realism
      if (hudLoad) {
        const randomLoad = Math.floor(280 + Math.random() * 260);
        const randomPax = Math.floor(randomLoad / 70);
        hudLoad.textContent = `${randomLoad} kg (${randomPax} Pax)`;
      }

      currentFloor = targetFloor;
      isMoving = false;
    }, 1300);
  }

  // Attach click events to floor buttons
  floorButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = parseInt(btn.dataset.floor, 10);
      moveToFloor(target);
    });
  });

  // Optional: Auto demo preview after 3 seconds if user hasn't clicked
  let autoTimer = setTimeout(() => {
    if (!isMoving && currentFloor === 0) {
      moveToFloor(3);
    }
  }, 4500);

  floorButtons.forEach(btn => {
    btn.addEventListener('click', () => clearTimeout(autoTimer), { once: true });
  });
}

/* ==========================================================================
   2. LIVE REACTIVE LIFT & CABIN CONFIGURATOR
   ========================================================================== */
function initConfigurator() {
  if (!document.getElementById('configurator')) return;

  const configState = {
    application: 'home', // 'home', 'passenger', 'hospital', 'goods', 'auto', 'dumbwaiter'
    floors: 3,
    capacity: 6,
    finish: 'gold', // 'steel', 'gold', 'glass', 'etched'
    drive: 'mrl'
  };

  // Application Presets Database
  const appPresets = {
    home: {
      name: 'Bespoke Villa Home Lift',
      baseShaftW: 1350,
      baseShaftD: 1400,
      basePit: 300,
      baseOverhead: 3400,
      speed: '0.40 - 0.75 m/s',
      motorKW: '2.2 - 3.7 kW PMSM Gearless',
      basePriceLakhs: 8.5,
      capacityLabel: '4 - 8 Persons (300 - 600 kg)'
    },
    passenger: {
      name: 'High-Rise Passenger Elevator',
      baseShaftW: 1800,
      baseShaftD: 1850,
      basePit: 1400,
      baseOverhead: 4200,
      speed: '1.00 - 2.50 m/s',
      motorKW: '5.5 - 11 kW Gearless PMSM',
      basePriceLakhs: 11.0,
      capacityLabel: '6 - 15 Persons (450 - 1020 kg)'
    },
    hospital: {
      name: 'Hospital Stretcher Elevator',
      baseShaftW: 2100,
      baseShaftD: 2800,
      basePit: 1500,
      baseOverhead: 4400,
      speed: '1.00 - 1.50 m/s (Jerk-Free)',
      motorKW: '11 - 15 kW Heavy Duty',
      basePriceLakhs: 14.5,
      capacityLabel: '15 - 26 Persons / Stretcher (1020 - 2000 kg)'
    },
    goods: {
      name: 'Industrial Goods & Freight Lift',
      baseShaftW: 2400,
      baseShaftD: 3000,
      basePit: 1600,
      baseOverhead: 4500,
      speed: '0.50 - 1.00 m/s',
      motorKW: '11 - 22 kW High-Torque',
      basePriceLakhs: 13.0,
      capacityLabel: '1000 - 5000 kg Material Load'
    },
    auto: {
      name: 'Automobile & Showroom Car Lift',
      baseShaftW: 3200,
      baseShaftD: 6200,
      basePit: 1800,
      baseOverhead: 4800,
      speed: '0.25 - 0.50 m/s Hydraulic/Traction',
      motorKW: '18.5 - 30 kW Hydraulic/Traction',
      basePriceLakhs: 22.0,
      capacityLabel: '2500 - 4000 kg (SUVs & Sedans)'
    },
    dumbwaiter: {
      name: 'Commercial Pantry Dumbwaiter',
      baseShaftW: 950,
      baseShaftD: 950,
      basePit: 200,
      baseOverhead: 2800,
      speed: '0.35 - 0.50 m/s',
      motorKW: '0.75 - 1.5 kW Compact Motor',
      basePriceLakhs: 3.5,
      capacityLabel: '50 - 250 kg Food & Supplies'
    }
  };

  const finishNames = {
    steel: 'Hairline Stainless Steel (SS 304)',
    gold: 'Imperial Titanium Champagne Gold',
    glass: '360° Frameless Panoramic Glass',
    etched: 'Designer Acoustic Mirror Etched'
  };

  // DOM Elements
  const appPills = document.querySelectorAll('[data-config-app]');
  const finishSwatches = document.querySelectorAll('[data-config-finish]');
  const floorsRange = document.getElementById('cfgFloorsRange');
  const floorsVal = document.getElementById('cfgFloorsValue');
  const capacityRange = document.getElementById('cfgCapacityRange');
  const capacityVal = document.getElementById('cfgCapacityValue');

  // Output Elements
  const outLiftType = document.getElementById('outLiftType');
  const outShaftDim = document.getElementById('outShaftDim');
  const outPitDepth = document.getElementById('outPitDepth');
  const outOverhead = document.getElementById('outOverhead');
  const outSpeed = document.getElementById('outSpeed');
  const outMotor = document.getElementById('outMotor');
  const outFinish = document.getElementById('outFinish');
  const outEstPrice = document.getElementById('outEstPrice');
  const btnExportWhatsapp = document.getElementById('btnExportWhatsapp');

  function calculateAndRender() {
    const preset = appPresets[configState.application];
    const floorFactor = (configState.floors - 2) * 0.45;
    const capacityFactor = (configState.capacity - 4) * 45;

    // Calculated shaft width and depth
    const shaftW = preset.baseShaftW + Math.round(capacityFactor * 0.6);
    const shaftD = preset.baseShaftD + Math.round(capacityFactor * 0.8);
    const pit = preset.basePit;
    const overhead = preset.baseOverhead;

    // Price calculation in Lakhs INR (approx architectural guide)
    const finishAdder = configState.finish === 'gold' ? 1.2 : configState.finish === 'glass' ? 2.5 : configState.finish === 'etched' ? 0.9 : 0;
    const estLakhsMin = (preset.basePriceLakhs + floorFactor + finishAdder).toFixed(1);
    const estLakhsMax = (parseFloat(estLakhsMin) + 2.5).toFixed(1);

    // Update DOM
    if (outLiftType) outLiftType.textContent = preset.name;
    if (outShaftDim) outShaftDim.textContent = `${shaftW} mm (W) × ${shaftD} mm (D)`;
    if (outPitDepth) outPitDepth.textContent = `${pit} mm`;
    if (outOverhead) outOverhead.textContent = `${overhead} mm`;
    if (outSpeed) outSpeed.textContent = preset.speed;
    if (outMotor) outMotor.textContent = preset.motorKW;
    if (outFinish) outFinish.textContent = finishNames[configState.finish];
    if (outEstPrice) outEstPrice.textContent = `₹${estLakhsMin}L - ₹${estLakhsMax}L*`;

    // Format WhatsApp Export Link
    if (btnExportWhatsapp) {
      const waText = `Hello ERIS-NEXA Elevators, I configured an elevator on your website:%0A%0A` +
        `• *Application:* ${preset.name}%0A` +
        `• *Floors:* ${configState.floors} Stops (G+${configState.floors - 1})%0A` +
        `• *Capacity:* ${configState.capacity} Persons (${configState.capacity * 68} kg)%0A` +
        `• *Cabin Finish:* ${finishNames[configState.finish]}%0A` +
        `• *Est. Shaft Required:* ${shaftW} × ${shaftD} mm%0A` +
        `• *Est. Price Range:* ₹${estLakhsMin}L - ₹${estLakhsMax}L%0A%0A` +
        `Please provide a formal technical quotation and site survey feasibility.`;
      btnExportWhatsapp.href = `https://wa.me/919557761198?text=${waText}`;
    }
  }

  // Application Pills Click
  appPills.forEach(pill => {
    pill.addEventListener('click', () => {
      appPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      configState.application = pill.dataset.configApp;
      calculateAndRender();
    });
  });

  // Finish Swatches Click
  finishSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      finishSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      configState.finish = swatch.dataset.configFinish;
      calculateAndRender();
    });
  });

  // Floors Slider
  if (floorsRange) {
    floorsRange.addEventListener('input', (e) => {
      configState.floors = parseInt(e.target.value, 10);
      if (floorsVal) floorsVal.textContent = `${configState.floors} Stops (G+${configState.floors - 1})`;
      calculateAndRender();
    });
  }

  // Capacity Slider
  if (capacityRange) {
    capacityRange.addEventListener('input', (e) => {
      configState.capacity = parseInt(e.target.value, 10);
      if (capacityVal) capacityVal.textContent = `${configState.capacity} Persons (${configState.capacity * 68} kg)`;
      calculateAndRender();
    });
  }

  // Initial Calculation
  calculateAndRender();
}

/* ==========================================================================
   3. PRODUCT PORTFOLIO FILTERING & SPECIFICATION MODALS
   ========================================================================== */
function initProductFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  if (!filterBtns.length || !productCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.dataset.filter;

      productCards.forEach(card => {
        const category = card.dataset.category;
        if (filterValue === 'all' || category === filterValue || card.dataset.tags?.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInCard 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   4. MEDIA LIGHTBOX & VIDEO PLAYER MODAL
   ========================================================================== */
function initMediaLightbox() {
  const lightboxDialog = document.getElementById('mediaLightbox');
  const lightboxContainer = document.getElementById('lightboxContainer');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const videoCards = document.querySelectorAll('[data-video-src]');
  const galleryItems = document.querySelectorAll('[data-gallery-img]');

  if (!lightboxDialog || !lightboxContainer) return;

  // Video Card Click
  videoCards.forEach(card => {
    card.addEventListener('click', () => {
      const src = card.dataset.videoSrc;
      const title = card.dataset.videoTitle || 'ERIS-NEXA Elevator in Motion';

      lightboxContainer.innerHTML = `
        <video src="${src}" controls autoplay playsinline style="max-width: 100%; max-height: 70vh; border-radius: 8px;">
          Your browser does not support HTML5 video.
        </video>
      `;
      if (lightboxTitle) lightboxTitle.textContent = title;
      lightboxDialog.showModal();
    });
  });

  // Photo Gallery Click
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.dataset.galleryImg;
      const title = item.dataset.galleryTitle || 'Installation Showcase';

      lightboxContainer.innerHTML = `
        <img src="${src}" alt="${title}" style="max-width: 100%; max-height: 70vh; border-radius: 8px; object-fit: contain;">
      `;
      if (lightboxTitle) lightboxTitle.textContent = title;
      lightboxDialog.showModal();
    });
  });

  // Stop video playback when lightbox is closed
  lightboxDialog.addEventListener('close', () => {
    lightboxContainer.innerHTML = '';
  });
}

/* ==========================================================================
   5. ACCESSIBLE MODALS & DIALOG LIGHT DISMISS (Modern Web Guidance)
   ========================================================================== */
function initModalsAndDialogs() {
  const dialogs = document.querySelectorAll('dialog');
  const openModalButtons = document.querySelectorAll('[data-open-modal]');
  const quoteModal = document.getElementById('quoteModal');
  const quoteForm = document.getElementById('quoteForm');

  // Modern Web Guidance: Implement fallback for browsers that don't support closedby
  dialogs.forEach(dialog => {
    // Check for native closedby support
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      dialog.addEventListener('click', (event) => {
        if (event.target !== dialog) return;

        const rect = dialog.getBoundingClientRect();
        const isDialogContent = (
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width
        );

        if (!isDialogContent) {
          dialog.close();
        }
      });
    }

    // Modal Close Button handler
    const closeBtn = dialog.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => dialog.close());
    }
  });

  // Deep link query parameter check (e.g. ?openModal=1)
  if (new URLSearchParams(window.location.search).get('openModal') === '1') {
    quoteModal?.showModal();
  }

  // Buttons that trigger quote modal with pre-selected requirement
  openModalButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const service = btn.dataset.service;
      if (quoteModal) {
        if (service) {
          const reqSelect = document.getElementById('modalRequirement');
          if (reqSelect) reqSelect.value = service;
        }
        quoteModal.showModal();
      }
    });
  });

  // Handle Multi-Step Quote Submission to WhatsApp
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(quoteForm);
      const name = formData.get('name') || 'Valued Client';
      const phone = formData.get('phone') || '';
      const email = formData.get('email') || '';
      const city = formData.get('city') || 'Gurgaon';
      const building = formData.get('building_type') || 'Residential';
      const requirement = formData.get('requirement') || 'Passenger Elevator';
      const message = formData.get('message') || '';

      const waMessage = `*NEW CONSULTATION REQUEST — ERIS-NEXA*%0A%0A` +
        `• *Client Name:* ${name}%0A` +
        `• *Phone:* ${phone}%0A` +
        `• *Email:* ${email}%0A` +
        `• *City / Location:* ${city}%0A` +
        `• *Building Type:* ${building}%0A` +
        `• *Requirement:* ${requirement}%0A` +
        (message ? `• *Message:* ${message}%0A` : '') +
        `%0A_Sent via ERIS-NEXA Official Website_`;

      // Open WhatsApp with populated payload
      window.open(`https://wa.me/919557761198?text=${waMessage}`, '_blank', 'noopener,noreferrer');

      // Close modal & reset form
      if (quoteModal) quoteModal.close();
      quoteForm.reset();
      alert('Thank you! Your elevator consultation inquiry has been forwarded directly to our engineering team on WhatsApp.');
    });
  }
}

/* ==========================================================================
   6. NAVIGATION & SCROLL OBSERVERS
   ========================================================================== */
function initNavigation() {
  const navbar = document.querySelector('.navbar, .site-header');
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const topScrollBtn = document.getElementById('btnBackToTop');

  // Sticky Navbar Scroll Listener
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
      topScrollBtn?.classList.add('visible');
    } else {
      navbar?.classList.remove('scrolled');
      topScrollBtn?.classList.remove('visible');
    }
  });

  // Mobile Menu Drawer Toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('open', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';

      if (isOpen && navbar) {
        const rect = navbar.getBoundingClientRect();
        const topOffset = Math.max(0, Math.round(rect.bottom));
        document.documentElement.style.setProperty('--nav-drawer-top', `${topOffset}px`);
      }
    });

    // Close mobile menu on link click
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Reset when resizing back to desktop screen (> 1140px)
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1140 && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // Scroll to Top
  if (topScrollBtn) {
    topScrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   7. ARCHITECTURAL FAQ ACCORDION
   ========================================================================== */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherAns = otherItem.querySelector('.faq-answer');
          if (otherAns) otherAns.style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        answer.style.maxHeight = `${answer.scrollHeight + 20}px`;
      }
    });
  });
}
