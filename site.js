/*jslint node: true, nomen: true, white: true*/
/*!
 * This is the default bootstrap script for a Sitegear3 website.
 *
 * Treat this as a fully functional template.  Middleware sequence can be modified, for example, if you don't need CSRF
 * prevention, then remove the middleware for it.  The templating engine can also be easily swapped out for any other
 * express-compatible engine.
 */

(function (poweredBy, sitegear3, connect, swig, fs, filesystemConnector) {
	"use strict";

	// Create the application instance
	var app = sitegear3(require('./settings.json'));

	// Pre-configure
	if (app.get('env') === 'development') {
		swig.setDefaults({ cache: false });
	}

	// Generic setup code
	app .use(poweredBy('sitegear3'))
		.use(connect.logger())
		.use(connect.compress())
		.use(connect.static(__dirname + '/static'))
		.use(connect.cookieParser())
		.use(connect.cookieSession({ "baseKey": "sitegear3.session", "secret": "Sitegear3" }))
		.use(connect.csrf())
		.connect(filesystemConnector({ root: __dirname + '/data' }))
		.routing(require('./routes.json'))
		.engine('html', swig.renderFile)
		.set('views', __dirname + '/templates');

	// Start http and https
	app.start(8080);
	app.startSecure(__dirname + '/certificates/localhost.pfx', 8443);

}(require('connect-powered-by'), require('sitegear3'), require('connect'), require('swig'), require('fs'), require('sitegear3-adapter-filesystem')));
