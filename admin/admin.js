const editor = document.querySelector('#position-editor');

if (editor) {
  // The open attribute also leaves the editor available when JavaScript is disabled.
  if (editor.open && typeof editor.showModal === 'function') {
    editor.removeAttribute('open');
    editor.showModal();
  }

  editor.querySelectorAll('[data-close-modal]').forEach(link => {
    link.addEventListener('click', event => {
      if (!editor.open) return;
      event.preventDefault();
      editor.close();
    });
  });

  editor.addEventListener('click', event => {
    if (event.target === editor) editor.close();
  });

  editor.addEventListener('close', () => {
    if (location.search) history.replaceState(null, '', location.pathname);
  });
}
