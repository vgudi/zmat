/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"mat/ZMDG_REQ_MAT/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});