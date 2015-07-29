'use strict';

require('angular/angular');

var indulgeApp = angular.module('indulgeApp',[]);

//require the service
// require('./services/mapService.js')(indulgeApp);

// require the controller
require('./controllers/mapController.js')(indulgeApp);
