(() => {
  /* ── CONTADOR Y AUTENTICACION DESACTIVADOS ──────────────
     Para reactivar, descomenta todo este bloque
     y comenta la línea: document.getElementById('countdownScreen')?.remove();
                         document.getElementById('lockScreen')?.remove();
  ─────────────────────────────────────────────────────── */

   var TARGET      = new Date('2026-11-10T00:00:00');
   var UNLOCK_DATE = '10/11';
   var SESSION_KEY = 'nh_unlocked';

   var countdownScreen = document.getElementById('countdownScreen');
   var lockScreen      = document.getElementById('lockScreen');
   var lockForm        = document.getElementById('lockForm');
   var lockInput       = document.getElementById('lockInput');
   var lockError       = document.getElementById('lockError');

   /* — Desbloquear página — */
   function unlock() {
     sessionStorage.setItem(SESSION_KEY, '1');
     document.body.classList.remove('is-locked');
     lockScreen.classList.add('is-unlocked');
     lockScreen.addEventListener('transitionend', function () {
       lockScreen.remove();
     }, { once: true });
   }

   /* — Mostrar pantalla de bloqueo — */
   function showLockScreen() {
     countdownScreen.remove();
     lockScreen.hidden = false;
     document.body.classList.add('is-locked');
     lockInput.addEventListener('input', function () {
       var raw = lockInput.value.replace(/\D/g, '');
       lockInput.value = raw.length > 2
         ? raw.slice(0, 2) + '/' + raw.slice(2, 4)
         : raw;
       lockInput.classList.remove('is-error');
       lockError.hidden = true;
     });
     lockForm.addEventListener('submit', function (e) {
       e.preventDefault();
       if (lockInput.value.trim() === UNLOCK_DATE) {
         unlock();
       } else {
         lockInput.classList.add('is-error');
         lockError.hidden = false;
         lockInput.value = '';
         lockInput.focus();
         lockInput.addEventListener('animationend', function () {
           lockInput.classList.remove('is-error');
         }, { once: true });
       }
     });
     lockInput.focus();
   }

  // /* — Actualizar dígitos del contador — */
   function pad(n) { return String(n).padStart(2, '0'); }
   function tick(id, value) {
     var el = document.getElementById(id);
     if (!el) return;
     var newVal = pad(value);
     if (el.textContent !== newVal) {
       el.textContent = newVal;
       el.classList.remove('tick');
       void el.offsetWidth;
       el.classList.add('tick');
       el.addEventListener('transitionend', function () {
         el.classList.remove('tick');
       }, { once: true });
     }
   }
   function updateCountdown() {
     var now  = new Date();
     var diff = TARGET - now;
     if (diff <= 0) {
       clearInterval(timer);
       if (sessionStorage.getItem(SESSION_KEY) === '1') {
         countdownScreen.remove();
       } else {
         showLockScreen();
       }
       return;
     }
     tick('cdDays',    Math.floor(diff / 86400000));
     tick('cdHours',   Math.floor((diff % 86400000) / 3600000));
     tick('cdMinutes', Math.floor((diff % 3600000)  / 60000));
     tick('cdSeconds', Math.floor((diff % 60000)    / 1000));
   }

  /* — Punto de entrada — */
   var now = new Date();
   if (now >= TARGET) {
     countdownScreen.remove();
     if (sessionStorage.getItem(SESSION_KEY) === '1') {
       lockScreen.remove();
     } else {
       showLockScreen();
     }
   } else {
     lockScreen.remove();
     document.body.classList.add('is-locked');
     updateCountdown();
     var timer = setInterval(updateCountdown, 1000);
   }

  /* — Desactivado: eliminar pantallas del DOM directamente — */
  //document.getElementById('countdownScreen')?.remove();
  //document.getElementById('lockScreen')?.remove();
  document.body.classList.remove('is-locked');

  const data = window.ANNIVERSARY_DATA || {};
  const sel  = (s, r) => (r || document).querySelector(s);
  const selAll = (s, r) => [...(r || document).querySelectorAll(s)];

  function esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function safeUrl(v) {
    return /^https?:\/\//i.test(v || '') || /^(assets\/|\.\/|\/)/i.test(v || '') ? v : '';
  }

  function ytThumb(id) {
    return 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
  }

  const media = Array.isArray(data.media) ? data.media : [];

  /* ── Menú móvil ─────────────────────────────────────── */
  const menuToggle = sel('#menuToggle');
  const mainNav    = sel('#mainNav');
  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      const open = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!open));
      menuToggle.setAttribute('aria-label', open ? 'Abrir menú' : 'Cerrar menú');
      mainNav.classList.toggle('is-open', !open);
    });
  }
  selAll('#mainNav a').forEach(function (a) {
    a.addEventListener('click', function () {
      mainNav.classList.remove('is-open');
      if (menuToggle) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menú');
      }
    });
  });

  /* ── Datos de portada ───────────────────────────────── */
  var n = data.names || {};
  var footerNames = sel('#footerNames');
  if (footerNames && n.yourName) {
    footerNames.textContent = n.yourName + ' + ' + (n.partnerName || 'yo') + ' · siempre';
  }
  var heroImg = sel('#heroImage');
  if (heroImg && data.hero && data.hero.image) heroImg.src = safeUrl(data.hero.image) || heroImg.src;

  var eyebrowEl = sel('.hero-copy .eyebrow');
  if (eyebrowEl && data.hero && data.hero.eyebrow) {
    eyebrowEl.innerHTML = '<span class="eyebrow-line"></span>' + esc(data.hero.eyebrow);
  }
  var h1El = sel('.hero h1');
  if (h1El && data.hero && data.hero.title) {
    var parts = String(data.hero.title).split(/la nuestra\.?/i);
    h1El.innerHTML = parts.length > 1 ? esc(parts[0]) + '<em>la nuestra.</em>' : esc(data.hero.title);
  }
  var ledeEl = sel('.hero-lede');
  if (ledeEl && data.hero && data.hero.subtitle) ledeEl.textContent = data.hero.subtitle;

  var capEl = sel('.hero-caption span:last-child');
  if (capEl && data.hero && data.hero.caption) capEl.textContent = data.hero.caption;

  var dreamsEl = sel('#dreamsText');
  if (dreamsEl && data.dreams) dreamsEl.textContent = data.dreams;

  /* ── Contador de días ───────────────────────────────── */
  if (data.relationshipStart && /^\d{4}-\d{2}-\d{2}$/.test(data.relationshipStart)) {
    var start = new Date(data.relationshipStart + 'T00:00:00');
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var days  = Math.floor((today - start) / 86400000);
    if (!isNaN(start.getTime()) && days >= 0) {
      var dc  = sel('#daysTogether');
      var cap = sel('#counterCaption');
      if (dc)  dc.textContent  = days.toLocaleString('es-PE');
      if (cap) cap.textContent = days === 1 ? 'día de esta historia juntos' : 'días de esta historia juntos';
    }
  }

  /* ── Render tarjeta de medio ────────────────────────── */
  function renderCard(item, index, featured) {
    var cls = 'media-card' + (featured ? ' media-card-featured' : '');
    if (item.type === 'video') {
      var thumb = item.thumbnail || ytThumb(item.videoId || '');
      return '<div class="' + cls + ' media-card-video"'
        + ' data-video-id="' + esc(item.videoId) + '"'
        + ' role="button" tabindex="0"'
        + ' aria-label="Reproducir: ' + esc(item.title) + '">'
        + '<span class="media-thumb">'
        + '<img src="' + esc(thumb) + '" alt="' + esc(item.title) + '" loading="lazy">'
        + '<span class="play-btn" aria-hidden="true">&#9654;</span>'
        + '</span>'
        + '<span class="media-meta">'
        + '<span class="media-category">' + esc(item.category || 'Video') + '</span>'
        + '<span class="media-title">' + esc(item.title) + '</span>'
        + '<span class="media-date">' + esc(item.date || '') + '</span>'
        + '</span>'
        + '</div>';
    }
    return '<button class="' + cls + ' media-card-photo"'
      + ' type="button" data-media-index="' + index + '"'
      + ' aria-label="Ver foto: ' + esc(item.title) + '">'
      + '<span class="media-thumb">'
      + '<img src="' + esc(safeUrl(item.image)) + '" alt="' + esc(item.alt || item.title) + '" loading="lazy">'
      + '<span class="photo-expand" aria-hidden="true">&#8599;</span>'
      + '</span>'
      + '<span class="media-meta">'
      + '<span class="media-category">' + esc(item.category || 'Foto') + '</span>'
      + '<span class="media-title">' + esc(item.title) + '</span>'
      + '<span class="media-date">' + esc(item.date || '') + '</span>'
      + '</span>'
      + '</button>';
  }

  /* ── Galería ────────────────────────────────────────── */
  var photoGrid = sel('#photoGrid');
  if (photoGrid) {
    // Solo mostrar los que NO tienen hidden: true
    var visibleMedia = media.filter(function (item) { return !item.hidden; });
    photoGrid.innerHTML = visibleMedia.map(function (item) {
      var origIndex = media.indexOf(item); // índice real en media[] para lightbox y video
      return renderCard(item, origIndex, origIndex === media.indexOf(visibleMedia[0]));
    }).join('');

    photoGrid.addEventListener('click', function (e) {
      var vcard = e.target.closest('[data-video-id]');
      if (vcard) { embedVideo(vcard); return; }
      var pcard = e.target.closest('[data-media-index]');
      if (pcard) openLightbox(Number(pcard.dataset.mediaIndex));
    });

    photoGrid.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        var vcard = e.target.closest('[data-video-id]');
        if (vcard) { e.preventDefault(); embedVideo(vcard); }
      }
    });
  }

  /* ── Embeber video YouTube — solo al hacer clic ─────── */
  function embedVideo(card) {
    var id = card.dataset.videoId;
    if (!id) return;
    card.innerHTML = '<iframe class="yt-embed"'
      + ' src="https://www.youtube.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0"'
      + ' allow="autoplay; encrypted-media; picture-in-picture"'
      + ' allowfullscreen'
      + ' title="' + esc(card.getAttribute('aria-label') || '') + '">'
      + '</iframe>';
    card.classList.add('is-playing');
  }

  /* ── Álbumes ────────────────────────────────────────── */
  var albumGrid = sel('#albumGrid');
  var albums    = Array.isArray(data.albums) ? data.albums : [];
  var filters   = sel('#albumFilters');
  var cats      = ['Todos'].concat([].concat.apply([], albums.map(function (a) { return a.category ? [a.category] : []; })).filter(function (v, i, arr) { return arr.indexOf(v) === i; }));
  var activeFilter = 'Todos';

  if (filters) {
    filters.innerHTML = cats.map(function (c, i) {
      return '<button class="filter-button' + (i === 0 ? ' is-active' : '') + '" type="button"'
        + ' data-filter="' + esc(c) + '" aria-pressed="' + (i === 0) + '">' + esc(c) + '</button>';
    }).join('');
  }

  function renderAlbums() {
    if (!albumGrid) return;
    var vis = albums.filter(function (a) { return activeFilter === 'Todos' || a.category === activeFilter; });
    albumGrid.innerHTML = vis.map(function (album) {
      var cnt = (album.mediaIndexes || []).length;
      return '<article class="album-card">'
        + '<div class="album-cover">'
        + '<img src="' + esc(safeUrl(album.cover)) + '" alt="Portada ' + esc(album.title) + '" loading="lazy">'
        + '<span class="album-count">' + cnt + ' ' + (cnt === 1 ? 'medio' : 'medios') + '</span>'
        + '</div>'
        + '<div class="album-info">'
        + '<p class="album-kicker">' + esc(album.category || 'Álbum') + '</p>'
        + '<h3>' + esc(album.title) + '</h3>'
        + '<p>' + esc(album.description || '') + '</p>'
        + '<button type="button" class="album-open" data-album-indexes="' + esc(JSON.stringify(album.mediaIndexes || [])) + '">'
        + 'Ver recuerdos <span aria-hidden="true">&#8599;</span></button>'
        + '</div></article>';
    }).join('');
  }
  renderAlbums();

  if (filters) {
    filters.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-filter]');
      if (!btn) return;
      activeFilter = btn.dataset.filter;
      selAll('[data-filter]', filters).forEach(function (b) {
        var active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      renderAlbums();
    });
  }

  if (albumGrid) {
    albumGrid.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-album-indexes]');
      if (!btn) return;
      var idxs = [];
      try { idxs = JSON.parse(btn.dataset.albumIndexes); } catch (_) {}
      var valid = idxs.filter(function (i) { return Number.isInteger(i) && media[i]; });
      if (!valid.length) return;
      var first = media[valid[0]];
      if (first && first.type === 'video') {
        var fotosSec = sel('#fotos');
        if (fotosSec) fotosSec.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Pool del álbum: solo las fotos de este álbum (incluyendo hidden)
        var albumPool = valid
          .filter(function (i) { return media[i] && media[i].type === 'photo'; })
          .map(function (i) { return Object.assign({}, media[i], { origIdx: i }); });
        openLightbox(valid[0], albumPool);
      }
    });
  }

  /* ── Línea de tiempo ────────────────────────────────── */
  var timeline = sel('#timeline');
  var moments  = Array.isArray(data.moments) ? data.moments : [];
  if (timeline) {
    timeline.innerHTML = moments.map(function (m, i) {
      return '<article class="timeline-item' + (i % 2 ? ' timeline-item-reverse' : '') + '">'
        + '<div class="timeline-marker">' + esc(m.icon || String(i + 1).padStart(2, '0')) + '</div>'
        + '<div class="timeline-image"><img src="' + esc(safeUrl(m.image)) + '" alt="' + esc(m.title) + '" loading="lazy"></div>'
        + '<div class="timeline-copy">'
        + '<p class="timeline-date">' + esc(m.date || 'Un recuerdo') + '</p>'
        + '<h3>' + esc(m.title) + '</h3>'
        + '<p>' + esc(m.description || '') + '</p>'
        + '</div></article>';
    }).join('');
  }

  /* ── Mapa ───────────────────────────────────────────── */
  var places     = Array.isArray(data.places) ? data.places : [];
  var placesList = sel('#placesList');
  var placeCount = sel('#placeCount');
  if (placeCount) placeCount.textContent = places.length + ' ' + (places.length === 1 ? 'lugar guardado' : 'lugares guardados');
  if (placesList) {
    placesList.innerHTML = places.map(function (p, i) {
      var icon = p.icon === 'heart' ? '♥' : p.icon === 'star' ? '✦' : esc(p.icon || '♥');
      return '<button type="button" class="place-item' + (i === 0 ? ' is-selected' : '') + '"'
        + ' data-place-index="' + i + '" aria-pressed="' + (i === 0) + '">'
        + '<span class="place-heart">' + icon + '</span>'
        + '<span class="place-copy"><strong>' + esc(p.name) + '</strong>'
        + '<span>' + esc(p.address || 'Por añadir') + '</span>'
        + '<small>' + esc(p.date || '') + '</small></span>'
        + '<span class="place-arrow" aria-hidden="true">&#8599;</span>'
        + '</button>';
    }).join('');
  }

  var map     = null;
  var markers = [];
  var validP  = places.filter(function (p) {
    return isFinite(+p.latitude) && isFinite(+p.longitude)
      && Math.abs(+p.latitude) <= 90 && Math.abs(+p.longitude) <= 180;
  });

  if (window.L && sel('#memoryMap')) {
    map = L.map('memoryMap', { scrollWheelZoom: false }).setView(
      validP.length ? [+validP[0].latitude, +validP[0].longitude] : [-12.0464, -77.0428],
      validP.length > 1 ? 12 : 13
    );
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
    }).addTo(map);
    validP.forEach(function (p) {
      var orig = places.indexOf(p);
      var mk   = L.marker([+p.latitude, +p.longitude]).addTo(map);
      mk.bindPopup('<div class="map-popup"><strong>' + esc(p.name) + '</strong><span>' + esc(p.address || '') + '</span><p>' + esc(p.note || '') + '</p></div>');
      markers[orig] = mk;
    });
    if (validP.length > 1) {
      map.fitBounds(L.latLngBounds(validP.map(function (p) { return [+p.latitude, +p.longitude]; })).pad(0.22), { maxZoom: 14 });
    }
    setTimeout(function () { map.invalidateSize(); }, 150);
  } else if (sel('#memoryMap')) {
    sel('#memoryMap').innerHTML = '<div class="map-fallback">No se pudo cargar el mapa. Revisa tu conexión.</div>';
  }

  if (placesList) {
    placesList.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-place-index]');
      if (!btn) return;
      var i = Number(btn.dataset.placeIndex);
      selAll('[data-place-index]', placesList).forEach(function (b) {
        var s = b === btn;
        b.classList.toggle('is-selected', s);
        b.setAttribute('aria-pressed', String(s));
      });
      var p = places[i];
      if (map && p && isFinite(+p.latitude) && isFinite(+p.longitude)) {
        map.flyTo([+p.latitude, +p.longitude], 16, { duration: 0.65 });
        if (markers[i]) markers[i].openPopup();
      }
    });
  }

  /* ── Carta ──────────────────────────────────────────── */
  var letter   = data.letter || {};
  var lSal     = sel('#letterSalutation');
  var lBody    = sel('#letterBody');
  var lSig     = sel('#letterSignoff');
  var openBtn  = sel('#openLetter');
  var lContent = sel('#letterContent');
  if (lSal)  lSal.textContent  = letter.salutation || 'Mi amor,';
  if (lBody) lBody.innerHTML   = (letter.paragraphs || []).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
  if (lSig)  lSig.textContent  = letter.signoff || 'Con todo mi amor.';
  if (openBtn && lContent) {
    openBtn.addEventListener('click', function () {
      var willOpen = lContent.hidden;
      lContent.hidden = !willOpen;
      openBtn.setAttribute('aria-expanded', String(willOpen));
      openBtn.innerHTML = willOpen ? 'Cerrar mi carta <span aria-hidden="true">×</span>' : 'Abrir mi carta <span aria-hidden="true">♥</span>';
      if (willOpen) setTimeout(function () { lContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 60);
    });
  }

  /* ── Lightbox (solo fotos) ──────────────────────────── */
  var lightbox   = sel('#lightbox');
  var curIdx     = 0;

  // Todas las fotos (incluyendo hidden) — para álbumes
  var photoItems = media.map(function (m, i) {
    return m.type === 'photo' ? Object.assign({}, m, { origIdx: i }) : null;
  }).filter(Boolean);

  // Solo fotos visibles — para navegar desde la galería
  var visiblePhotoItems = photoItems.filter(function (p) { return !p.hidden; });

  // Pool activo: cambia según si viene de álbum o galería
  var activePool = visiblePhotoItems;

  function openLightbox(mIdx, pool) {
    activePool = pool || visiblePhotoItems;
    var pos = activePool.findIndex(function (p) { return p.origIdx === mIdx; });
    if (pos === -1 || !lightbox) return;
    curIdx = pos;
    showLightboxPhoto();
    if (typeof lightbox.showModal === 'function') lightbox.showModal();
    else lightbox.setAttribute('open', '');
  }

  function showLightboxPhoto() {
    var item = activePool[curIdx];
    if (!item) return;
    var li = sel('#lightboxImage');
    if (li) { li.src = safeUrl(item.image); li.alt = item.alt || item.title || 'Foto'; }
    var lt = sel('#lightboxTitle');
    if (lt) lt.textContent = item.title || 'Un recuerdo';
    var lc = sel('#lightboxCaption');
    if (lc) lc.textContent = [item.date, item.caption].filter(Boolean).join(' · ');
  }

  function stepPhoto(dir) {
    if (!lightbox || !lightbox.open || !activePool.length) return;
    curIdx = (curIdx + dir + activePool.length) % activePool.length;
    showLightboxPhoto();
  }

  var clBtn = sel('#closeLightbox');
  var prBtn = sel('#prevPhoto');
  var nxBtn = sel('#nextPhoto');
  if (clBtn) clBtn.addEventListener('click', function () { lightbox && lightbox.close(); });
  if (prBtn) prBtn.addEventListener('click', function () { stepPhoto(-1); });
  if (nxBtn) nxBtn.addEventListener('click', function () { stepPhoto(1); });
  if (lightbox) lightbox.addEventListener('click', function (e) { if (e.target === lightbox) lightbox.close(); });
  document.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.open) return;
    if (e.key === 'ArrowRight') stepPhoto(1);
    if (e.key === 'ArrowLeft')  stepPhoto(-1);
    if (e.key === 'Escape')     lightbox.close();
  });

  /* ── Año en el pie ──────────────────────────────────── */
  var footer = sel('.site-footer');
  if (footer && !sel('.footer-year', footer)) {
    var yr = document.createElement('span');
    yr.className   = 'footer-year';
    yr.textContent = String(new Date().getFullYear());
    footer.appendChild(yr);
  }
})();