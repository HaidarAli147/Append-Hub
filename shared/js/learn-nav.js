(() => {
  const ar = document.documentElement.lang.toLowerCase().startsWith('ar') || document.documentElement.dir === 'rtl';
  const links = ar
    ? [['/ar/', 'الرئيسية', 'hub-home'], ['/learn/ar/', 'العودة إلى ليرن', 'learn-home'], ['/ar/desktop/', 'ديسكتوب', ''], ['/ar/browser/', 'المتصفح', ''], ['/ar/go-wall/', 'Goaaal', '']]
    : [['/', 'AppendHub Home', 'hub-home'], ['/learn/', 'Learn Home', 'learn-home'], ['/desktop/', 'Desktop', ''], ['/browser/', 'Browser', ''], ['/go-wall/', 'Goaaal', '']];
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

  // One social footer for every AppendHub product page using this shared script.
  // Do not inject into independent apps or create a second footer.
  const footer = document.querySelector('footer.footer');
  if (footer && !footer.querySelector('.appendhub-social-links')) {
    const section = document.createElement('div');
    section.className = 'appendhub-social-links';
    section.setAttribute('aria-label', ar ? 'حسابات أبند هَب الرسمية' : 'AppendHub social channels');

    const heading = document.createElement('span');
    heading.className = 'appendhub-social-heading';
    heading.textContent = ar ? 'تابعنا' : 'Follow AppendHub';
    section.append(heading);

    const channels = [
      ['Instagram', '@append_hub', 'https://www.instagram.com/append_hub/'],
      ['Instagram', '@append_hub_arabic', 'https://www.instagram.com/append_hub_arabic/'],
      ['YouTube', '@append_hub', 'https://www.youtube.com/@append_hub'],
      ['YouTube', '@append_hub_arabic', 'https://www.youtube.com/@append_hub_arabic']
    ];
    for (const [platform, handle, url] of channels) {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = platform + ' · ' + handle;
      link.setAttribute('aria-label', platform + ' ' + handle + (ar ? ' (يفتح في تبويب جديد)' : ' (opens in a new tab)'));
      section.append(link);
    }
    const copyright = footer.querySelector('small');
    if (copyright) copyright.before(section);
    else footer.append(section);
  }
})();
