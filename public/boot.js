// Boot script — runs before first paint (blocking, classic script).
// Restores saved language direction to avoid LTR/RTL flash, then forces
// the dark theme class. Kept external so a strict CSP (script-src 'self')
// can remain free of 'unsafe-inline'.
(function () {
  try {
    var saved = localStorage.getItem('aura-sar-language');
    if (saved === 'ar') {
      document.documentElement.setAttribute('lang', 'ar');
      document.documentElement.setAttribute('dir', 'rtl');
    }
    document.documentElement.classList.add('dark');
  } catch (e) {}
})();
