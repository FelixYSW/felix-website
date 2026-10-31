/* Rebuilt app screens.
   Accessible Navigation and Nutrition Tracker are native iOS apps, so they cannot
   be screenshotted in a browser. These screens are drawn from the apps' own source:
   colour tokens, radii, type sizes, copy. Place names and numbers are sample data. */
(function () {
  var ico = {
    pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>',
    eye: '<path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>',
    cross: '<circle cx="12" cy="12" r="6.5"/><path d="M12 2v5M12 17v5M2 12h5M17 12h5"/>',
    pie: '<path d="M12 3a9 9 0 1 0 9 9h-9Z"/><path d="M15 3.5A9 9 0 0 1 20.5 9H15Z"/>',
    plus: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
    spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z"/><path d="M19 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7Z"/>',
    cal: '<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M8 3v4M16 3v4"/>',
    person: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-4 3.6-6 7-6s6.2 2 7 6"/>',
    left: '<path d="M15 5l-7 7 7 7"/>',
    right: '<path d="M9 5l7 7-7 7"/>',
    fork: '<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 21V3c-2.5 1.5-3.5 4.5-3.5 8H17"/>',
    camera: '<path d="M4 8h3l1.5-2h7L17 8h3v11H4Z"/><circle cx="12" cy="13" r="3.5"/>',
    chart: '<path d="M5 20V10M12 20V4M19 20v-7"/>',
    dumbbell: '<path d="M6 8v8M3 10v4M18 8v8M21 10v4M6 12h12"/>',
    loc: '<path d="M4 12l16-8-8 16-2-6Z"/>',
    refresh: '<path d="M20 12a8 8 0 1 1-2.4-5.7M20 4v4h-4"/>'
  };
  function svg(name, size, color, sw) {
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color +
      '" stroke-width="' + (sw || 1.8) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ico[name] + '</svg>';
  }

  /* ---------- Accessible Navigation (tokens: src/theme/tokens.ts) ---------- */
  function navTabs(active) {
    var items = [['pin', 'Navigate'], ['eye', 'Hazard Detection'], ['gear', 'Settings']];
    return '<div class="nv-tabs">' + items.map(function (t) {
      return '<div class="nv-tab' + (t[1] === active ? ' is-on' : '') + '">' + svg(t[0], 24, 'currentColor', 1.7) + '<span>' + t[1] + '</span></div>';
    }).join('') + '</div>';
  }

  function navMap() {
    var map =
      '<svg class="nv-map" viewBox="0 0 390 844" width="390" height="844" aria-hidden="true">' +
      '<rect width="390" height="844" fill="#ebe8e0"/>' +
      '<rect x="224" y="236" width="170" height="186" rx="10" fill="#cfe2c3"/>' +
      '<path d="M0 640 Q90 590 190 640 L190 844 L0 844Z" fill="#c3dcec"/>' +
      '<g stroke="#d8d4c8" stroke-width="16" fill="none" stroke-linecap="round">' +
      '<path d="M-10 150H400M-10 232H400M-10 330H400M-10 430H400M-10 540H400"/>' +
      '<path d="M90 90V700M130 90V700M200 90V700M310 90V700"/></g>' +
      '<g stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round">' +
      '<path d="M-10 150H400M-10 232H400M-10 330H400M-10 430H400M-10 540H400"/>' +
      '<path d="M90 90V700M130 90V700M200 90V700M310 90V700"/></g>' +
      '<g font-family="-apple-system,system-ui,sans-serif" font-size="10" fill="#8a877f">' +
      '<text x="218" y="226">Jalan Raja Chulan</text><text x="140" y="324">Jalan Sultan Ismail</text>' +
      '<text transform="translate(205 410) rotate(-90)">Jalan Bukit Bintang</text></g>' +
      /* alternative route */
      '<path d="M130 430H310V232" fill="none" stroke="#8ba0be" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M130 430H310V232" fill="none" stroke="#c2cfe2" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>' +
      /* selected route */
      '<path d="M130 430V330H200V232H310" fill="none" stroke="#003386" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M130 430V330H200V232H310" fill="none" stroke="#1f6dd8" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<circle cx="130" cy="430" r="15" fill="#1f6dd8" opacity=".18"/><circle cx="130" cy="430" r="8" fill="#1f6dd8" stroke="#fff" stroke-width="3"/>' +
      '<path d="M310 232s12-10 12-20a12 12 0 0 0-24 0c0 10 12 20 12 20Z" fill="#e0392d" stroke="#fff" stroke-width="2"/><circle cx="310" cy="212" r="4.5" fill="#fff"/>' +
      '</svg>';
    return map +
      '<div class="nv-pill nv-pill--on" style="left:172px;top:268px">14 min</div>' +
      '<div class="nv-pill" style="left:282px;top:330px">17 min</div>' +
      '<div class="nv-search"><span>Pavilion Kuala Lumpur</span><i>✕</i></div>' +
      '<div class="nv-recenter">' + svg('cross', 22, '#1f6dd8', 2) + '</div>' +
      '<div class="nv-panel">' +
        '<div class="nv-panel__name">Pavilion Kuala Lumpur</div>' +
        '<div class="nv-panel__addr">168 Jalan Bukit Bintang, Bukit Bintang</div>' +
        '<div class="nv-panel__stats">14 min · 850 m</div>' +
        '<div class="nv-panel__via">Via Jalan Raja Chulan</div>' +
        '<div class="nv-row"><b style="background:#1b9247"></b><span>Step-free for a wheelchair along the whole route</span></div>' +
        '<div class="nv-row"><b style="background:#1b9247"></b><span>Mostly paved footpath</span></div>' +
        '<div class="nv-start">Start AR Navigation</div>' +
      '</div>' + navTabs('Navigate');
  }

  function sw(on) { return '<i class="nv-sw' + (on ? ' is-on' : '') + '"></i>'; }
  function seg(vals, sel) {
    return '<div class="nv-seg">' + vals.map(function (v, i) { return '<span' + (i === sel ? ' class="is-on"' : '') + '>' + v + '</span>'; }).join('') + '</div>';
  }
  function navSettings() {
    var hz = [['Pothole', '#FF3B30'], ['Slippery Surface', '#0A84FF'], ['Broken Tactile Paving', '#FFD60A'], ['Pathway Obstruction', '#FF9F0A']];
    return '<div class="nv-set">' +
      '<h4>Settings</h4>' +
      '<p class="nv-lab">Display</p><div class="nv-card">' +
        '<div class="nv-r nv-r--div"><div class="nv-t">Text Size</div>' + seg(['Default', 'Large', 'XL'], 0) + '</div>' +
        '<div class="nv-r nv-r--in"><div class="nv-t">Dark Mode</div>' + sw(true) + '</div></div>' +
      '<p class="nv-lab">Mobility aid</p><div class="nv-card"><div class="nv-r">' +
        seg(['None', 'Wheelchair', 'Cane', 'Walker'], 1) +
        '<div class="nv-s" style="margin-top:10px">Slower pace, step-free routes</div></div></div>' +
      '<p class="nv-lab">Hazard types</p><div class="nv-card">' +
        '<div class="nv-r nv-r--in nv-r--div"><div><div class="nv-t">Detect Hazards</div><div class="nv-s">Turns every hazard type below on or off</div></div>' + sw(true) + '</div>' +
        hz.map(function (h, i) {
          return '<div class="nv-r nv-r--in' + (i < 3 ? ' nv-r--div' : '') + '"><div class="nv-t nv-t--sw"><b style="background:' + h[1] + '"></b>' + h[0] + '</div>' + sw(true) + '</div>';
        }).join('') + '</div>' +
      '</div>' + navTabs('Settings');
  }

  /* ---------- Nutrition Tracker (tokens: Components/AppTheme.swift) ---------- */
  function nutTabs(active) {
    var items = [['pie', 'Today'], ['plus', 'Add'], ['spark', 'Assistant'], ['cal', 'Calendar']];
    return '<div class="nt-tabs">' + items.map(function (t) {
      return '<div class="nt-tab' + (t[1] === active ? ' is-on' : '') + '">' + svg(t[0], 25, 'currentColor', 1.8) + '<span>' + t[1] + '</span></div>';
    }).join('') + '</div>';
  }
  function ring(pct, color, size, stroke, inner, track) {
    var r = (size - stroke) / 2, c = 2 * Math.PI * r;
    return '<div class="nt-ring" style="width:' + size + 'px;height:' + size + 'px"><svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '" aria-hidden="true">' +
      '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="' + (track || '#F8F6F1') + '" stroke-width="' + stroke + '"/>' +
      '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="' + stroke + '" stroke-linecap="round" stroke-dasharray="' + (c * pct) + ' ' + c + '" transform="rotate(-90 ' + size / 2 + ' ' + size / 2 + ')"/></svg>' + (inner || '') + '</div>';
  }
  function nutToday() {
    var macros = [['Protein', '52 g', 'of 90–130 g', 0.5, '#0F8B8D'], ['Carbs', '171 g', 'of 200–260 g', 0.74, '#C28A0A'], ['Fat', '49 g', 'of 55–75 g', 0.75, '#7A4FD0'], ['Fibre', '9 g', 'of 25–30 g', 0.32, '#C2255C']];
    var foods = [['8:15 am', 'Nasi lemak with egg', '1 plate', '644'], ['10:30 am', 'Teh tarik', '1 cup', '150'], ['12:40 pm', 'Chicken rice', '1 plate', '580']];
    return '<div class="nt-page">' +
      '<div class="nt-head"><div><h4>31 Oct</h4><p>Saturday</p></div><div class="nt-glass">' + svg('person', 22, '#2A2926', 1.8) + '</div></div>' +
      '<div class="nt-days"><div class="nt-glass">' + svg('left', 20, '#2A2926', 2.2) + '</div><div class="nt-glass is-off">' + svg('right', 20, '#2A2926', 2.2) + '</div><span></span><div class="nt-today">Today</div></div>' +
      '<div class="nt-hero"><div><p class="nt-hero__lab">Calories</p><p class="nt-hero__n">1,374</p><p class="nt-hero__s">of 1,800–2,100 kcal</p></div>' +
        ring(0.68, '#DB5A1F', 104, 12, '<div class="nt-ring__c">' + svg('fork', 26, '#DB5A1F', 2) + '</div>') + '</div>' +
      '<div class="nt-rings">' + macros.map(function (m) {
        return '<div class="nt-m">' + ring(m[3], m[4], 62, 8, '', '#E6E3DC') + '<b>' + m[0] + '</b><span class="nt-m__v">' + m[1] + '</span><small>' + m[2] + '</small></div>';
      }).join('') + '</div>' +
      '<div class="nt-sec"><b>Today’s food</b><span>3</span></div>' +
      foods.map(function (f) {
        return '<div class="nt-food"><div class="nt-food__i">' + svg('fork', 20, '#2A2926', 1.8) + '</div><div class="nt-food__t"><b>' + f[1] + '</b><span>' + f[0] + ' · ' + f[2] + '</span></div><div class="nt-food__k"><b>' + f[3] + '</b><span>kcal</span></div></div>';
      }).join('') + '</div>' + nutTabs('Today');
  }
  function chip(icon, text) { return '<div class="nt-chip">' + svg(icon, 17, '#2A2926', 2) + '<span>' + text + '</span></div>'; }
  function nutAssistant() {
    return '<div class="nt-asst"><div class="nt-appicon">' + svg('fork', 40, '#fff', 2.2) + '</div>' +
      '<h4>Afternoon</h4>' +
      '<div class="nt-chips"><div>' + chip('plus', 'Log a snack') + chip('camera', 'What’s on the menu?') + '</div><div>' + chip('dumbbell', 'High-protein snack') + chip('chart', 'How’s my week?') + '</div></div>' +
      '<p class="nt-foot">Sees your ranges and food log. Always asks before changing anything.</p></div>' + nutTabs('Assistant');
  }

  var screens = { 'nav-map': navMap, 'nav-settings': navSettings, 'nut-today': nutToday, 'nut-assistant': nutAssistant };
  Array.prototype.forEach.call(document.querySelectorAll('.app[data-screen]'), function (el) {
    var key = el.getAttribute('data-screen');
    el.classList.add('app--' + key);
    el.innerHTML = screens[key]();
  });
})();
