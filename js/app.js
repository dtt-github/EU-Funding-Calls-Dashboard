(function () {
  'use strict';

  const NOW = new Date();

  const TYPE_CLASSES = {
    RIA: 'badge-ria', IA: 'badge-ia', CSA: 'badge-csa',
    PPI: 'badge-ppi', CoFund: 'badge-cofund', Prize: 'badge-prize',
    'MSCA-SE': 'badge-msca-se', MSCA: 'badge-msca-se', Grant: 'badge-ria'
  };

  const PROG_SHORT = {
    'Horizon Europe': 'Horizon',
    'Digital Europe': 'Digital',
    'European Defence Fund': 'EDF',
    'Creative Europe': 'Creative',
    'Single Market Programme': 'SMP',
    'Connecting Europe Facility': 'CEF',
    'Innovation Fund': 'InnovFund',
    'European Solidarity Corps': 'ESC',
    'Interregional Innovation': 'I3',
    'NDICI Global Europe': 'NDICI',
    'EU Anti-Fraud (EUAF)': 'EUAF',
    'Pilot Projects & Preparatory Actions': 'PPPA',
    'European Parliament': 'EP',
    'Renewable Energy FM': 'RENEWFM',
    'Europe Direct': 'ED',
    'EU Agencies': 'EU Agencies',
    'Pericles IV': 'Pericles',
  };

  /* ── Synonym Expansion Dictionary ── */
  const SYNONYMS = {
    'construction':     ['building', 'buildings', 'renovation', 'built environment', 'civil engineering', 'structural', 'cement', 'concrete', 'demolition', 'infrastructure', 'modular', 'offsite', 'housing', 'neighbourhood', 'NEB'],
    'building':         ['construction', 'buildings', 'renovation', 'built environment', 'structural', 'housing', 'energy efficiency'],
    'infrastructure':   ['transport', 'urban', 'road', 'bridge', 'network', 'construction'],
    'ai':               ['artificial intelligence', 'machine learning', 'robot', 'automation', 'intelligent', 'GenAI', 'deep learning'],
    'artificial intelligence': ['ai', 'machine learning', 'robot', 'deep learning', 'neural network'],
    'machine learning': ['ai', 'artificial intelligence', 'neural', 'deep learning'],
    'ml':               ['machine learning', 'ai', 'artificial intelligence'],
    'automotive':       ['vehicle', 'car', 'ev', 'electric vehicle', 'battery', '2ZERO'],
    'car':              ['vehicle', 'automotive', 'ev', 'electric vehicle', 'transport'],
    'truck':            ['vehicle', 'logistics', 'freight', 'transport', 'heavy-duty', 'battery electric'],
    'ev':               ['electric vehicle', 'battery', 'charging', 'automotive', '2ZERO'],
    'electric vehicle': ['ev', 'battery', 'charging', 'automotive', '2ZERO'],
    'shipping':         ['maritime', 'port', 'vessel', 'ship', 'waterborne', 'ZEWT'],
    'maritime':         ['shipping', 'port', 'vessel', 'ship', 'ocean', 'ZEWT', 'naval'],
    'aviation':         ['aircraft', 'airplane', 'aerospace', 'flying', 'MRO'],
    'mining':           ['raw material', 'extraction', 'mineral', 'ore', 'critical raw'],
    'medicine':         ['medical', 'clinical', 'pharmaceutical', 'therapy', 'treatment', 'disease'],
    'pharma':           ['pharmaceutical', 'drug', 'medicine', 'therapy', 'clinical', 'regulatory'],
    'cancer':           ['oncology', 'disease', 'treatment', 'therapy', 'NCD'],
    'heart':            ['cardiovascular', 'cardiac', 'disease', 'NCD'],
    'mental health':    ['psychology', 'psychiatry', 'wellbeing', 'mental', 'behavioural', 'brain'],
    'environment':      ['climate', 'pollution', 'green', 'sustainability', 'ecology', 'nature', 'biodiversity'],
    'sustainability':   ['green', 'circular', 'renewable', 'environment', 'clean', 'sustainable'],
    'renewable':        ['energy', 'solar', 'wind', 'green', 'sustainability', 'fuel'],
    'energy':           ['renewable', 'battery', 'electric', 'power', 'climate', 'fuel', 'hydrogen'],
    'water':            ['aquatic', 'hydro', 'irrigation', 'flood', 'infrastructure', 'marine'],
    'ocean':            ['sea', 'marine', 'maritime', 'coastal', 'blue economy', 'fishery', 'Atlantic'],
    'food':             ['nutrition', 'diet', 'agriculture', 'farming', 'processing', 'agri-food'],
    'agriculture':      ['farming', 'crop', 'livestock', 'food', 'plant', 'soil', 'rural', 'organic'],
    'farming':          ['agriculture', 'crop', 'livestock', 'organic', 'rural', 'farm'],
    'recycling':        ['circular', 'waste', 'reuse', 'secondary material', 'raw material'],
    'pollution':        ['contamination', 'emission', 'waste', 'clean', 'environment', 'zero pollution'],
    'semiconductor':    ['chip', 'microelectronics', 'processor', 'integrated circuit'],
    'quantum':          ['computing', 'physics', 'sensor', 'cryptography', 'photonic'],
    'space':            ['satellite', 'earth observation', 'remote sensing'],
    'satellite':        ['space', 'earth observation', 'remote sensing', 'geospatial', 'Copernicus'],
    'biotech':          ['biotechnology', 'biomedical', 'pharmaceutical', 'genomics', 'ATMP'],
    'robot':            ['robotics', 'automation', 'manufacturing', 'industrial', 'mechatronics'],
    'robotics':         ['robot', 'automation', 'manufacturing', 'ai', 'industrial'],
    'startup':          ['SME', 'small business', 'entrepreneur', 'innovation'],
    'sme':              ['startup', 'small business', 'entrepreneur', 'innovation', 'SME'],
    'steel':            ['metal', 'construction', 'alloy', 'foundry', 'smelting'],
    'plastic':          ['nanoplastic', 'polymer', 'microplastic', 'packaging', 'PET'],
    'forest':           ['timber', 'woodland', 'tree', 'deforestation', 'forestry', 'bioeconomy'],
    'fish':             ['aquaculture', 'fishery', 'marine', 'seafood', 'ocean'],
    'biodiversity':     ['ecology', 'species', 'wildlife', 'habitat', 'conservation', 'nature'],
    'carbon':           ['CO2', 'emission', 'greenhouse gas', 'decarbonization', 'climate', 'capture'],
    'climate change':   ['global warming', 'greenhouse gas', 'carbon', 'emission', 'adaptation'],
    'defence':          ['defense', 'military', 'security', 'armed forces', 'EDF'],
    'defense':          ['defence', 'military', 'security', 'armed forces', 'EDF'],
    'security':         ['defence', 'cybersecurity', 'border', 'surveillance', 'ISF'],
    'film':             ['cinema', 'audiovisual', 'media', 'creative', 'movie'],
    'culture':          ['creative', 'heritage', 'arts', 'cultural', 'media'],
    'education':        ['training', 'learning', 'university', 'school', 'academic', 'Erasmus'],
    'training':         ['education', 'learning', 'skills', 'vocational', 'Erasmus'],
    'migration':        ['asylum', 'refugee', 'border', 'integration', 'AMIF'],
    'health':           ['medical', 'medicine', 'clinical', 'hospital', 'pharma', 'EU4Health'],
  };

  var PAGE_SIZE = 25;

  let allCalls = [];
  let selectedIds = new Set();
  let sharedIds = new Set();
  let activeProgrammeTab = 'all';
  let activeFilters = { programme: new Set(), status: new Set(), type: new Set(), stage: new Set() };
  let searchQuery = '';
  let currentPage = 1;
  let sortColumn = 'deadline';
  let sortDirection = 'asc';
  let chartInstances = [];
  let fuseIndex = null;

  function isDark() {
    return document.documentElement.getAttribute('data-theme') !== 'light';
  }

  function themeColors() {
    var dark = isDark();
    return {
      textColor: dark ? '#8892b0' : '#4a5272',
      gridColor: dark ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.06)',
      barBg: dark ? 'rgba(79, 138, 255, .5)' : 'rgba(37, 99, 235, .4)',
      barBorder: dark ? '#4f8aff' : '#2563eb'
    };
  }

  var PROG_COLORS = [
    '#4f8aff', '#00bfa5', '#ffab00', '#00c853', '#b388ff',
    '#ef5350', '#42a5f5', '#ff9800', '#66bb6a', '#ab47bc',
    '#78909c', '#ffd600', '#26a69a', '#ec407a', '#8d6e63',
    '#7e57c2', '#5c6bc0', '#26c6da', '#9ccc65', '#ff7043',
    '#29b6f6', '#d4e157', '#ab47bc', '#8d6e63', '#546e7a',
    '#ffca28', '#66bb6a', '#ef5350', '#42a5f5'
  ];

  /* ── Enrich calls with searchable tags ── */
  function enrichCalls(calls) {
    calls.forEach(function (c) {
      var parts = [c.keywords || '', c.programme || '', c.callIdentifier || ''];
      if (c.cluster) parts.push(c.cluster);
      c._tags = parts.join(' ');
    });
  }

  /* ── Expand search query with synonyms ── */
  function expandQuery(query) {
    var words = query.toLowerCase().split(/\s+/).filter(Boolean);
    var expanded = new Set(words);
    expanded.add(query.toLowerCase());
    words.forEach(function (w) {
      var syns = SYNONYMS[w];
      if (syns) syns.forEach(function (s) { expanded.add(s.toLowerCase()); });
    });
    var phrase = query.toLowerCase();
    var phraseSyns = SYNONYMS[phrase];
    if (phraseSyns) phraseSyns.forEach(function (s) { expanded.add(s.toLowerCase()); });
    return Array.from(expanded);
  }

  /* ── Build Fuse.js index ── */
  function buildFuseIndex() {
    if (typeof Fuse === 'undefined') { setTimeout(buildFuseIndex, 150); return; }
    fuseIndex = new Fuse(allCalls, {
      keys: [
        { name: 'title',       weight: 0.30 },
        { name: '_tags',       weight: 0.20 },
        { name: 'keywords',    weight: 0.15 },
        { name: 'programme',   weight: 0.10 },
        { name: 'topicId',     weight: 0.10 },
        { name: 'callIdentifier', weight: 0.05 },
        { name: 'actionType',  weight: 0.05 },
        { name: 'cluster',     weight: 0.05 }
      ],
      threshold: 0.3,
      distance: 150,
      includeScore: true,
      ignoreLocation: true,
      minMatchCharLength: 2
    });
  }

  /* ── Smart search ── */
  function looksLikeId(q) {
    return /[A-Z0-9]{2,}-/.test(q.toUpperCase()) || /\d{4}-\d{2}/.test(q);
  }

  function substringMatch(text, q) {
    return text && text.toLowerCase().indexOf(q) !== -1;
  }

  function exactSubstringSearch(query) {
    var q = query.toLowerCase();
    return allCalls.filter(function (c) {
      return substringMatch(c.topicId, q) ||
             substringMatch(c.callIdentifier, q) ||
             substringMatch(c.title, q) ||
             substringMatch(c.programme, q) ||
             substringMatch(c.keywords, q);
    });
  }

  function smartSearch(query) {
    if (!query.trim()) return null;

    var q = query.toLowerCase().trim();

    var exactSet = new Set();
    var exactResults = exactSubstringSearch(q);
    exactResults.forEach(function (c) { exactSet.add(c.topicId); });

    if (looksLikeId(q)) return exactResults;

    var synonymResults = [];
    var synonymSet = new Set();
    var syns = SYNONYMS[q];
    if (syns) {
      syns.forEach(function (syn) {
        var synLower = syn.toLowerCase();
        allCalls.forEach(function (c) {
          if (exactSet.has(c.topicId) || synonymSet.has(c.topicId)) return;
          if (substringMatch(c.title, synLower) ||
              substringMatch(c.keywords, synLower) ||
              substringMatch(c.cluster, synLower)) {
            synonymResults.push(c);
            synonymSet.add(c.topicId);
          }
        });
      });
    }

    var fuzzyResults = [];
    if (fuseIndex) {
      var terms = expandQuery(q);
      var resultMap = new Map();
      terms.forEach(function (term) {
        var hits = fuseIndex.search(term);
        hits.forEach(function (h) {
          if (exactSet.has(h.item.topicId) || synonymSet.has(h.item.topicId)) return;
          var existing = resultMap.get(h.item.topicId);
          if (!existing || h.score < existing.score) {
            resultMap.set(h.item.topicId, h);
          }
        });
      });
      fuzzyResults = Array.from(resultMap.values())
        .sort(function (a, b) { return a.score - b.score; })
        .map(function (r) { return r.item; });
    }

    var combined = exactResults.concat(synonymResults, fuzzyResults);
    return combined.length > 0 ? combined : null;
  }

  async function init() {
    var callsResp = await fetch('data/calls.json');
    allCalls = await callsResp.json();

    var localSel = [];
    try { localSel = JSON.parse(localStorage.getItem('selectedCalls') || '[]'); } catch (e) {}
    selectedIds = new Set(localSel);

    var todayStr = new Date().toISOString().slice(0, 10);
    allCalls = allCalls.filter(function (c) {
      if (c.callStatus === 'open' && c.deadline && c.deadline < todayStr) return false;
      return true;
    });

    enrichCalls(allCalls);

    var openCount = allCalls.filter(function (c) { return c.callStatus === 'open'; }).length;
    var forthCount = allCalls.filter(function (c) { return c.callStatus === 'forthcoming'; }).length;
    var progCount = new Set(allCalls.map(function (c) { return c.programme; })).size;

    document.getElementById('stat-topics').textContent = allCalls.length;
    document.getElementById('stat-open').textContent = openCount;
    document.getElementById('stat-forthcoming').textContent = forthCount;
    document.getElementById('stat-programmes').textContent = progCount;
    document.getElementById('hero-subtitle').textContent =
      allCalls.length + ' calls \u00b7 ' + openCount + ' open \u00b7 ' + forthCount + ' forthcoming \u00b7 ' + progCount + ' programmes';

    renderCountdown();
    renderSelectedCalls();
    renderCharts();
    buildFilters();
    buildProgrammeTabs();
    renderTable();
    bindEvents();
    initThemeToggle();
    buildFuseIndex();
    initAuth();
  }

  /* ── Auth Integration ── */
  function initAuth() {
    if (typeof Auth === 'undefined' || !Auth.isConfigured()) return;

    Auth._showToast = showToast;

    Auth._onAuthChange = function (user) {
      if (user) {
        var userKey = 'selectedCalls_' + user.id;
        var cached = [];
        try { cached = JSON.parse(localStorage.getItem(userKey) || '[]'); } catch (e) {}
        selectedIds = new Set(cached);
        updateSelectionSubtitle(true);
        renderSelectedCalls();
        renderTable();

        Auth.loadSelections(user.id).then(function (remote) {
          if (remote.length > 0) {
            remote.forEach(function (id) { selectedIds.add(id); });
            saveSelections();
            renderSelectedCalls();
            renderTable();
          }
          var remoteSet = new Set(remote);
          var localOnly = cached.filter(function (id) { return !remoteSet.has(id); });
          if (localOnly.length > 0) {
            Promise.all(localOnly.map(function (id) { return Auth.saveSelection(id); }))
              .then(function (results) {
                var failures = results.filter(function (r) { return !r.ok; });
                if (failures.length > 0) showToast('Sync failed: ' + failures[0].msg);
              });
          }
        });
      } else {
        selectedIds = new Set();
        updateSelectionSubtitle(false);
        renderSelectedCalls();
        renderTable();
      }
    };

    Auth._onProfileUpdate = function () {
      updateSelectionSubtitle(true);
    };

    Auth._onSharedCleared = function () {
      sharedIds = new Set();
      var user = Auth.getUser();
      updateSelectionSubtitle(!!user);
      renderSelectedCalls();
      renderTable();
    };

    Auth.initUI();

    var shared = Auth.getSharedUserId();
    if (shared) {
      Auth.loadSelections(shared).then(function (ids) {
        sharedIds = new Set(ids);
        renderSelectedCalls();
        renderTable();
        if (ids.length === 0) {
          showToast('This user has no selections yet, or they haven\'t synced to the server');
        }
      });
    }
  }

  function getUserDisplayName() {
    var user = (typeof Auth !== 'undefined') ? Auth.getUser() : null;
    if (!user) return null;
    if (user.user_metadata && user.user_metadata.full_name) return user.user_metadata.full_name;
    if (user.email) return user.email.split('@')[0];
    return null;
  }

  function updateSelectionSubtitle(loggedIn) {
    var el = document.getElementById('selection-subtitle');
    var label = document.getElementById('target-calls-label');
    if (!el) return;

    var sharerName = (typeof Auth !== 'undefined') ? Auth.getSharedName() : null;
    if (sharerName && label) {
      label.textContent = sharerName + '\u2019s Target Calls';
      el.textContent = 'You are viewing selections shared by ' + sharerName + '.';
      return;
    }

    if (loggedIn) {
      el.textContent = 'Your selections are saved to your account. Share them with the link button.';
      if (label) {
        var name = getUserDisplayName() || 'My';
        label.textContent = name + '\u2019s Target Calls';
      }
    } else {
      el.textContent = 'Click the \u2733 star on any call to add it here. Selections are saved in your browser.';
      if (label) label.textContent = 'My Target Calls';
    }
  }

  /* ── Theme Toggle ── */
  function initThemeToggle() {
    var btn = document.getElementById('theme-toggle');
    btn.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      rebuildCharts();
    });
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function (e) {
      if (localStorage.getItem('theme')) return;
      document.documentElement.setAttribute('data-theme', e.matches ? 'light' : 'dark');
      rebuildCharts();
    });
  }

  function rebuildCharts() {
    chartInstances.forEach(function (c) { c.destroy(); });
    chartInstances = [];
    renderCharts();
  }

  /* ── Countdown ── */
  function getNextDeadline() {
    var deadlines = allCalls
      .filter(function (c) { return c.deadline && c.callStatus === 'open'; })
      .map(function (c) { return c.deadline; });
    deadlines = Array.from(new Set(deadlines)).sort();
    for (var i = 0; i < deadlines.length; i++) {
      var dt = new Date(deadlines[i] + 'T17:00:00+02:00');
      if (dt > NOW) return dt;
    }
    return null;
  }

  function renderCountdown() {
    var target = getNextDeadline();
    var dateEl = document.getElementById('countdown-date');
    var container = document.getElementById('countdown');
    if (!target) {
      dateEl.textContent = 'No upcoming deadlines';
      container.classList.add('countdown--expired');
      return;
    }
    dateEl.textContent = target.toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric'
    }) + ', 17:00 CEST';
    function tick() {
      var diff = target - new Date();
      if (diff <= 0) {
        ['cd-days', 'cd-hours', 'cd-mins', 'cd-secs'].forEach(function (id) {
          document.getElementById(id).textContent = '0';
        });
        return;
      }
      document.getElementById('cd-days').textContent = Math.floor(diff / 86400000);
      document.getElementById('cd-hours').textContent = Math.floor((diff % 86400000) / 3600000);
      document.getElementById('cd-mins').textContent = Math.floor((diff % 3600000) / 60000);
      document.getElementById('cd-secs').textContent = Math.floor((diff % 60000) / 1000);
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ── Selected Calls ── */
  function renderSelectedCalls() {
    var section = document.getElementById('selected-calls');
    var grid = document.getElementById('selected-calls-grid');
    var actions = document.getElementById('selected-actions');
    var countEl = document.getElementById('selected-count');

    var mySelected = allCalls.filter(function (c) { return selectedIds.has(c.topicId); });
    var sharedOnly = allCalls.filter(function (c) { return sharedIds.has(c.topicId) && !selectedIds.has(c.topicId); });
    var total = mySelected.length + sharedOnly.length;

    if (total === 0 && selectedIds.size === 0 && sharedIds.size === 0) {
      section.classList.remove('visible');
      return;
    }
    section.classList.add('visible');
    if (countEl) countEl.textContent = mySelected.length || 0;
    if (actions) actions.classList.toggle('visible', mySelected.length > 0);

    var html = '';

    html += mySelected.map(function (c) {
      return '<div class="sel-card">' +
        '<button class="sel-card__remove" data-topic="' + esc(c.topicId) + '" aria-label="Remove" title="Remove from selections">&times;</button>' +
        '<div class="sel-card__topicId">' + esc(c.topicId) + '</div>' +
        '<div class="sel-card__title">' + esc(c.title) + '</div>' +
        '<div class="sel-card__meta">' +
          (c.actionType ? '<span class="badge ' + badgeClass(c.actionType) + '">' + esc(c.actionType) + '</span>' : '') +
          '<span class="badge badge-' + c.callStatus + '">' + esc(c.callStatus) + '</span>' +
          (c.deadline ? '<span class="badge badge-stage">' + formatDeadline(c.deadline) + '</span>' : '') +
          '<span class="badge badge-programme">' + esc(PROG_SHORT[c.programme] || c.programme) + '</span>' +
        '</div>' +
        '<a class="sel-card__link" href="' + c.portalUrl + '" target="_blank" rel="noopener">View on EU Portal &rarr;</a>' +
      '</div>';
    }).join('');

    if (sharedOnly.length > 0) {
      html += '<div class="sel-card sel-card--shared-divider"><span>Shared user\'s selections</span></div>';
      html += sharedOnly.map(function (c) {
        return '<div class="sel-card sel-card--shared">' +
          '<div class="sel-card__topicId">' + esc(c.topicId) + '</div>' +
          '<div class="sel-card__title">' + esc(c.title) + '</div>' +
          '<div class="sel-card__meta">' +
            (c.actionType ? '<span class="badge ' + badgeClass(c.actionType) + '">' + esc(c.actionType) + '</span>' : '') +
            '<span class="badge badge-' + c.callStatus + '">' + esc(c.callStatus) + '</span>' +
            (c.deadline ? '<span class="badge badge-stage">' + formatDeadline(c.deadline) + '</span>' : '') +
            '<span class="badge badge-programme">' + esc(PROG_SHORT[c.programme] || c.programme) + '</span>' +
          '</div>' +
          '<a class="sel-card__link" href="' + c.portalUrl + '" target="_blank" rel="noopener">View on EU Portal &rarr;</a>' +
        '</div>';
      }).join('');
    }

    grid.innerHTML = html;

    grid.querySelectorAll('.sel-card__remove').forEach(function (btn) {
      btn.addEventListener('click', function () {
        toggleSelection(this.dataset.topic);
      });
    });
  }

  /* ── Charts ── */
  function renderCharts() {
    if (typeof Chart === 'undefined') { setTimeout(renderCharts, 200); return; }
    var tc = themeColors();
    Chart.defaults.color = tc.textColor;
    Chart.defaults.font.family = "'DM Sans', sans-serif";
    Chart.defaults.plugins.legend.labels.boxWidth = 14;
    Chart.defaults.plugins.legend.labels.padding = 12;

    // Programme chart - top 8 + Other
    var progCounts = {};
    allCalls.forEach(function (c) { progCounts[c.programme] = (progCounts[c.programme] || 0) + 1; });
    var progEntries = Object.entries(progCounts).sort(function (a, b) { return b[1] - a[1]; });
    var topProgs = progEntries.slice(0, 8);
    var otherCount = progEntries.slice(8).reduce(function (s, e) { return s + e[1]; }, 0);
    if (otherCount > 0) topProgs.push(['Other', otherCount]);
    chartInstances.push(new Chart(document.getElementById('chart-programme'), {
      type: 'doughnut',
      data: {
        labels: topProgs.map(function (e) { return e[0]; }),
        datasets: [{ data: topProgs.map(function (e) { return e[1]; }), backgroundColor: PROG_COLORS.slice(0, topProgs.length), borderWidth: 0 }]
      },
      options: { plugins: { legend: { position: 'bottom' } }, cutout: '55%' }
    }));

    // Status chart
    var openC = allCalls.filter(function (c) { return c.callStatus === 'open'; }).length;
    var forthC = allCalls.filter(function (c) { return c.callStatus === 'forthcoming'; }).length;
    chartInstances.push(new Chart(document.getElementById('chart-status'), {
      type: 'doughnut',
      data: {
        labels: ['Open', 'Forthcoming'],
        datasets: [{ data: [openC, forthC], backgroundColor: ['#66bb6a', '#ff9800'], borderWidth: 0 }]
      },
      options: { plugins: { legend: { position: 'bottom' } }, cutout: '55%' }
    }));

    // Type chart
    var typeCounts = {};
    allCalls.forEach(function (c) {
      var t = c.actionType || 'Other';
      typeCounts[t] = (typeCounts[t] || 0) + 1;
    });
    var typeEntries = Object.entries(typeCounts).sort(function (a, b) { return b[1] - a[1]; });
    var TYPE_COLORS = {
      RIA: '#42a5f5', IA: '#ff9800', CSA: '#66bb6a', Grant: '#78909c',
      Prize: '#ffd600', CoFund: '#ab47bc', MSCA: '#b388ff', 'MSCA-SE': '#b388ff',
      PPI: '#ef5350', Other: '#546e7a'
    };
    chartInstances.push(new Chart(document.getElementById('chart-type'), {
      type: 'doughnut',
      data: {
        labels: typeEntries.map(function (e) { return e[0]; }),
        datasets: [{
          data: typeEntries.map(function (e) { return e[1]; }),
          backgroundColor: typeEntries.map(function (e) { return TYPE_COLORS[e[0]] || '#546e7a'; }),
          borderWidth: 0
        }]
      },
      options: { plugins: { legend: { position: 'bottom' } }, cutout: '55%' }
    }));
  }

  /* ── Filters ── */
  function buildFilters() {
    var progs = [];
    var progCounts = {};
    allCalls.forEach(function (c) { progCounts[c.programme] = (progCounts[c.programme] || 0) + 1; });
    progs = Object.keys(progCounts).sort(function (a, b) { return progCounts[b] - progCounts[a]; });

    var types = Array.from(new Set(allCalls.map(function (c) { return c.actionType; }).filter(Boolean))).sort();
    var statuses = ['open', 'forthcoming'];
    var stages = Array.from(new Set(allCalls.map(function (c) { return stageLabel(c.stage); })));

    renderPills('filter-programme', progs.slice(0, 10), function (p) {
      var short = PROG_SHORT[p] || p;
      return short + ' (' + progCounts[p] + ')';
    }, 'programme');
    renderPills('filter-status', statuses, function (s) { return s.charAt(0).toUpperCase() + s.slice(1); }, 'status');
    renderPills('filter-type', types.slice(0, 10), function (t) { return t; }, 'type');
    renderPills('filter-stage', stages, function (s) { return s; }, 'stage');
  }

  function renderPills(containerId, items, labelFn, filterKey) {
    document.getElementById(containerId).innerHTML = items.map(function (item) {
      var active = activeFilters[filterKey].has(item) ? ' active' : '';
      return '<button class="pill' + active + '" data-filter="' + filterKey + '" data-value="' + esc(item) + '">' + labelFn(item) + '</button>';
    }).join('');
  }

  /* ── Programme Tabs ── */
  function buildProgrammeTabs() {
    var container = document.getElementById('programme-tabs');
    var counts = { all: allCalls.length };
    allCalls.forEach(function (c) { counts[c.programme] = (counts[c.programme] || 0) + 1; });
    var progsSorted = Object.keys(counts)
      .filter(function (k) { return k !== 'all'; })
      .sort(function (a, b) { return counts[b] - counts[a]; });

    var tabs = [{ key: 'all', label: 'All (' + counts.all + ')' }];
    progsSorted.slice(0, 7).forEach(function (p) {
      var short = PROG_SHORT[p] || p;
      tabs.push({ key: p, label: short + ' (' + counts[p] + ')' });
    });

    container.innerHTML = tabs.map(function (t) {
      var active = t.key === activeProgrammeTab ? ' active' : '';
      return '<button class="programme-tab' + active + '" data-programme="' + esc(t.key) + '">' + t.label + '</button>';
    }).join('');
  }

  /* ── Table ── */
  function getFilteredCalls() {
    var filtered;
    var isSearching = !!searchQuery;

    if (isSearching) {
      filtered = smartSearch(searchQuery);
      if (!filtered) filtered = allCalls.slice();
    } else {
      filtered = allCalls.slice();
    }

    if (activeProgrammeTab !== 'all') {
      filtered = filtered.filter(function (c) { return c.programme === activeProgrammeTab; });
    }
    if (activeFilters.programme.size) {
      filtered = filtered.filter(function (c) { return activeFilters.programme.has(c.programme); });
    }
    if (activeFilters.status.size) {
      filtered = filtered.filter(function (c) { return activeFilters.status.has(c.callStatus); });
    }
    if (activeFilters.type.size) {
      filtered = filtered.filter(function (c) { return activeFilters.type.has(c.actionType); });
    }
    if (activeFilters.stage.size) {
      filtered = filtered.filter(function (c) { return activeFilters.stage.has(stageLabel(c.stage)); });
    }

    var dir = sortDirection === 'asc' ? 1 : -1;
    filtered.sort(function (a, b) {
      var selA = selectedIds.has(a.topicId) ? 0 : (sharedIds.has(a.topicId) ? 1 : 2);
      var selB = selectedIds.has(b.topicId) ? 0 : (sharedIds.has(b.topicId) ? 1 : 2);
      if (selA !== selB) return selA - selB;
      var cmp = compareByColumn(a, b, sortColumn);
      if (cmp !== 0) return cmp * dir;
      return a.topicId.localeCompare(b.topicId);
    });

    return filtered;
  }

  function compareByColumn(a, b, col) {
    switch (col) {
      case 'topicId':
        return a.topicId.localeCompare(b.topicId);
      case 'title':
        return (a.title || '').localeCompare(b.title || '');
      case 'type':
        return (a.actionType || '').localeCompare(b.actionType || '');
      case 'programme':
        return (a.programme || '').localeCompare(b.programme || '');
      case 'deadline':
        return (a.deadline || 'z').localeCompare(b.deadline || 'z');
      default:
        return 0;
    }
  }

  function renderTable() {
    var isSearching = !!searchQuery;
    var filtered = getFilteredCalls();
    var totalFiltered = filtered.length;
    var totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));

    if (currentPage > totalPages) currentPage = totalPages;

    var countEl = document.getElementById('search-count');
    countEl.textContent = totalFiltered + ' call' + (totalFiltered !== 1 ? 's' : '');

    var noResults = document.getElementById('no-results');
    var tbody = document.getElementById('topic-tbody');

    if (totalFiltered === 0) {
      tbody.innerHTML = '';
      noResults.classList.add('visible');
      renderPagination(0, 0);
      return;
    }
    noResults.classList.remove('visible');

    var startIdx = (currentPage - 1) * PAGE_SIZE;
    var pageItems = filtered.slice(startIdx, startIdx + PAGE_SIZE);

    var html = '';
    var lastProgramme = '';

    pageItems.forEach(function (c) {
      if (!isSearching) {
        var pg = c.programme || '';
        if (pg !== lastProgramme) {
          html += '<tr class="subgroup-row"><td colspan="6">' + esc(pg) + '</td></tr>';
          lastProgramme = pg;
        }
      }

      var isSel = selectedIds.has(c.topicId);
      var isShared = sharedIds.has(c.topicId);
      var rowClass = isSel ? ' class="row-selected"' : (isShared ? ' class="row-shared"' : '');
      var starClass = isSel ? ' star-btn--active' : (isShared ? ' star-btn--shared' : '');
      var starLabel = isSel ? 'Remove from selections' : 'Add to selections';
      var statusBadge = '<span class="badge badge-' + c.callStatus + '">' + esc(c.callStatus) + '</span>';
      var typeBadge = c.actionType ? '<span class="badge ' + badgeClass(c.actionType) + '">' + esc(c.actionType) + '</span>' : '';
      var stageBadge = c.stage !== 'single' ? '<span class="badge badge-stage">' + stageLabel(c.stage) + '</span>' : '';
      var progShort = PROG_SHORT[c.programme] || c.programme || '';

      html += '<tr' + rowClass + '>' +
        '<td class="col-star"><button class="star-btn' + starClass + '" data-topic="' + esc(c.topicId) + '" aria-label="' + starLabel + '" title="' + starLabel + '">&#9733;</button></td>' +
        '<td class="col-id"><a class="topic-id-link" href="' + c.portalUrl + '" target="_blank" rel="noopener">' + esc(c.topicId) + '</a></td>' +
        '<td class="col-title"><span class="topic-title-text">' + esc(c.title) + '</span></td>' +
        '<td class="col-type">' + typeBadge + statusBadge + stageBadge + '</td>' +
        '<td class="col-programme"><span class="badge badge-programme">' + esc(progShort) + '</span></td>' +
        '<td class="col-deadline">' + (c.deadline ? formatDeadline(c.deadline) : '\u2014') + '</td>' +
      '</tr>';
    });

    tbody.innerHTML = html;
    renderPagination(totalFiltered, totalPages);
    updateSortIndicators();
  }

  function updateSortIndicators() {
    document.querySelectorAll('.topic-table thead th[data-sort]').forEach(function (th) {
      var col = th.dataset.sort;
      th.classList.toggle('sort-active', col === sortColumn);
      th.classList.toggle('sort-asc', col === sortColumn && sortDirection === 'asc');
      th.classList.toggle('sort-desc', col === sortColumn && sortDirection === 'desc');
    });
  }

  /* ── Pagination ── */
  function renderPagination(totalFiltered, totalPages) {
    var container = document.getElementById('pagination');
    if (totalPages <= 1) { container.innerHTML = ''; return; }

    var startItem = (currentPage - 1) * PAGE_SIZE + 1;
    var endItem = Math.min(currentPage * PAGE_SIZE, totalFiltered);

    var html = '<span class="pagination__info">Showing ' + startItem + '\u2013' + endItem + ' of ' + totalFiltered + '</span>';
    html += '<div class="pagination__buttons">';

    html += '<button class="pagination__btn" data-page="1" ' + (currentPage === 1 ? 'disabled' : '') + '>&laquo;</button>';
    html += '<button class="pagination__btn" data-page="' + (currentPage - 1) + '" ' + (currentPage === 1 ? 'disabled' : '') + '>&lsaquo; Prev</button>';

    var pages = getPageRange(currentPage, totalPages);
    pages.forEach(function (p) {
      if (p === '...') {
        html += '<span class="pagination__ellipsis">&hellip;</span>';
      } else {
        html += '<button class="pagination__btn pagination__num' + (p === currentPage ? ' active' : '') + '" data-page="' + p + '">' + p + '</button>';
      }
    });

    html += '<button class="pagination__btn" data-page="' + (currentPage + 1) + '" ' + (currentPage === totalPages ? 'disabled' : '') + '>Next &rsaquo;</button>';
    html += '<button class="pagination__btn" data-page="' + totalPages + '" ' + (currentPage === totalPages ? 'disabled' : '') + '>&raquo;</button>';

    html += '</div>';
    container.innerHTML = html;
  }

  function getPageRange(current, total) {
    if (total <= 7) {
      var all = [];
      for (var i = 1; i <= total; i++) all.push(i);
      return all;
    }
    var pages = [];
    pages.push(1);
    if (current > 3) pages.push('...');
    for (var j = Math.max(2, current - 1); j <= Math.min(total - 1, current + 1); j++) {
      pages.push(j);
    }
    if (current < total - 2) pages.push('...');
    pages.push(total);
    return pages;
  }

  function goToPage(page) {
    var scrollY = window.scrollY;
    currentPage = page;
    renderTable();
    window.scrollTo(0, scrollY);
  }

  /* ── Selection ── */
  function toggleSelection(topicId) {
    var user = (typeof Auth !== 'undefined') ? Auth.getUser() : null;
    if (selectedIds.has(topicId)) {
      selectedIds.delete(topicId);
      if (user) {
        Auth.removeSelection(topicId).then(function (ok) {
          if (!ok) showToast('Failed to sync removal to server');
        });
      }
    } else {
      selectedIds.add(topicId);
      if (user) {
        Auth.saveSelection(topicId).then(function (r) {
          if (!r.ok) showToast('Save failed: ' + r.msg);
        });
      }
    }
    saveSelections();
    renderSelectedCalls();
    renderTable();
  }

  function saveSelections() {
    var user = (typeof Auth !== 'undefined') ? Auth.getUser() : null;
    var key = user ? 'selectedCalls_' + user.id : 'selectedCalls';
    localStorage.setItem(key, JSON.stringify(Array.from(selectedIds)));
  }

  function exportSelections() {
    var ids = Array.from(selectedIds);
    var json = JSON.stringify(ids, null, 2);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(json).then(function () {
        showToast('Copied ' + ids.length + ' topic IDs to clipboard');
      });
    } else {
      var ta = document.createElement('textarea');
      ta.value = json;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('Copied ' + ids.length + ' topic IDs to clipboard');
    }
  }

  function showToast(msg) {
    var el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('visible');
    setTimeout(function () { el.classList.remove('visible'); }, 2500);
  }

  /* ── Events ── */
  function bindEvents() {
    var searchInput = document.getElementById('search-input');
    var debounceTimer;

    searchInput.addEventListener('input', function () {
      searchQuery = this.value.trim();
      currentPage = 1;
      document.getElementById('search-clear').classList.toggle('visible', searchQuery.length > 0);
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(renderTable, 100);
    });

    document.getElementById('search-clear').addEventListener('click', function () {
      searchInput.value = '';
      searchQuery = '';
      currentPage = 1;
      this.classList.remove('visible');
      renderTable();
      searchInput.focus();
    });

    document.querySelector('.filters').addEventListener('click', function (e) {
      var pill = e.target.closest('.pill');
      if (!pill) return;
      var key = pill.dataset.filter;
      var val = pill.dataset.value;
      if (activeFilters[key].has(val)) {
        activeFilters[key].delete(val);
        pill.classList.remove('active');
      } else {
        activeFilters[key].add(val);
        pill.classList.add('active');
      }
      currentPage = 1;
      renderTable();
    });

    document.getElementById('filters-clear').addEventListener('click', function () {
      Object.keys(activeFilters).forEach(function (k) { activeFilters[k].clear(); });
      document.querySelectorAll('.pill.active').forEach(function (p) { p.classList.remove('active'); });
      currentPage = 1;
      renderTable();
    });

    document.getElementById('programme-tabs').addEventListener('click', function (e) {
      var tab = e.target.closest('.programme-tab');
      if (!tab) return;
      activeProgrammeTab = tab.dataset.programme;
      document.querySelectorAll('.programme-tab').forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      currentPage = 1;
      renderTable();
    });

    document.getElementById('pagination').addEventListener('click', function (e) {
      var btn = e.target.closest('.pagination__btn');
      if (!btn || btn.disabled) return;
      var page = parseInt(btn.dataset.page, 10);
      if (page && page >= 1) goToPage(page);
    });

    document.querySelector('.topic-table thead').addEventListener('click', function (e) {
      var th = e.target.closest('th[data-sort]');
      if (!th) return;
      var col = th.dataset.sort;
      if (sortColumn === col) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        sortColumn = col;
        sortDirection = col === 'deadline' ? 'asc' : 'asc';
      }
      currentPage = 1;
      renderTable();
    });

    document.getElementById('topic-tbody').addEventListener('click', function (e) {
      var star = e.target.closest('.star-btn');
      if (!star) return;
      e.preventDefault();
      toggleSelection(star.dataset.topic);
    });

    document.getElementById('export-selections').addEventListener('click', exportSelections);

    document.getElementById('clear-selections').addEventListener('click', function () {
      selectedIds.clear();
      saveSelections();
      renderSelectedCalls();
      renderTable();
    });
  }

  /* ── Helpers ── */
  function formatDeadline(dateStr) {
    if (!dateStr) return '\u2014';
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function stageLabel(stage) {
    switch (stage) {
      case 'single':      return 'Single-Stage';
      case 'two-stage':   return 'Two-Stage';
      default:            return stage || 'Single-Stage';
    }
  }

  function badgeClass(type) { return TYPE_CLASSES[type] || 'badge-ria'; }

  function esc(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  document.addEventListener('DOMContentLoaded', init);
})();
