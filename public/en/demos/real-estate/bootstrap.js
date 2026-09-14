(function () {
  let loading;

  function script(src) {
    return new Promise((resolve, reject) => {
      const element = document.createElement("script");
      element.src = src;
      element.onload = resolve;
      element.onerror = reject;
      document.body.appendChild(element);
    });
  }

  function loadApplication() {
    if (loading) return loading;
    loading = script("storage.js?v=1")
      .then(() => script("/demos/inmobiliaria/data.js?v=bariloche42"))
          .then(() => script("locale.js?v=3"))
      .then(() => script("/demos/inmobiliaria/app.js?v=bariloche39"))
      .then(() => script("map-loader.js?v=1"));
    return loading;
  }

  const search = document.querySelector(".search-box");
  ["focusin", "pointerdown", "touchstart"].forEach((eventName) => {
    search?.addEventListener(eventName, loadApplication, { once: true, passive: true });
  });

  const catalogStart = document.getElementById("zonas");
  if ("IntersectionObserver" in window && catalogStart) {
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      loadApplication();
    });
    observer.observe(catalogStart);
  } else {
    loadApplication();
  }

  document.getElementById("en-contact-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    event.currentTarget.reset();
    const status = document.getElementById("en-contact-status");
    if (status) status.textContent = "Message prepared as an example. For a real inquiry, use WhatsApp.";
  });
})();
