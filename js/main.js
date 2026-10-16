/**
 * 日本動物共助機構 (AMAJ) - Official Portal Scripts
 * 事務的・公的機関ポータル用スクリプト
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initContactForm();
});

/**
 * モバイル用ナビゲーションメニューの開閉制御
 */
function initMobileNav() {
  const toggleBtn = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (!toggleBtn || !navMenu) return;

  function toggleMenu(isOpen) {
    const shouldOpen = isOpen !== undefined ? isOpen : !navMenu.classList.contains('is-open');
    navMenu.classList.toggle('is-open', shouldOpen);
    toggleBtn.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    toggleBtn.setAttribute('aria-label', shouldOpen ? 'メニューを閉じる' : 'メニューを開く');
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // メニュー内のリンクをクリックした時にメニューを閉じる
  const navLinks = navMenu.querySelectorAll('.nav-item');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu(false);
    });
  });

  // 画面外クリックで閉じる
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('is-open') && !navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
      toggleMenu(false);
    }
  });

  // Escapeキーで閉じる
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
      toggleMenu(false);
      toggleBtn.focus();
    }
  });
}

/**
 * 事務局お問い合わせフォーム送信ハンドラ（擬似送信）
 */
function initContactForm() {
  const form = document.getElementById('amajContactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    btn.disabled = true;
    btn.textContent = '送信処理中...';

    setTimeout(() => {
      btn.textContent = '送信完了';
      btn.style.backgroundColor = 'var(--status-green)';

      const alertBox = document.createElement('div');
      alertBox.style.cssText = `
        background-color: #F0FFF4;
        border: 1px solid #9AE6B4;
        color: #22543D;
        padding: 14px 18px;
        margin-top: 20px;
        font-size: 0.9rem;
        border-radius: var(--radius-sm);
      `;
      alertBox.innerHTML = '<strong>送信を受け付けました。</strong><br>内容を確認の上、担当者よりご連絡差し上げます。';
      form.appendChild(alertBox);

      form.reset();
    }, 800);
  });
}

