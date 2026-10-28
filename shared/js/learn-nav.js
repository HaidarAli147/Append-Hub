(() => {
  const ar = document.documentElement.lang.toLowerCase().startsWith('ar') || document.documentElement.dir === 'rtl';
  const links = ar
    ? [['/ar/', 'الرئيسية', 'hub-home'], ['/learn/ar/', 'العودة إلى ليرن', 'learn-home'], ['/ar/desktop/', 'ديسكتوب', ''], ['/ar/browser/', 'المتصفح', ''], ['/ar/go-wall/', 'Goaaal', ''], ['/projects/', 'المشاريع', '']]
    : [['/', 'AppendHub Home', 'hub-home'], ['/learn/', 'Learn Home', 'learn-home'], ['/desktop/', 'Desktop', ''], ['/browser/', 'Browser', ''], ['/go-wall/', 'Goaaal', ''], ['/projects/', 'Projects', '']];
  const nav = document.createElement('nav');
  nav.className = 'appendhub-global-nav';
  nav.setAttribute('aria-label', ar ? 'منتجات أبند هَب' : 'AppendHub products');
  for (const [href, label, cls] of links) {
    const a = document.createElement('a'); a.href = href; a.textContent = label; if (cls) a.className = cls;
    const path = location.pathname.replace(/\/$/, '') || '/';
    const target = href.replace(/\/$/, '') || '/';
    if ((path === target) || (cls === 'learn-home' && path.startsWith('/learn/')) || (href === '/go-wall/' && path.startsWith('/go-wall/')) || (href === '/projects/' && path.startsWith('/projects/'))) a.setAttribute('aria-current', 'page');
    nav.append(a);
  }
  document.body.prepend(nav);

  // Preserve app-specific footers and provide the shared footer on content pages that lack one.
  let footer = document.querySelector('footer');
  if (!footer) {
    footer = document.createElement('footer');
    footer.className = 'footer';
    const brand = document.createElement('a');
    brand.className = 'brand';
    brand.href = ar ? '/ar/' : '/';
    const logo = document.createElement('img');
    logo.src = '/shared/assets/logos/appendhub-compact.png';
    logo.alt = '';
    const brandName = document.createElement('span');
    brandName.textContent = ar ? 'أبند هَب' : 'AppendHub';
    brand.append(logo, brandName);

    const footerNav = document.createElement('nav');
    footerNav.setAttribute('aria-label', ar ? 'تنقل التذييل' : 'Footer navigation');
    const footerLinks = ar
      ? [['/ar/', 'الرئيسية'], ['/learn/ar/', 'ليرن'], ['/ar/desktop/', 'ديسكتوب'], ['/ar/browser/', 'المتصفح'], ['/ar/go-wall/', 'Goaaal'], ['/projects/', 'المشاريع']]
      : [['/', 'Home'], ['/learn/', 'Learn'], ['/desktop/', 'Desktop'], ['/browser/', 'Browser'], ['/go-wall/', 'Goaaal'], ['/projects/', 'Projects']];
    for (const [href, label] of footerLinks) {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = label;
      footerNav.append(link);
    }

    const copyright = document.createElement('small');
    copyright.textContent = '© AppendHub';
    footer.append(brand, footerNav, copyright);
    document.body.append(footer);
  }
  if (footer?.classList.contains('footer') && !footer.querySelector('.appendhub-social-links')) {
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
