(function () {
  const prefix = "en-real-estate:";
  const isRealEstateKey = (key) => String(key || "").startsWith("inmobiliaria-demo-");
  const namespaced = (key) => isRealEstateKey(key) ? prefix + key : key;
  const getItem = Storage.prototype.getItem;
  const setItem = Storage.prototype.setItem;
  const removeItem = Storage.prototype.removeItem;

  Storage.prototype.getItem = function (key) {
    return getItem.call(this, this === window.localStorage ? namespaced(key) : key);
  };

  Storage.prototype.setItem = function (key, value) {
    return setItem.call(this, this === window.localStorage ? namespaced(key) : key, value);
  };

  Storage.prototype.removeItem = function (key) {
    return removeItem.call(this, this === window.localStorage ? namespaced(key) : key);
  };
})();
