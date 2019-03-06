'use strict';

module.exports = app => {
  const customLoader = app.config.customLoader;
  if (!customLoader) return;

  for (const key of Object.keys(customLoader)) {
    addMethod(key);
  }

  function addMethod(key) {
    const appMethodName = 'mock' + key.replace(/^[a-z]/i, s => s.toUpperCase());
    console.log(appMethodName);
    if (!app[appMethodName]) return;
    app[appMethodName] = function(service, methodName, fn) {
      if (typeof service === 'string') {
        const arr = service.split('.');
        service = this[key + 'Classes'];
        for (const key of arr) {
          service = service[key];
        }
        service = service.prototype || service;
      }
      this._mockFn(service, methodName, fn);
      return this;
    };
  }
};
