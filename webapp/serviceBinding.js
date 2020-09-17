function initModel() {
	var sUrl = "/sap/opu/odata/sap/ZMDG_MATERIAL_REQ_SRV/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}