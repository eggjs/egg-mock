module.exports = function (app) {
  var userRole = app.role.can('user');

  app.get('/', userRole, app.controller.home.get);
  app.get('/hello', app.controller.home.hello);
  app.get('/service', app.controller.home.service);
  app.get('/service/old', app.controller.home.serviceOld);
  app.get('/header', app.controller.home.header);
  app.get('/antx', app.controller.home.antx);
  app.get('/serverconf', app.controller.home.serverconf);
  app.get('/ctoken.json', app.controller.home.ctoken);
  app.get('/urllib', app.controller.home.urllib);
  app.get('/mock_url', app.controller.home.mockUrlGet);
  app.post('/mock_url', app.controller.home.mockUrlPost);
  app.get('/mock_urllib', app.controller.home.mockUrllibHeaders);

  app.post('/', app.controller.home.post);
};
