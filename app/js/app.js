'use strict';

require('angular/angular');
require('angular-route');

var indulgeApp = angular.module('indulgeApp',['ngRoute']);

// require the controller
require('./controllers/mapController.js')(indulgeApp);
require('./controllers/aboutController.js')(indulgeApp);

// require the directives
require('./directives/aboutDirective.js')(indulgeApp);
require('./directives/tweetsDirective.js')(indulgeApp);

// require the routes
require('./routes/aboutRoute.js')(indulgeApp);
