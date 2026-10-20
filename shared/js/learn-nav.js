(() => {
  const ar = document.documentElement.lang.toLowerCase().startsWith('ar') || document.documentElement.dir === 'rtl';
  const links = ar
    ? [['/ar/', 'الرئيسية', 'hub-home'], ['/learn/ar/', 'العودة إلى ليرن', 'learn-home'], ['/ar/desktop/', 'ديسكتوب', ''], ['/ar/browser/', 'المتصفح', ''], ['/ar/go-wall/', 'Go-Wall', '']]
    : [['/', 'AppendHub Home', 'hub-home'], ['/learn/', 'Learn Home', 'learn-home'], ['/desktop/', 'Desktop', ''], ['/browser/', 'Browser', ''], ['/go-wall/', 'Go-Wall', '']];
  const nav = document.createElement('nav');
  nav.className = 'appendhub-global-nav';
  nav.setAttribute('aria-label', ar ? 'منتجات أبند هَب' : 'AppendHub products');
  for (const [href, label, cls] of links) {
    const a = document.createElement('a'); a.href = href; a.textContent = label; if (cls) a.className = cls;
    const path = location.pathname.replace(/\/$/, '') || '/';
    const target = href.replace(/\/$/, '') || '/';
    if ((path === target) || (cls === 'learn-home' && path.startsWith('/learn/')) || (href === '/go-wall/' && path.startsWith('/go-wall/'))) a.setAttribute('aria-current', 'page');
    nav.append(a);
  }
  document.body.prepend(nav);
})();
