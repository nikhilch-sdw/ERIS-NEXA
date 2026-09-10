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
  initProductSlider();
  initMediaLightbox();
  initMediaFilterTabs();
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
      capacityLabel: '3 - 4 Persons (250 - 320 kg)'
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
      capacityLabel: '13 - 26 Persons / Stretcher (1020 - 2000 kg)'
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
      capacityLabel: '500 - 6000 kg Material Load'
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
   3B. PRODUCT MEDIA SLIDER (PHOTOS & VIDEOS)
   ========================================================================== */
function initProductSlider() {
  const sliderModal = document.getElementById('productSliderModal');
  if (!sliderModal) return;

  const titleEl = document.getElementById('prodSliderTitle');
  const badgeEl = document.getElementById('prodSliderBadge');
  const tabPhotos = document.getElementById('tabProdPhotos');
  const tabVideos = document.getElementById('tabProdVideos');
  const photosCountEl = document.getElementById('prodPhotosCount');
  const videosCountEl = document.getElementById('prodVideosCount');
  const counterEl = document.getElementById('prodSliderCounter');
  const captionEl = document.getElementById('prodSliderCaption');
  const trackEl = document.getElementById('prodSliderTrack');
  const thumbBarEl = document.getElementById('prodSliderThumbBar');
  const specsEl = document.getElementById('prodSliderSpecs');
  const btnPrev = document.getElementById('btnProdSliderPrev');
  const btnNext = document.getElementById('btnProdSliderNext');
  const btnClose = document.getElementById('btnProdSliderClose');
  const btnQuote = document.getElementById('btnProdSliderQuote');
  const btnWhatsapp = document.getElementById('btnProdSliderWhatsapp');
  const stageWrap = sliderModal.querySelector('.prod-slider-stage-wrap');
  const productCards = document.querySelectorAll('.product-card');

  const productMediaData = {
    passenger: {
      title: 'Luxury Passenger Elevators',
      category: '01 / PASSENGER',
      tagline: 'Commercial towers & residential complexes',
      specs: ['6 to 26 Pax', 'Up to 2.50 m/s', 'PMSM Gearless', 'IS 14665 & 17900'],
      enquiryService: 'Passenger Elevators',
      waText: 'Hello ERIS-NEXA, I would like a technical quote for Luxury Passenger Elevators.',
      slides: [
        { type: 'image', src: 'assets/lift/passenger-elevators/photos/WhatsApp Image 2026-09-10 at 10.51.41 AM.jpeg', title: 'Mirror Stainless Steel Luxury Cabin', caption: 'High-end SS 304 mirror finish with integrated LED spotlight canopy' },
        { type: 'video', src: 'assets/lift/passenger-elevators/videos/elevator-product-showcase.mp4', poster: 'assets/lift/passenger-elevators/photos/WhatsApp Image 2026-09-10 at 10.51.41 AM.jpeg', title: 'High-Speed Gearless Ride in Action', caption: 'Whisper-quiet PMSM gearless drive operating smoothly' },
        { type: 'image', src: 'assets/lift/passenger-elevators/photos/WhatsApp Image 2026-09-10 at 10.51.40 AM (2).jpeg', title: 'Gold Framed Automated Glass Entrance', caption: 'Premium Italian marble entrance lobby with gold finished glass doors' },
        { type: 'image', src: 'assets/lift/passenger-elevators/photos/WhatsApp Image 2026-09-10 at 10.51.41 AM (1).jpeg', title: 'Rose Gold Titanium Cabin Interior', caption: 'Designer titanium mirror etched panels with full-height illumination' },
        { type: 'image', src: 'assets/lift/passenger-elevators/photos/WhatsApp Image 2026-09-10 at 10.51.40 AM.jpeg', title: 'Commercial Lobby Landing Station', caption: 'High-traffic lobby installation with sleek architectural landing fixtures' },
        { type: 'image', src: 'assets/lift/passenger-elevators/photos/WhatsApp Image 2026-09-10 at 10.53.50 AM.jpeg', title: 'Outdoor Multi-Story Glass Tower', caption: 'Exterior panoramic passenger elevator tower with steel structure' },
        { type: 'image', src: 'assets/lift/passenger-elevators/photos/WhatsApp Image 2026-09-10 at 10.53.49 AM.jpeg', title: 'Panoramic External Hoistway', caption: 'Architectural outdoor glass elevator providing 360-degree views' },
        { type: 'image', src: 'assets/lift/passenger-elevators/photos/WhatsApp Image 2026-09-10 at 10.51.39 AM.jpeg', title: 'Hairline Stainless Steel Telescopic Doors', caption: 'Durable satin-finish automatic center-opening doors for high traffic' },
        { type: 'image', src: 'assets/lift/passenger-elevators/photos/WhatsApp Image 2026-09-10 at 10.51.38 AM.jpeg', title: 'Full Glass Door Granite Portal', caption: 'Luxury architectural portal with granite jambs and transparent doors' },
        { type: 'image', src: 'assets/lift/passenger-elevators/photos/WhatsApp Image 2026-09-10 at 10.51.39 AM (1).jpeg', title: 'Modern Residential Tower Landing', caption: 'Clean contemporary landing station designed for apartment complexes' },
        { type: 'image', src: 'assets/lift/passenger-elevators/photos/WhatsApp Image 2026-09-10 at 10.51.40 AM (1).jpeg', title: 'Bespoke Passenger Cabin Enclosure', caption: 'Custom engineered interior cabin with ambient lighting and safety rails' }
      ]
    },
    home: {
      title: 'Bespoke Villa Home Elevators',
      category: '02 / HOME & VILLA',
      tagline: 'Low-pit luxury mobility for penthouses & villas',
      specs: ['3 to 4 Pax', '250mm Low Pit', 'Single Phase Ready', 'Panoramic Glass'],
      enquiryService: 'Home & Villa Elevators',
      waText: 'Hello ERIS-NEXA, I would like a technical quote for Bespoke Villa Home Elevators.',
      slides: [
        { type: 'image', src: 'assets/lift/home-elevators/photos/WhatsApp Image 2026-09-10 at 10.49.11 AM.jpeg', title: 'Panoramic Outdoor Glass Villa Lift', caption: 'Stunning exterior glass elevator integrated seamlessly with estate architecture' },
        { type: 'video', src: 'assets/lift/home-elevators/videos/showcase-4.mp4', poster: 'assets/lift/home-elevators/photos/WhatsApp Image 2026-09-10 at 10.49.11 AM.jpeg', title: 'Villa Glass Elevator in Motion', caption: 'Pneumatic and traction villa elevator smooth vertical travel' },
        { type: 'image', src: 'assets/lift/home-elevators/photos/WhatsApp Image 2026-09-10 at 10.49.11 AM (1).jpeg', title: 'Curved Staircase Integrated Glass Cabin', caption: 'Custom engineered circular glass shaft wrapped by spiral staircase' },
        { type: 'image', src: 'assets/lift/home-elevators/photos/WhatsApp Image 2026-09-10 at 10.49.12 AM.jpeg', title: 'Compact Stairwell Steel Hoistway', caption: 'Self-supporting steel structure tailored for central stairwells with low pit requirements' },
        { type: 'video', src: 'assets/lift/home-elevators/videos/WhatsApp Video 2026-09-05 at 5.16.09 PM.mp4', poster: 'assets/lift/home-elevators/photos/WhatsApp Image 2026-09-10 at 10.45.55 AM.jpeg', title: 'Live Villa Elevator Commissioning', caption: 'Site verification and jerk-free landing demonstration' },
        { type: 'image', src: 'assets/lift/home-elevators/photos/WhatsApp Image 2026-09-10 at 10.45.55 AM.jpeg', title: 'Bespoke Villa Multi-Landing Station', caption: 'Precision engineered landing station with secure entry gates' }
      ]
    },
    hospital: {
      title: 'Hospital & Stretcher Elevators',
      category: '03 / HEALTHCARE',
      tagline: 'Jerk-free bed transit with medical SS 304 cabin',
      specs: ['13 to 26 Pax', 'Code Blue Priority', 'Stretcher Leveling (±2mm)', 'Antibacterial SS 304'],
      enquiryService: 'Hospital Elevators',
      waText: 'Hello ERIS-NEXA, I would like a technical quote for Hospital & Stretcher Elevators.',
      slides: [
        { type: 'image', src: 'assets/lift/hospital-elevators/photos/hospital-cover.jpeg', title: 'Dual Bed Hospital Elevator', caption: 'Telescopic wide-opening doors designed for hospital stretchers' },
        { type: 'video', src: 'assets/lift/hospital-elevators/videos/WhatsApp Video 2026-09-05 at 5.16.43 PM.mp4', poster: 'assets/lift/hospital-elevators/photos/WhatsApp Image 2026-09-05 at 5.15.49 PM.jpeg', title: 'Jerk-Free VFD Hospital Elevator Drive', caption: 'Ultra-smooth VFD acceleration with ±2mm millimeter leveling' },
        { type: 'image', src: 'assets/lift/hospital-elevators/photos/hospital-g1.jpeg', title: 'Medical Cleanroom SS Interior', caption: 'Antibacterial SS 304 wall panels and heavy-duty bumper rails' },
        { type: 'image', src: 'assets/lift/hospital-elevators/photos/gallery-4.jpeg', title: 'Code Blue Emergency Recall Landing', caption: 'Priority override integration for critical intensive care transit' }
      ]
    },
    goods: {
      title: 'Goods & Freight Elevators',
      category: '04 / INDUSTRIAL',
      tagline: 'Heavy-duty freight for factories & warehouses',
      specs: ['500 to 6,000 kg+', 'Forklift-Rated', 'Checker Plate Floor', 'Reinforced Mast'],
      enquiryService: 'Goods Freight Elevators',
      waText: 'Hello ERIS-NEXA, I would like a technical quote for Goods & Freight Elevators.',
      slides: [
        { type: 'image', src: 'assets/lift/goods-elevators/photos/WhatsApp Image 2026-09-10 at 10.45.57 AM.jpeg', title: 'Industrial Heavy Duty Enclosure', caption: 'Robust structural steel enclosure and heavy-duty gates for factory transport' },
        { type: 'video', src: 'assets/lift/goods-elevators/videos/WhatsApp Video 2026-09-05 at 5.15.44 PM.mp4', poster: 'assets/lift/goods-elevators/photos/WhatsApp Image 2026-09-10 at 10.45.57 AM.jpeg', title: 'Freight Lift Hoistway & Rigging Operation', caption: 'Heavy-duty hoistway rigging and load-bearing guide rail testing' },
        { type: 'image', src: 'assets/lift/goods-elevators/photos/WhatsApp Image 2026-09-10 at 10.45.57 AM (1).jpeg', title: 'Factory Floor Cargo Platform', caption: 'Direct pallet truck access with chequered plate non-slip base' },
        { type: 'image', src: 'assets/lift/goods-elevators/photos/WhatsApp Image 2026-09-10 at 10.45.58 AM (1).jpeg', title: 'Multi-Level Warehouse Hoistway', caption: 'Engineered structural tower with heavy-capacity guide rails and safety interlocks' }
      ]
    },
    auto: {
      title: 'Automobile & Showroom Lifts',
      category: '05 / AUTOMOBILE',
      tagline: 'High-load vehicular lifts for showrooms & multi-level parking',
      specs: ['3,000 to 4,500 kg', '2.8 × 5.8m Platform', 'SUV & Sedan Rated', 'Dual Operation Stations'],
      enquiryService: 'Automobile Car Lifts',
      waText: 'Hello ERIS-NEXA, I would like a technical quote for Automobile Car Lifts.',
      slides: [
        { type: 'image', src: 'assets/lift/automobile-elevators/photos/WhatsApp Image 2026-09-10 at 10.45.58 AM.jpeg', title: 'Showroom Automobile Lift Platform', caption: 'Heavy-duty vehicle platform with anti-slip flooring and recessed ceiling lights' },
        { type: 'video', src: 'assets/lift/automobile-elevators/videos/WhatsApp Video 2026-09-05 at 5.17.44 PM.mp4', poster: 'assets/lift/automobile-elevators/photos/WhatsApp Image 2026-09-10 at 10.45.58 AM.jpeg', title: 'Automotive Lift Ascent & Leveling', caption: 'Smooth hydraulic and traction lift transport for premium vehicles' },
        { type: 'video', src: 'assets/lift/automobile-elevators/videos/showcase-1.mp4', poster: 'assets/lift/automobile-elevators/photos/WhatsApp Image 2026-09-10 at 10.45.58 AM.jpeg', title: 'Automobile Elevator Engineering Showcase', caption: 'Precision vehicle vertical transit for multi-level showrooms & parking' }
      ]
    },
    service: {
      title: 'Commercial Pantry Dumbwaiters',
      category: '06 / SERVICE',
      tagline: 'Food-grade service lifts for kitchens & laboratories',
      specs: ['50 to 250 kg', 'Food-Grade SS 304', 'Bi-Parting Shutters', 'Cleanroom Certified'],
      enquiryService: 'Pantry Dumbwaiters',
      waText: 'Hello ERIS-NEXA, I would like a technical quote for Commercial Pantry Dumbwaiters.',
      slides: [
        { type: 'image', src: 'assets/lift/dumbwaiters/photos/dumbwaiter-1.jpeg', title: 'Restaurant Pantry Dumbwaiter', caption: 'Counter-height ergonomic loading for hospitality and food service' },
        { type: 'video', src: 'assets/lift/dumbwaiters/videos/WhatsApp Video 2026-09-05 at 5.17.10 PM.mp4', poster: 'assets/lift/dumbwaiters/photos/WhatsApp Image 2026-09-05 at 5.15.48 PM (1).jpeg', title: 'Service Lift Rapid Transit', caption: 'Smooth, spill-free food, document, and glassware vertical transit' },
        { type: 'image', src: 'assets/lift/dumbwaiters/photos/dumbwaiter-g1.jpeg', title: 'Stainless Steel Bi-Parting Doors', caption: 'Food-grade interlocked bi-parting shutters for hygiene compliance' },
        { type: 'image', src: 'assets/lift/dumbwaiters/photos/dumbwaiter-g2.jpeg', title: 'Laboratory Clinical Transport', caption: 'Sterile environment transit for hospitals and medical labs' }
      ]
    },
    special: {
      title: 'Special Purpose & Glass Facades',
      category: '07 / ARCHITECTURAL',
      tagline: 'Panoramic capsule elevators with steel glass mast',
      specs: ['Panoramic Views', 'IP65 Weatherproof', 'Laminated Glass', 'Custom Mast Sizing'],
      enquiryService: 'Special Purpose Elevators',
      waText: 'Hello ERIS-NEXA, I would like a technical quote for Panoramic Glass Elevators.',
      slides: [
        { type: 'image', src: 'assets/lift/special-elevators/photos/special-cover.jpeg', title: 'Panoramic Glass Capsule Elevator', caption: 'Iconic curved exterior glass capsule for modern architecture' },
        { type: 'video', src: 'assets/lift/special-elevators/videos/showcase-6.mp4', poster: 'assets/lift/special-elevators/photos/video-poster-6.jpg', title: 'Outdoor Glass Facade Lift in Motion', caption: 'Weatherproof high-travel exterior glass lift for commercial facades' },
        { type: 'image', src: 'assets/lift/special-elevators/photos/glass-outdoor-1.jpeg', title: 'External Steel Framework Shaft', caption: 'Self-supporting steel and glass framework engineered by ERIS-NEXA' },
        { type: 'image', src: 'assets/lift/special-elevators/photos/special-g1.jpeg', title: 'Bespoke Capsule Cabins', caption: 'Custom engineered geometry to complement building exterior' }
      ]
    }
  };

  let activeProduct = null;
  let activeTab = 'photos'; // 'photos' or 'videos'
  let activeSlideIdx = 0;

  function getMediaList(product, tab) {
    if (!product || !product.slides) return [];
    if (tab === 'videos') {
      return product.slides.filter(s => s.type === 'video');
    }
    return product.slides.filter(s => s.type === 'image');
  }

  function pauseAllVideos() {
    if (!trackEl) return;
    const videos = trackEl.querySelectorAll('video');
    videos.forEach(v => {
      try {
        v.pause();
      } catch (err) {}
    });
  }

  function renderSlide(idx) {
    const currentItems = getMediaList(activeProduct, activeTab);
    if (!currentItems || !currentItems.length) return;

    activeSlideIdx = (idx + currentItems.length) % currentItems.length;
    const slide = currentItems[activeSlideIdx];

    // Pause any previously playing videos
    pauseAllVideos();

    // Toggle active slide in track
    const slideEls = trackEl.querySelectorAll('.prod-slider-slide');
    slideEls.forEach((el, i) => {
      if (i === activeSlideIdx) {
        el.classList.add('active');
        if (slide.type === 'video') {
          const video = el.querySelector('video');
          if (video) {
            video.currentTime = 0;
            video.play().catch(() => {});
          }
        }
      } else {
        el.classList.remove('active');
      }
    });

    // Update thumbnails active state
    if (thumbBarEl) {
      const thumbEls = thumbBarEl.querySelectorAll('.prod-slider-thumb-item');
      thumbEls.forEach((el, i) => {
        if (i === activeSlideIdx) {
          el.classList.add('active');
          el.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
        } else {
          el.classList.remove('active');
        }
      });
    }

    // Update Counter
    if (counterEl) {
      counterEl.textContent = `${activeSlideIdx + 1} / ${currentItems.length}`;
    }

    // Update Caption
    if (captionEl) {
      captionEl.textContent = `${slide.title} — ${slide.caption}`;
    }
  }

  function switchTab(tab, slideIdx = 0) {
    pauseAllVideos();
    activeTab = tab;

    // Update Tab UI state in modal header
    if (tabPhotos && tabVideos) {
      if (activeTab === 'photos') {
        tabPhotos.classList.add('active');
        tabPhotos.setAttribute('aria-selected', 'true');
        tabVideos.classList.remove('active');
        tabVideos.setAttribute('aria-selected', 'false');
      } else {
        tabVideos.classList.add('active');
        tabVideos.setAttribute('aria-selected', 'true');
        tabPhotos.classList.remove('active');
        tabPhotos.setAttribute('aria-selected', 'false');
      }
    }

    const currentItems = getMediaList(activeProduct, activeTab);

    // Populate Slides in Track
    if (trackEl) {
      if (!currentItems.length) {
        trackEl.innerHTML = `<div class="prod-slider-empty" style="color: #94A3B8; font-size: 0.9rem; padding: 2rem;">No ${activeTab} available.</div>`;
      } else {
        trackEl.innerHTML = currentItems.map((s, idx) => {
          if (s.type === 'video') {
            return `
              <div class="prod-slider-slide ${idx === slideIdx ? 'active' : ''}" data-type="video">
                <video src="${s.src}" ${s.poster ? `poster="${s.poster}"` : ''} controls playsinline preload="metadata">
                  Your browser does not support HTML5 video.
                </video>
              </div>
            `;
          } else {
            return `
              <div class="prod-slider-slide ${idx === slideIdx ? 'active' : ''}" data-type="image">
                <img src="${s.src}" alt="${s.title}" draggable="false" loading="eager">
              </div>
            `;
          }
        }).join('');
      }
    }

    // Populate Thumbnails
    if (thumbBarEl) {
      thumbBarEl.innerHTML = currentItems.map((s, idx) => {
        const thumbSrc = s.type === 'video' && s.poster ? s.poster : s.src;
        return `
          <button type="button" class="prod-slider-thumb-item ${idx === slideIdx ? 'active' : ''}"
            data-slide-index="${idx}" aria-label="${activeTab === 'videos' ? 'Video' : 'Photo'} ${idx + 1}: ${s.title}">
            <img src="${thumbSrc}" alt="${s.title}" loading="lazy">
            ${s.type === 'video' ? '<span class="prod-slider-thumb-play"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3" /></svg></span>' : ''}
          </button>
        `;
      }).join('');

      // Wire thumbnail clicks
      const thumbs = thumbBarEl.querySelectorAll('.prod-slider-thumb-item');
      thumbs.forEach(t => {
        t.addEventListener('click', (e) => {
          e.stopPropagation();
          const targetIdx = parseInt(t.dataset.slideIndex, 10);
          renderSlide(targetIdx);
        });
      });
    }

    // Render target slide
    renderSlide(slideIdx);
  }

  function openProductSlider(productId, requestedTab = 'photos') {
    const data = productMediaData[productId];
    if (!data) return;

    activeProduct = data;

    // Set Header
    if (titleEl) titleEl.textContent = data.title;
    if (badgeEl) badgeEl.textContent = data.category;

    // Set Specs
    if (specsEl) {
      specsEl.innerHTML = data.specs
        .map(spec => `<span class="prod-slider-spec-pill">${spec}</span>`)
        .join('');
    }

    // Set Action Buttons
    if (btnQuote) {
      btnQuote.dataset.service = data.enquiryService;
    }
    if (btnWhatsapp) {
      btnWhatsapp.href = `https://wa.me/919557761198?text=${encodeURIComponent(data.waText)}`;
    }

    // Update Counts on the two tabs
    const photosList = data.slides.filter(s => s.type === 'image');
    const videosList = data.slides.filter(s => s.type === 'video');
    if (photosCountEl) photosCountEl.textContent = photosList.length;
    if (videosCountEl) videosCountEl.textContent = videosList.length;

    // Decide initial tab: default to requestedTab, fallback if empty
    let initialTab = requestedTab;
    if (initialTab === 'videos' && videosList.length === 0) {
      initialTab = 'photos';
    } else if (initialTab === 'photos' && photosList.length === 0 && videosList.length > 0) {
      initialTab = 'videos';
    }

    // Switch to initial tab and slide 0
    switchTab(initialTab, 0);

    // Open Modal
    sliderModal.showModal();
  }

  function closeSlider() {
    pauseAllVideos();
    sliderModal.close();
  }

  // Modal Tab Header Listeners
  if (tabPhotos) {
    tabPhotos.addEventListener('click', (e) => {
      e.stopPropagation();
      if (activeTab !== 'photos') {
        switchTab('photos', 0);
      }
    });
  }

  if (tabVideos) {
    tabVideos.addEventListener('click', (e) => {
      e.stopPropagation();
      if (activeTab !== 'videos') {
        switchTab('videos', 0);
      }
    });
  }

  // Hook product cards
  productCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Ignore if user clicked inside the card footer (Get Enquiry, WhatsApp Quote)
      if (e.target.closest('.product-card-footer')) {
        return;
      }

      const prodId = card.dataset.productId || card.dataset.category;
      if (!prodId || !productMediaData[prodId]) return;

      const photoBtn = e.target.closest('[data-action="open-photos"]');
      const videoBtn = e.target.closest('[data-action="open-videos"]');

      if (videoBtn) {
        e.stopPropagation();
        openProductSlider(prodId, 'videos');
      } else if (photoBtn) {
        e.stopPropagation();
        openProductSlider(prodId, 'photos');
      } else {
        openProductSlider(prodId, 'photos');
      }
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.closest('.product-card-footer')) return;
        const prodId = card.dataset.productId || card.dataset.category;
        if (!prodId || !productMediaData[prodId]) return;

        const photoBtn = e.target.closest('[data-action="open-photos"]');
        const videoBtn = e.target.closest('[data-action="open-videos"]');

        e.preventDefault();
        if (videoBtn) {
          openProductSlider(prodId, 'videos');
        } else {
          openProductSlider(prodId, 'photos');
        }
      }
    });
  });

  // Nav Arrows
  if (btnPrev) {
    btnPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      renderSlide(activeSlideIdx - 1);
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', (e) => {
      e.stopPropagation();
      renderSlide(activeSlideIdx + 1);
    });
  }

  // Close Button
  if (btnClose) {
    btnClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeSlider();
    });
  }

  // Quote Button in Slider Modal
  if (btnQuote) {
    btnQuote.addEventListener('click', () => {
      const service = btnQuote.dataset.service;
      closeSlider();
      const quoteModal = document.getElementById('quoteModal');
      if (quoteModal) {
        if (service) {
          const reqSelect = document.getElementById('modalRequirement');
          if (reqSelect) reqSelect.value = service;
        }
        quoteModal.showModal();
      }
    });
  }

  // Pause on dialog close event
  sliderModal.addEventListener('close', () => {
    pauseAllVideos();
  });

  // Keyboard navigation
  sliderModal.addEventListener('keydown', (e) => {
    if (!sliderModal.open) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      renderSlide(activeSlideIdx - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      renderSlide(activeSlideIdx + 1);
    } else if (e.key === 'Escape') {
      closeSlider();
    }
  });

  // Touch Swipe for Mobile
  if (stageWrap) {
    let touchX = 0;
    let touchY = 0;

    stageWrap.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchX = e.touches[0].clientX;
        touchY = e.touches[0].clientY;
      }
    }, { passive: true });

    stageWrap.addEventListener('touchend', (e) => {
      if (e.changedTouches.length === 1) {
        const deltaX = e.changedTouches[0].clientX - touchX;
        const deltaY = e.changedTouches[0].clientY - touchY;
        if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
          if (deltaX < 0) {
            renderSlide(activeSlideIdx + 1);
          } else {
            renderSlide(activeSlideIdx - 1);
          }
        }
      }
    }, { passive: true });
  }
}

/* ==========================================================================
   4. MEDIA LIGHTBOX & VIDEO PLAYER MODAL
   ========================================================================== */
function initMediaLightbox() {
  const lightboxDialog = document.getElementById('mediaLightbox');
  if (!lightboxDialog) return;

  const modalCard = lightboxDialog.querySelector('.lightbox-modal-card');
  const lightboxContainer = document.getElementById('lightboxContainer');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxZoomVal = document.getElementById('lightboxZoomVal');
  const btnZoomIn = document.getElementById('btnZoomIn');
  const btnZoomOut = document.getElementById('btnZoomOut');
  const btnZoomReset = document.getElementById('btnZoomReset');
  const btnPrev = document.getElementById('btnLightboxPrev');
  const btnNext = document.getElementById('btnLightboxNext');
  const btnClose = document.getElementById('btnLightboxClose');
  const videoCards = document.querySelectorAll('[data-video-src]');
  const galleryCards = document.querySelectorAll('[data-gallery-img]');

  if (!lightboxContainer) return;

  function getActiveGalleryItems() {
    const allCards = Array.from(document.querySelectorAll('[data-gallery-img]'));
    const visibleCards = allCards.filter(card => {
      return card.style.display !== 'none' && !card.classList.contains('filtered-out');
    });
    const targetCards = visibleCards.length > 0 ? visibleCards : allCards;
    return targetCards.map(card => ({
      src: card.dataset.galleryImg,
      title: card.dataset.galleryTitle || 'Installation Showcase'
    }));
  }

  let currentGalleryIndex = -1;
  let isVideoMode = false;
  let zoomScale = 1.0;
  let panX = 0;
  let panY = 0;
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let currentImgEl = null;

  function updateTransform(withTransition = true) {
    if (!currentImgEl) return;
    if (withTransition) {
      currentImgEl.style.transition = 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)';
    } else {
      currentImgEl.style.transition = 'none';
    }
    currentImgEl.style.transform = `scale(${zoomScale}) translate(${panX}px, ${panY}px)`;
    if (lightboxZoomVal) {
      lightboxZoomVal.textContent = `${Math.round(zoomScale * 100)}%`;
    }
    if (zoomScale > 1.0) {
      currentImgEl.classList.add('is-zoomed');
    } else {
      currentImgEl.classList.remove('is-zoomed');
      panX = 0;
      panY = 0;
    }
  }

  function setZoom(newZoom) {
    zoomScale = Math.min(Math.max(newZoom, 1.0), 4.0);
    if (zoomScale === 1.0) {
      panX = 0;
      panY = 0;
    }
    updateTransform(true);
  }

  function renderGalleryImage(index) {
    const activeItems = getActiveGalleryItems();
    if (index < 0 || index >= activeItems.length) return;
    currentGalleryIndex = index;
    isVideoMode = false;
    zoomScale = 1.0;
    panX = 0;
    panY = 0;

    if (modalCard) modalCard.classList.remove('is-video');
    const item = activeItems[index];

    if (lightboxTitle) lightboxTitle.textContent = item.title;
    if (lightboxCounter) lightboxCounter.textContent = `${index + 1} / ${activeItems.length}`;
    if (lightboxZoomVal) lightboxZoomVal.textContent = '100%';

    lightboxContainer.innerHTML = `
      <img src="${item.src}" alt="${item.title}" draggable="false">
    `;

    currentImgEl = lightboxContainer.querySelector('img');

    // Double-click to toggle zoom (1x <-> 2x)
    currentImgEl.addEventListener('dblclick', (e) => {
      e.preventDefault();
      if (zoomScale > 1.0) {
        setZoom(1.0);
      } else {
        setZoom(2.0);
      }
    });

    // Mouse drag to pan when zoomed
    currentImgEl.addEventListener('mousedown', (e) => {
      if (zoomScale <= 1.0) return;
      e.preventDefault();
      isDragging = true;
      startX = e.clientX - panX * zoomScale;
      startY = e.clientY - panY * zoomScale;
      currentImgEl.classList.add('is-dragging');
    });
  }

  // Global mousemove & mouseup for panning
  window.addEventListener('mousemove', (e) => {
    if (!isDragging || !currentImgEl || zoomScale <= 1.0) return;
    panX = (e.clientX - startX) / zoomScale;
    panY = (e.clientY - startY) / zoomScale;
    updateTransform(false);
  });

  window.addEventListener('mouseup', () => {
    if (isDragging && currentImgEl) {
      isDragging = false;
      currentImgEl.classList.remove('is-dragging');
    }
  });

  // Mouse wheel zoom over the image viewport
  lightboxContainer.addEventListener('wheel', (e) => {
    if (isVideoMode || !currentImgEl) return;
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.25 : -0.25;
    setZoom(zoomScale + delta);
  }, { passive: false });

  // Gallery cards click -> open gallery mode
  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const activeItems = getActiveGalleryItems();
      const targetIndex = activeItems.findIndex(item => item.src === card.dataset.galleryImg);
      renderGalleryImage(targetIndex >= 0 ? targetIndex : 0);
      lightboxDialog.showModal();
    });
  });

  // Video cards click -> open video mode
  videoCards.forEach(card => {
    card.addEventListener('click', () => {
      isVideoMode = true;
      currentGalleryIndex = -1;
      if (modalCard) modalCard.classList.add('is-video');

      const src = card.dataset.videoSrc;
      const title = card.dataset.videoTitle || 'ERIS-NEXA Elevator in Motion';

      if (lightboxTitle) lightboxTitle.textContent = title;
      lightboxContainer.innerHTML = `
        <video src="${src}" controls autoplay playsinline style="width: 100%; height: 100%; object-fit: contain; display: block; background: #000000;">
          Your browser does not support HTML5 video.
        </video>
      `;
      lightboxDialog.showModal();
    });
  });

  // Prev / Next button clicks
  if (btnPrev) {
    btnPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      const activeItems = getActiveGalleryItems();
      if (activeItems.length === 0) return;
      const prevIdx = (currentGalleryIndex - 1 + activeItems.length) % activeItems.length;
      renderGalleryImage(prevIdx);
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', (e) => {
      e.stopPropagation();
      const activeItems = getActiveGalleryItems();
      if (activeItems.length === 0) return;
      const nextIdx = (currentGalleryIndex + 1) % activeItems.length;
      renderGalleryImage(nextIdx);
    });
  }

  // Zoom toolbar buttons
  if (btnZoomIn) {
    btnZoomIn.addEventListener('click', (e) => {
      e.stopPropagation();
      setZoom(zoomScale + 0.35);
    });
  }

  if (btnZoomOut) {
    btnZoomOut.addEventListener('click', (e) => {
      e.stopPropagation();
      setZoom(zoomScale - 0.35);
    });
  }

  if (btnZoomReset) {
    btnZoomReset.addEventListener('click', (e) => {
      e.stopPropagation();
      if (zoomScale > 1.0) {
        setZoom(1.0);
      } else {
        // If at 100%, toggle native fullscreen or expand zoom
        if (!document.fullscreenElement) {
          if (lightboxDialog.requestFullscreen) {
            lightboxDialog.requestFullscreen().catch(() => setZoom(1.5));
          } else {
            setZoom(1.5);
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
          }
        }
      }
    });
  }

  if (btnClose) {
    btnClose.addEventListener('click', () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      lightboxDialog.close();
    });
  }

  lightboxDialog.addEventListener('close', () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setZoom(1.0);
  });

  // Keyboard navigation
  lightboxDialog.addEventListener('keydown', (e) => {
    if (!lightboxDialog.open) return;
    if (isVideoMode) return;

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (btnPrev) btnPrev.click();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (btnNext) btnNext.click();
    } else if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      setZoom(zoomScale + 0.35);
    } else if (e.key === '-' || e.key === '_') {
      e.preventDefault();
      setZoom(zoomScale - 0.35);
    } else if (e.key === '0') {
      e.preventDefault();
      setZoom(1.0);
    }
  });

  // Mobile touch swipe gestures (left/right)
  let touchStartX = 0;
  let touchStartY = 0;
  lightboxContainer.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  lightboxContainer.addEventListener('touchend', (e) => {
    if (isVideoMode || zoomScale > 1.0) return;
    if (e.changedTouches.length === 1) {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0 && btnNext) {
          btnNext.click();
        } else if (diffX > 0 && btnPrev) {
          btnPrev.click();
        }
      }
    }
  }, { passive: true });

  // Reset and clean up on close
  lightboxDialog.addEventListener('close', () => {
    lightboxContainer.innerHTML = '';
    currentImgEl = null;
    zoomScale = 1.0;
    panX = 0;
    panY = 0;
    isDragging = false;
  });
}

/* ==========================================================================
   4B. INTERACTIVE MEDIA CATEGORY FILTER TABS (IMAGES & VIDEOS)
   ========================================================================== */
function initMediaFilterTabs() {
  const filterBars = document.querySelectorAll('.media-filter-bar');
  if (!filterBars.length) return;

  filterBars.forEach(bar => {
    const tabs = bar.querySelectorAll('.media-filter-tab');
    const targetSelector = bar.dataset.targetCards || '.showcase-photo-card, .video-showcase-card';
    const cards = document.querySelectorAll(targetSelector);
    if (!tabs.length || !cards.length) return;

    // Dynamically calculate and display count on tab badges
    tabs.forEach(tab => {
      const filter = tab.dataset.filter;
      const badge = tab.querySelector('.filter-tab-count');
      if (badge && filter) {
        let count = 0;
        cards.forEach(card => {
          const cat = (card.dataset.category || '').toLowerCase();
          const tags = (card.dataset.tags || '').split(',').map(t => t.trim().toLowerCase());
          const filterLower = filter.toLowerCase();
          if (filterLower === 'all' || cat === filterLower || tags.includes(filterLower)) {
            count++;
          }
        });
        badge.textContent = count;
      }
    });

    // Attach click listeners to filter tabs
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const filter = (tab.dataset.filter || 'all').toLowerCase();
        let visibleCount = 0;

        cards.forEach(card => {
          const cat = (card.dataset.category || '').toLowerCase();
          const tags = (card.dataset.tags || '').split(',').map(t => t.trim().toLowerCase());
          const isMatch = filter === 'all' || cat === filter || tags.includes(filter);

          if (isMatch) {
            card.style.display = '';
            card.classList.remove('filtered-out');
            card.classList.remove('media-card-animate-in');
            // Trigger browser reflow to restart CSS animation
            void card.offsetWidth;
            card.classList.add('media-card-animate-in');
            visibleCount++;
          } else {
            card.style.display = 'none';
            card.classList.add('filtered-out');
            card.classList.remove('media-card-animate-in');
          }
        });

        // Handle empty state notice if configured
        const emptyNoticeId = bar.dataset.emptyTarget;
        if (emptyNoticeId) {
          const emptyEl = document.getElementById(emptyNoticeId);
          if (emptyEl) {
            emptyEl.style.display = visibleCount === 0 ? 'block' : 'none';
          }
        }
      });
    });
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
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const service = btn.dataset.service;
      if (quoteModal) {
        if (service) {
          const reqSelect = document.getElementById('modalRequirement');
          if (reqSelect) {
            let matched = false;
            const target = service.toLowerCase().replace(/[^a-z0-9]/g, '');
            for (let i = 0; i < reqSelect.options.length; i++) {
              const opt = reqSelect.options[i];
              const optVal = opt.value.toLowerCase().replace(/[^a-z0-9]/g, '');
              const optText = opt.text.toLowerCase().replace(/[^a-z0-9]/g, '');
              if (optVal === target || optText === target || optVal.includes(target) || target.includes(optVal)) {
                reqSelect.selectedIndex = i;
                matched = true;
                break;
              }
            }
            if (!matched) reqSelect.value = service;
          }
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
      const name = formData.get('name') || formData.get('fullName') || 'Valued Client';
      const phone = formData.get('phone') || '';
      const email = formData.get('email') || '';
      const city = formData.get('city') || formData.get('location') || 'Gurgaon';
      const building = formData.get('building_type') || 'Residential';
      const requirement = formData.get('requirement') || 'Passenger Elevator';
      const message = formData.get('message') || '';

      const waMessage = `*NEW DIRECT ELEVATOR ENQUIRY — ERIS-NEXA*%0A%0A` +
        `• *Client Name:* ${encodeURIComponent(name)}%0A` +
        `• *Phone / WhatsApp:* ${encodeURIComponent(phone)}%0A` +
        (email ? `• *Email:* ${encodeURIComponent(email)}%0A` : '') +
        `• *City / Location:* ${encodeURIComponent(city)}%0A` +
        (building ? `• *Building Type:* ${encodeURIComponent(building)}%0A` : '') +
        `• *Elevator Requirement:* ${encodeURIComponent(requirement)}%0A` +
        (message ? `• *Project Details:* ${encodeURIComponent(message)}%0A` : '') +
        `%0A_Sent via ERIS-NEXA Official Website Direct WhatsApp Dispatch_`;

      // Open WhatsApp with populated payload
      window.open(`https://wa.me/919557761198?text=${waMessage}`, '_blank', 'noopener,noreferrer');

      // Close modal & reset form
      if (quoteModal) quoteModal.close();
      quoteForm.reset();
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
