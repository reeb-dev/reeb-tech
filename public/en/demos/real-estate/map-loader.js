(function () {
  const map = document.getElementById("mapaComarca");
  if (!map) return;

  let loading = false;
  function loadMap() {
    if (loading || window.L) return;
    loading = true;

    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    css.crossOrigin = "";
    document.head.appendChild(css);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.crossOrigin = "";
    script.onload = function () {
      if (typeof pintarMapaComarca === "function") pintarMapaComarca();
    };
    document.head.appendChild(script);
  }

  if (!("IntersectionObserver" in window)) {
    loadMap();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    loadMap();
  }, { rootMargin: "500px 0px" });
  observer.observe(map);
})();
