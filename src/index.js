let isInited = false;

const onload = () => {
  if (isInited) {
    return;
  }
  isInited = true;

  console.log('dita init');
};

if (document !== undefined) {
  if (document.readyState === 'complete') {
    onload();
  } else {
    window.onload = onload;
    // $.bind(window, 'load', onload);
  }
} else {
  // if document does not exist, wait for it
  let loadTimer;
  const pollingDocument = () => {
    if (!!document && document.readyState === 'complete') {
      if (loadTimer) {
        clearTimeout(loadTimer);
      }
      onload();
    } else {
      loadTimer = setTimeout(pollingDocument, 1);
    }
  };
  loadTimer = setTimeout(pollingDocument, 1);
}
