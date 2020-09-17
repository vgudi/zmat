/*global QUnit*/

sap.ui.define([
	"mat/ZMDG_REQ_MAT/controller/ReqMat.controller"
], function (Controller) {
	"use strict";

	QUnit.module("ReqMat Controller");

	QUnit.test("I should test the ReqMat controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});