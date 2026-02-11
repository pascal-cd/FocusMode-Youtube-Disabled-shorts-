// 1. Buscamos el botón en el HTML usando su ID único
const btn = document.getElementById('toggleBtn');

// 2. Al abrir el menú, le preguntamos a Chrome: "¿Cómo estaba el interruptor antes?"
// 'focusEnabled' es el nombre que le pusimos a nuestra "variable" en la memoria
chrome.storage.local.get(['focusEnabled'], (result) => {
  // Si es la primera vez que se usa, por defecto será true (Shorts bloqueados)
  let isEnabled = result.focusEnabled ?? true;
  updateUI(isEnabled);
});

// 3. Programamos qué pasa cuando alguien hace CLIC en el botón
btn.onclick = () => {
  // Primero leemos cómo está ahora
  chrome.storage.local.get(['focusEnabled'], (result) => {
    // Invertimos el estado: si estaba true pasa a false, y viceversa
    let newState = !(result.focusEnabled ?? true);
    
    // Guardamos el nuevo estado en la memoria de Chrome
    chrome.storage.local.set({ focusEnabled: newState }, () => {
      // Actualizamos los colores del botón en el menú
      updateUI(newState);
      
      // 4. Recargamos la pestaña de YouTube automáticamente
      // para que el usuario vea el cambio al instante sin apretar F5
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs[0].url.includes("youtube.com")) {
            chrome.tabs.reload(tabs[0].id);
        }
      });
    });
  });
};

// 5. Función auxiliar para cambiar el texto y el color del botón
function updateUI(isEnabled) {
  btn.textContent = isEnabled ? "Activar Shorts" : "Desactivar Shorts";
  // Si está enabled, le pone la clase 'on

} 
