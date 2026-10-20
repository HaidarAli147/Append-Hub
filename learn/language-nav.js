(() => {
  document.querySelectorAll('.lang-dropdown').forEach((dropdown) => {
    const button = dropdown.querySelector('.lang-btn');
    if (!button) return;
    button.addEventListener('click', () => {
      const open = dropdown.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', (event) => {
      if (!dropdown.contains(event.target)) {
        dropdown.classList.remove('is-open');
        button.setAttribute('aria-expanded', 'false');
      }
    });
    dropdown.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') { dropdown.classList.remove('is-open'); button.setAttribute('aria-expanded', 'false'); button.focus(); }
    });
  });
  const ar = document.documentElement.lang.toLowerCase().startsWith('ar') || document.documentElement.dir === 'rtl';
  if (!ar) return;
  const ogEnglish='/learn/og-mode/en%20%20/';
  const toArabic=(href)=>{
    let url; try{url=new URL(href,location.href)}catch{return href}
    if(url.origin!==location.origin)return href;
    const path=url.pathname;
    if(path==='/learn/'||path==='/learn/index.html')url.pathname='/learn/ar/';
    else if(path.startsWith('/learn/en/'))url.pathname=path.replace('/learn/en/','/learn/ar/');
    else if(path.startsWith(ogEnglish))url.pathname=path.replace(ogEnglish,'/learn/og-mode/ar/');
    else if(path==='/learn/live.html')url.searchParams.set('lang','ar');
    return url.href;
  };
  document.querySelectorAll('a[href]').forEach((link)=>{
    if(link.matches('.lang,.lang-menu a,[hreflang="en"],[data-language-switch]'))return;
    const original=link.getAttribute('href');
    if(!original||/^(?:#|mailto:|tel:|javascript:|data:|blob:|\/\/)/i.test(original))return;
    const url=new URL(original,location.href); if(url.origin!==location.origin)return;
    link.href=toArabic(url.href);
  });
})();
