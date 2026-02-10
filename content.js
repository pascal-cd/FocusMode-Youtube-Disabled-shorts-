// 1. Le pedimos a Chrome que nos diga si el modo Focus está activado en la memoria
chrome.storage.local.get(['focusEnabled'], (result) => {
  
  // Por defecto, si no hay nada guardado, asumimos que está activado (true)
  const isEnabled = result.focusEnabled ?? true;

  // Si el usuario activó el bloqueo, procedemos a limpiar la página
  if (isEnabled) {
    
    // 2. Definimos una función que busca y elimina los Shorts
    const eliminarShorts = () => {
      // Estos son los "nombres" (selectors) de las secciones de Shorts en YouTube
      // Incluye el feed principal, el menú lateral y las secciones sugeridas
      const selectors = [
        'ytd-rich-section-renderer', // Secciones grandes de Shorts en el inicio
        'ytd-reel-shelf-renderer',   // Estantes de Shorts entre videos comunes
        'a[title="Shorts"]',         // El botón de Shorts en el menú lateral
        'ytd-mini-guide-entry-renderer[aria-label="Shorts"]', // Icono de Shorts en menú compacto
        'ytd-reel-item-renderer'      // Items individuales de Shorts
      ];

      // Buscamos cada uno de estos elementos en la página y los borramos físicamente
      selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(elemento => {
          elemento.remove(); // Esto elimina el elemento del HTML por completo
        });
      });
    };

    // 3. EL TRUCO DEL OBSERVADOR: YouTube carga videos nuevos mientras haces scroll.
    // Usamos MutationObserver para que nuestro script "vigile" si YouTube agrega algo nuevo.
    const observer = new MutationObserver(() => {
      eliminarShorts();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
});