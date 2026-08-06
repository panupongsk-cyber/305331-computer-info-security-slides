(function () {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const current = document.getElementById('current-slide');
  const progress = document.getElementById('progress-bar');
  let index = 0;
  let fragmentIndex = 0;

  function readHash() {
    const match = window.location.hash.match(/slide-(\d+)/);
    if (!match) return 0;
    const next = Number(match[1]) - 1;
    return Number.isFinite(next) ? Math.min(Math.max(next, 0), slides.length - 1) : 0;
  }

  function currentFragments() {
    return Array.from(slides[index]?.querySelectorAll('.fragment') || []);
  }

  function syncFragments() {
    currentFragments().forEach((fragment, i) => {
      fragment.classList.toggle('visible', i < fragmentIndex);
    });
  }

  function show(next, updateHash = true) {
    index = Math.min(Math.max(next, 0), slides.length - 1);
    fragmentIndex = 0;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
    syncFragments();
    current.textContent = String(index + 1);
    progress.style.width = `${((index + 1) / slides.length) * 100}%`;
    if (updateHash) {
      history.replaceState(null, '', `#slide-${index + 1}`);
    }
  }

  function nextStep() {
    const fragments = currentFragments();
    if (fragmentIndex < fragments.length) {
      fragmentIndex += 1;
      syncFragments();
      return;
    }
    show(index + 1);
  }

  function previousStep() {
    const fragments = currentFragments();
    if (fragmentIndex > 0 && fragments.length) {
      fragmentIndex -= 1;
      syncFragments();
      return;
    }
    show(index - 1);
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen?.();
    }
  }

  document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (['arrowright', 'pagedown', ' '].includes(key)) {
      event.preventDefault();
      nextStep();
    } else if (['arrowleft', 'pageup'].includes(key)) {
      event.preventDefault();
      previousStep();
    } else if (key === 'home') {
      show(0);
    } else if (key === 'end') {
      show(slides.length - 1);
    } else if (key === 'n') {
      document.body.classList.toggle('show-notes');
    } else if (key === 'p') {
      window.print();
    } else if (key === 'f') {
      toggleFullscreen();
    }
  });

  window.addEventListener('hashchange', () => show(readHash(), false));
  show(readHash(), !window.location.hash);
})();
