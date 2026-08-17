/**
 * AFC Pet Finder — Core App Logic
 */

const AFC = {
  // ─── Navigation ───────────────────────────────────────
  initNav() {
    const nav = document.querySelector('.nav');
    const burger = document.querySelector('.nav-burger');
    const links = document.querySelector('.nav-links');

    if (nav) {
      window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 20);
      });
    }

    if (burger && links) {
      burger.addEventListener('click', () => {
        links.classList.toggle('open');
      });
    }

    // PWA Install button creation dynamically
    const navInner = document.querySelector('.nav-inner');
    if (navInner && !document.getElementById('pwaInstallBtn')) {
      const installBtn = document.createElement('button');
      installBtn.id = 'pwaInstallBtn';
      installBtn.className = 'btn pwa-install-btn';
      installBtn.innerHTML = '<i class="fas fa-download"></i> <span class="pwa-btn-text">アプリをインストール</span>';
      
      // Hide button if already installed (standalone mode)
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
      if (isStandalone) {
        installBtn.style.display = 'none';
      }

      installBtn.addEventListener('click', async () => {
        if (!window.deferredPrompt) {
          await new Promise(r => setTimeout(r, 300));
        }

        if (window.deferredPrompt) {
          try {
            await window.deferredPrompt.prompt();
            const choiceResult = await window.deferredPrompt.userChoice;
            if (choiceResult && choiceResult.outcome === 'accepted') {
              window.deferredPrompt = null;
              installBtn.style.display = 'none';
            }
          } catch (err) {
            console.error('PWA install prompt error:', err);
            AFC.showPwaGuide();
          }
        } else {
          if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
            if (typeof AFC !== 'undefined' && AFC.showToast) {
              AFC.showToast({ title: 'アプリ起動中', body: 'すでにホーム画面に追加されています！' }, 'info');
            } else {
              alert('すでにアプリはホーム画面にインストールされています！');
            }
          } else {
            AFC.showPwaGuide();
          }
        }
      });

      // Insert before burger menu or at the end of nav-inner
      if (burger) {
        navInner.insertBefore(installBtn, burger);
      } else {
        navInner.appendChild(installBtn);
      }
    }

    // Set active nav link
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.includes(currentPage.replace('.html', ''))) {
        link.classList.add('active');
      }
    });
  },

  // ─── Stats Counter Animation ───────────────────────────
  animateCounter(el, target, duration = 1500) {
    let start = 0;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  },

  initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-counter'));
          AFC.animateCounter(el, target);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  },

  // ─── Tag Selector ─────────────────────────────────────
  initTagSelectors() {
    document.querySelectorAll('.tag-option').forEach(tag => {
      tag.addEventListener('click', () => {
        const group = tag.closest('.tag-group');
        const multi = group?.dataset.multi === 'true';
        if (!multi) group?.querySelectorAll('.tag-option').forEach(t => t.classList.remove('selected'));
        tag.classList.toggle('selected');
        AFC.updateTagInput(group);
      });
    });
  },

  updateTagInput(group) {
    if (!group) return;
    const inputId = group.dataset.input;
    if (!inputId) return;
    const input = document.getElementById(inputId);
    if (!input) return;
    const selected = [...group.querySelectorAll('.tag-option.selected')].map(t => t.dataset.value || t.textContent.trim());
    input.value = selected.join(',');
    input.dispatchEvent(new Event('change', { bubbles: true }));
  },

  getSelectedTags(groupEl) {
    if (!groupEl) return [];
    return [...groupEl.querySelectorAll('.tag-option.selected')].map(t => t.dataset.value || t.textContent.trim());
  },

  // ─── Multi-step Form ──────────────────────────────────
  currentStep: 1,
  totalSteps: 4,

  initMultiStep() {
    const steps = document.querySelectorAll('.step-panel');
    if (!steps.length) return;
    AFC.showStep(1);
    AFC.updateStepUI();
  },

  showStep(n) {
    document.querySelectorAll('.step-panel').forEach((panel, i) => {
      panel.classList.toggle('hidden', i + 1 !== n);
    });
    AFC.currentStep = n;
    AFC.updateStepUI();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  updateStepUI() {
    document.querySelectorAll('.step').forEach((stepEl, i) => {
      const num = i + 1;
      stepEl.classList.remove('active', 'done');
      if (num === AFC.currentStep) stepEl.classList.add('active');
      if (num < AFC.currentStep) stepEl.classList.add('done');
    });

    const progress = document.querySelector('.progress-fill');
    if (progress) {
      progress.style.width = ((AFC.currentStep - 1) / (AFC.totalSteps - 1) * 100) + '%';
    }

    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');

    if (nextBtn) nextBtn.classList.toggle('hidden', AFC.currentStep === AFC.totalSteps);
    if (prevBtn) prevBtn.classList.toggle('hidden', AFC.currentStep === 1);
    if (submitBtn) submitBtn.classList.toggle('hidden', AFC.currentStep !== AFC.totalSteps);
  },

  nextStep() {
    if (AFC.currentStep < AFC.totalSteps) AFC.showStep(AFC.currentStep + 1);
  },

  prevStep() {
    if (AFC.currentStep > 1) AFC.showStep(AFC.currentStep - 1);
  },

  // ─── Photo Upload ─────────────────────────────────────
  initPhotoUpload() {
    const area = document.querySelector('.photo-upload-area');
    if (!area) return;

    const input = area.querySelector('input[type="file"]');
    const preview = document.querySelector('.photo-preview-grid');

    area.addEventListener('click', () => input?.click());

    area.addEventListener('dragover', (e) => {
      e.preventDefault();
      area.classList.add('dragover');
    });

    area.addEventListener('dragleave', () => area.classList.remove('dragover'));

    area.addEventListener('drop', (e) => {
      e.preventDefault();
      area.classList.remove('dragover');
      const files = e.dataTransfer.files;
      AFC.handleFiles(files, preview);
    });

    input?.addEventListener('change', () => AFC.handleFiles(input.files, preview));
  },

  handleFiles(files, preview) {
    if (!preview) return;
    [...files].forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const thumb = document.createElement('div');
        thumb.className = 'photo-thumb';
        thumb.innerHTML = `
          <img src="${e.target.result}" alt="写真">
          <button class="remove-btn" onclick="this.parentElement.remove()">✕</button>
        `;
        preview.appendChild(thumb);
      };
      reader.readAsDataURL(file);
    });
  },

  // ─── Location Blur / Map Pin ──────────────────────────
  initLocationPicker(mapId, latId, lngId, blurRadius = 300) {
    const container = document.getElementById(mapId);
    if (!container || typeof L === 'undefined') return;

    const map = L.map(mapId, {
      center: [35.6812, 139.7671],
      zoom: 14,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors © CARTO',
      maxZoom: 19
    }).addTo(map);

    let marker = null;
    let circle = null;

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      if (latId) document.getElementById(latId).value = lat.toFixed(6);
      if (lngId) document.getElementById(lngId).value = lng.toFixed(6);

      if (marker) marker.remove();
      if (circle) circle.remove();

      marker = L.marker([lat, lng], {
        icon: L.divIcon({
          className: '',
          html: `<div style="width:16px;height:16px;background:#C9A84C;border-radius:50%;border:3px solid white;box-shadow:0 0 10px rgba(201,168,76,0.8);"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        })
      }).addTo(map);

      // Blur circle (privacy)
      circle = L.circle([lat, lng], {
        radius: blurRadius,
        color: '#C9A84C',
        fillColor: '#C9A84C',
        fillOpacity: 0.08,
        weight: 1.5,
        dashArray: '6, 4'
      }).addTo(map);
    });

    return map;
  },

  // ─── Notification Toast ───────────────────────────────
  showToast(message, type = 'info', duration = 4000) {
    const icons = { info: 'ℹ️', success: '✅', warning: '⚠️', match: '🎯' };
    const toast = document.createElement('div');
    toast.className = 'notification-toast';
    toast.innerHTML = `
      <div style="display:flex;align-items:flex-start;gap:12px;">
        <span style="font-size:1.3rem;flex-shrink:0">${icons[type] || icons.info}</span>
        <div>
          <p style="font-size:0.9rem;font-weight:600;margin-bottom:4px;color:var(--text-primary)">${message.title || ''}</p>
          <p style="font-size:0.8rem;color:var(--text-secondary)">${message.body || message}</p>
        </div>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), duration + 300);
  },

  // ─── Match Alert Simulation ───────────────────────────
  simulateMatchAlert(petData) {
    setTimeout(() => {
      AFC.showToast({
        title: '🎯 マッチングの可能性あり！',
        body: `${petData?.name || '登録された子'}の特徴と一致する保護報告が見つかりました。確認してください。`
      }, 'match', 6000);
    }, 2000);
  },

  // ─── Push Notification Simulation ────────────────────
  simulatePushNotification() {
    const notifications = [
      { title: '📍 近くで迷子が発生！', body: '新宿区内で柴犬の迷子が報告されました。お心当たりがあればご連絡を。' },
      { title: '✨ マッチング成立の可能性', body: '黒猫「クロ」ちゃんと一致する保護情報が投稿されました！' },
      { title: '🏛️ 行政センターに保護情報', body: '杉並区のセンターに、探している子に似た猫が収容されています。' }
    ];
    const n = notifications[Math.floor(Math.random() * notifications.length)];
    AFC.showToast(n, 'match');
  },

  // ─── Chat ─────────────────────────────────────────────
  initChat() {
    const sendBtn = document.querySelector('.chat-send-btn');
    const input = document.querySelector('.chat-input');
    const messages = document.querySelector('.chat-messages');

    if (!sendBtn || !input || !messages) return;

    function sendMessage() {
      const text = input.value.trim();
      if (!text) return;

      const msg = document.createElement('div');
      msg.className = 'message sent animate-fade-in';
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
      msg.innerHTML = `
        <div class="message-bubble">${AFC.escapeHtml(text)}</div>
        <span class="message-time">${time}</span>
      `;
      messages.appendChild(msg);
      input.value = '';
      messages.scrollTop = messages.scrollHeight;

      // Auto reply demo
      setTimeout(() => {
        const reply = document.createElement('div');
        reply.className = 'message received animate-fade-in';
        reply.innerHTML = `
          <img src="https://ui-avatars.com/api/?name=保護主&background=1A5C3A&color=fff&size=36" class="chat-avatar" alt="avatar">
          <div>
            <div class="message-bubble">ありがとうございます。現在も保護中です。場所は〇〇公園の近くです。</div>
            <span class="message-time">${time}</span>
          </div>
        `;
        messages.appendChild(reply);
        messages.scrollTop = messages.scrollHeight;
      }, 1500);
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  },

  escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  },

  // ─── QR Code Generation ───────────────────────────────
  generateQR(elementId, url) {
    const el = document.getElementById(elementId);
    if (!el || typeof QRCode === 'undefined') return;
    el.innerHTML = '';
    new QRCode(el, {
      text: url,
      width: 120,
      height: 120,
      colorDark: '#1A5C3A',
      colorLight: '#FFFFFF',
      correctLevel: QRCode.CorrectLevel.H
    });
  },

  // ─── PDF / Poster ─────────────────────────────────────
  downloadPDF(elementId, filename = '迷子ポスター.pdf') {
    const el = document.getElementById(elementId);
    if (!el || typeof html2pdf === 'undefined') {
      alert('PDFライブラリを読み込み中です。しばらくお待ちください。');
      return;
    }
    const opt = {
      margin: [10, 10, 10, 10],
      filename,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(el).save();
  },

  // ─── SNS Share ────────────────────────────────────────
  shareToX(text, url) {
    const encoded = encodeURIComponent(text + '\n' + url);
    window.open(`https://twitter.com/intent/tweet?text=${encoded}`, '_blank', 'width=600,height=400');
  },

  copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      AFC.showToast({ title: 'コピー完了', body: 'クリップボードにコピーしました' }, 'success', 2000);
    });
  },

  // ─── Scroll Animations ───────────────────────────────
  initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = ''; // インラインの opacity: 0 をクリア
          entry.target.classList.add('animate-fade-in-up');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.card, .pet-card, [data-animate]').forEach(el => {
      // フォームのstep-panel内のカードはアニメーション対象外にする
      // （step-panelの表示/非表示はhiddenクラスで制御するため）
      if (el.closest('.step-panel') || el.closest('#lostForm') || el.closest('#foundForm')) return;
      el.style.opacity = '0';
      observer.observe(el);
    });
  },

  // ─── Filter / Search ─────────────────────────────────
  filterPetCards(query, animal) {
    document.querySelectorAll('.pet-card').forEach(card => {
      const text = card.textContent.toLowerCase();
      const animalAttr = card.dataset.animal || '';
      const matchQuery = !query || text.includes(query.toLowerCase());
      const matchAnimal = !animal || animal === 'all' || animalAttr === animal;
      card.closest('[data-card-wrap]')?.classList.toggle('hidden', !(matchQuery && matchAnimal));
    });
  },
  showPwaGuide() {
    let overlay = document.getElementById('pwaModalOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'pwaModalOverlay';
      overlay.className = 'pwa-modal-overlay';
      overlay.innerHTML = `
        <div class="pwa-modal">
          <div class="pwa-modal-header">
            <div class="pwa-modal-title"><i class="fas fa-download"></i> アプリをインストール</div>
            <button class="pwa-modal-close" id="pwaModalClose">✕</button>
          </div>
          <div class="pwa-modal-app-info">
            <img src="icons/afc-logo.png" class="pwa-modal-app-icon" alt="AFC">
            <div>
              <div class="pwa-modal-app-name">AnimalFinderConnect</div>
              <div class="pwa-modal-app-desc">日本動物共助機構 — 迷子ペット捜索</div>
            </div>
          </div>
          <div class="pwa-guide-body" id="pwaGuideBody"></div>
        </div>
      `;
      document.body.appendChild(overlay);
      
      const closeBtn = overlay.querySelector('#pwaModalClose');
      closeBtn.addEventListener('click', () => overlay.classList.remove('open'));
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('open');
      });
    }

    // Detect Environment
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isSafari = isIOS && /Safari/.test(navigator.userAgent) && !/CriOS/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    const isFileProtocol = window.location.protocol === 'file:';

    const guideBody = overlay.querySelector('#pwaGuideBody');
    guideBody.innerHTML = '';

    let steps = [];

    if (isFileProtocol) {
      steps = [
        { icon: '1', text: '本アプリは、インターネット上の公式ウェブサイトから直接インストールすることができます。' },
        { icon: '2', text: '現在はダウンロードしたファイルを直接開いているため、インストールボタンが動作しません。インターネット上の公式サイト（<strong>https://</strong> から始まるウェブページ）にアクセスして本ボタンをクリックしてください。' }
      ];
    } else if (isIOS) {
      if (isSafari) {
        steps = [
          { icon: '1', text: '画面下部のツールバーにある「<strong>共有ボタン</strong>」 📤 をタップします。' },
          { icon: '2', text: 'メニューを下にスクロールし、「<strong>ホーム画面に追加</strong>」 ➕ をタップします。' },
          { icon: '3', text: '右上の「<strong>追加</strong>」をタップすると、ホーム画面にAFCアプリが追加されます。' }
        ];
      } else {
        steps = [
          { icon: '1', text: 'iPhoneの標準ブラウザ（<strong>Safari</strong>）でこのページを開き直してください。' },
          { icon: '2', text: '共有メニュー 📤 から「<strong>ホーム画面に追加</strong>」 ➕ を選択してください。' }
        ];
      }
    } else if (isAndroid) {
      steps = [
        { icon: '1', text: 'ブラウザのメニューアイコン（右上の<strong>3つの点</strong> ︙ ）をタップします。' },
        { icon: '2', text: '「<strong>アプリをインストール</strong>」または「<strong>ホーム画面に追加</strong>」をタップします。' },
        { icon: '3', text: '確認画面が表示されるので「<strong>インストール</strong>」をタップします。' }
      ];
    } else {
      steps = [
        { icon: '1', text: 'ブラウザのアドレスバー（URL表示欄）の右側にある「<strong>インストール</strong>」アイコンをクリックします。' },
        { icon: '2', text: 'または、ブラウザ右上のメニュー（︙）から「<strong>アプリをインストール...</strong>」を選択します。' }
      ];
    }

    steps.forEach(step => {
      const stepEl = document.createElement('div');
      stepEl.className = 'pwa-guide-step';
      stepEl.innerHTML = `
        <div class="pwa-step-icon">${step.icon}</div>
        <div class="pwa-step-desc">${step.text}</div>
      `;
      guideBody.appendChild(stepEl);
    });

    overlay.classList.add('open');
  },

  // ─── Initialize ───────────────────────────────────────
  init() {
    AFC.initNav();
    AFC.initCounters();
    AFC.initTagSelectors();
    AFC.initScrollAnimations();
    AFC.initPhotoUpload();
    AFC.initMultiStep();
    AFC.initChat();

    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then(reg => console.log('ServiceWorker registered:', reg))
          .catch(err => console.error('ServiceWorker registration failed:', err));
      });
    }
  }
};

// Global PWA Install Event Handlers
window.deferredPrompt = window.deferredPrompt || null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.deferredPrompt = e;
  console.log('⚡ beforeinstallprompt captured!');
  const installBtn = document.getElementById('pwaInstallBtn');
  if (installBtn) {
    installBtn.style.display = 'inline-flex';
  }
});

window.addEventListener('appinstalled', (e) => {
  window.deferredPrompt = null;
  const installBtn = document.getElementById('pwaInstallBtn');
  if (installBtn) {
    installBtn.style.display = 'none';
  }
  if (typeof AFC !== 'undefined' && AFC.showToast) {
    AFC.showToast({ title: 'インストール完了', body: 'AFC Pet Finderがホーム画面に追加されました！' }, 'success');
  }
});

// Auto-init when DOM ready
document.addEventListener('DOMContentLoaded', () => AFC.init());
