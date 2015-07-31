'use strict';

require('angular/angular');

var indulgeApp = angular.module('indulgeApp',[]);

// require the controller
require('./controllers/mapController.js')(indulgeApp);

// require the directive
require('./directives/aboutDirective.js')(indulgeApp);
require('./directives/tweetsDirective.js')(indulgeApp);
