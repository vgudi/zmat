sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/layout/HorizontalLayout",
	"sap/ui/layout/VerticalLayout",
	"sap/m/Dialog",
	"sap/m/DialogType",
	"sap/m/Button",
	"sap/m/ButtonType",
	"sap/m/Label",
	"sap/m/MessageToast",
	"sap/m/Text",
	"sap/m/TextArea"
], function (Controller, HorizontalLayout, VerticalLayout, Dialog, DialogType, Button, ButtonType, Label, MessageToast, Text, TextArea) {
	"use strict";
	var oLabel, input, oValue, oInputDynamic;
	return Controller.extend("mat.ZMDG_REQ_MAT.controller.ReqMat", {

		onInit: function () {
			// this.oAddressFragment = sap.ui.xmlfragment("AddressFragment", 'sap.fcg.mdg.lib.bp.address.fragments.address-US', this);
			//	 this.getView().byId("CommunicationSection").addItem(this.oAddressFragment);
						this._initializeAttachments();
		},
		onSubmit: function (evt) {
			debugger;
			//this.openMATploadBusyDialog();
			var oFormUi = this.getView().getModel("resultModel").getData().results[0].NAV_REQFILTER_REQFORMUI.results;
			var oMatHead = this.getView().getModel("uploadRoleModel").getData()
			var matSubmitData = {
				ChangeRequestType: "ZMMF1P1",
				RequestReason: "test new material",
				NAV_ChangeReuest_REQFILTER: oMatHead,
				NAV_ChangeReuest_FormsUI: oFormUi

			};
			var oModel = this.getView().getModel("matreq");
			oModel.create("/ChangeRequests", matSubmitData, {
				success: function (oData, response) {
					debugger;
					sap.m.MessageBox.success("Change request(" + response.data.ChangeRequestId + ") has been successfully Created");
					//	this.closeMATloadBusyDialog();
				}.bind(this),
				error: function (d) {
					debugger;
					//	this.closeMATloadBusyDialog();

				}.bind(this)
			});

		},
		openMATploadBusyDialog: function () {
			if (!this._souploadbusydialog) {
				this._souploadbusydialog = sap.ui.xmlfragment("mat.ZMDG_REQ_MAT.view.BusyDialogSubmit", this);

				this.getView().addDependent(this._souploadbusydialog);
			}
			this._souploadbusydialog.open();
		},
		closeMATloadBusyDialog: function () {
			this._souploadbusydialog.close();
		},
		onAfterClosePopup: function () {
			debugger;
			var oFormLayout = this.byId("FormDisplay354");

			for (var i = 0; i < oFormLayout.getFormContainers().length; i++) {

				if (oFormLayout.getFormContainers()[i].getFormElements().length === 0) {
					oFormLayout.getFormContainers()[i].setVisible(false);
				} else {
					oFormLayout.getFormContainers()[i].setVisible(true);
				}

			}
			var oPage = this.byId("page");
			oPage.setVisible(true);
		},
		onRegionChanges: function (evt) {
			debugger
			var oFilter = [];
			var oSelectedKey = evt.getSource().getSelectedKey();
			var olineOfBusiness = sap.ui.core.Fragment.byId("fragmentId", "idComboBoxLob");
			oFilter.push(new sap.ui.model.Filter("Lob", sap.ui.model.FilterOperator.EQ, oSelectedKey));
			oFilter.push(new sap.ui.model.Filter("Region", sap.ui.model.FilterOperator.EQ, olineOfBusiness.getSelectedKey()));
			oMatrt.getBinding("items").filter(oFilter);
		},
		// onAfterRendering: function (evt) {
		// 	debugger;
		// },
		onGo: function (event) {

			debugger;

			var oFinalFilter = [];
			//var olineOfBusiness = this.byId("idComboBoxLob");
			var olineOfBusiness = sap.ui.core.Fragment.byId("fragmentId", "idComboBoxLob");
			var oMatrt = sap.ui.core.Fragment.byId("fragmentId", "idComboBoxMtart");

			//	var oMatrtTest = this.byId("idComboBoxMtart1");
			if (olineOfBusiness.getSelectedKey() === "" || oMatrt.getSelectedKey() === "") {
				if (oMatrt.getSelectedKey() === "") {
					oMatrt.setValueState("Error");
					oMatrt.setValueStateText("Please Select Material");
				} else {
					oMatrt.setValueState("Success");
					oMatrt.setValueStateText("");
				}
				if (olineOfBusiness.getSelectedKey() === "") {
					olineOfBusiness.setValueState("Error");
					olineOfBusiness.setValueStateText("Please Select Line of Business ");

				} else {
					olineOfBusiness.setValueState("Success");
					olineOfBusiness.setValueStateText("");
				}
				return false;
			}
			oFinalFilter.push(new sap.ui.model.Filter("Lob", sap.ui.model.FilterOperator.EQ, olineOfBusiness.getSelectedKey()));

			var oRegion = sap.ui.core.Fragment.byId("fragmentId", "idComboBoxRegion");
			oFinalFilter.push(new sap.ui.model.Filter("Region", sap.ui.model.FilterOperator.EQ, oRegion.getSelectedKey()));

			oFinalFilter.push(new sap.ui.model.Filter("Mtart", sap.ui.model.FilterOperator.EQ, oMatrt.getSelectedKey()));

			this.byId("lobId").setText("Selected LOB: '" + olineOfBusiness.getSelectedKey() + "'");
			this.byId("matID").setText("Selected Mat: '" + oMatrt.getValue() + "'");

			this._dataRole = {
				"Lob": olineOfBusiness.getSelectedKey(),
				"Mtart": oMatrt.getSelectedKey()
			};
			this.jModelRole = new sap.ui.model.json.JSONModel(this._dataRole);
			this.getView().setModel(this.jModelRole, "uploadRoleModel");

			var oModel = this.getView().getModel("matreq");
			oModel.read("/RequestorFilterSet", {
				filters: oFinalFilter,
				urlParameters: {
					"$expand": "NAV_REQFILTER_REQFORMUI"
				},

				success: function (data) {
					debugger
					var oFormLayout = this.byId("FormDisplay354");

					this.resultModel = new sap.ui.model.json.JSONModel(data);
					this.getView().setModel(this.resultModel, "resultModel");

					for (var i = 0; i < oFormLayout.getFormContainers().length; i++) {

						for (var j = 0; j < data.results[0].NAV_REQFILTER_REQFORMUI.results.length; j++) {
							debugger
							if (oFormLayout.getFormContainers()[i].getTooltip() === data.results[0].NAV_REQFILTER_REQFORMUI.results[
									j].Groupid) {

								if (data.results[0].NAV_REQFILTER_REQFORMUI.results[j].FldUiType === "IP") {
									var ofields = new sap.ui.layout.form.FormElement({
										label: data.results[0].NAV_REQFILTER_REQFORMUI.results[j].FldLabel,
								

									});
                                   // var oFields = data.results[0].NAV_REQFILTER_REQFORMUI.results[j].Fieldname;
                                   if (!(data.results[0].NAV_REQFILTER_REQFORMUI.results[j].Valhlp == "")) {

									var oInputFields = new sap.m.Input({
										showValueHelp:true,
										selectedKey: data.results[0].NAV_REQFILTER_REQFORMUI.results[j].Fieldname,
										valueHelpRequest: function (oEvent) {
											this._setValueHelp(oEvent);
										}.bind(this),
										maxLength: parseInt(data.results[0].NAV_REQFILTER_REQFORMUI.results[j].FldLength),
										change: function (oEvent) {
											this._setValueField(oEvent);
										}.bind(this)
									});
                                   }else{
                                   		var oInputFields = new sap.m.Input({
											selectedKey: data.results[0].NAV_REQFILTER_REQFORMUI.results[j].Fieldname,
											maxLength: parseInt(data.results[0].NAV_REQFILTER_REQFORMUI.results[j].FldLength)
										});
                                   }
                                   
									if (data.results[0].NAV_REQFILTER_REQFORMUI.results[j].Valhlptyp === "V") {
										oInputFields.setShowValueHelp(true);
									}
									// if (data.results[0].NAV_REQFILTER_REQFORMUI.results[j].FldUiProp === "1") {
									// 	oInputFields.setValueState("Error");
									// }

								}
								if (data.results[0].NAV_REQFILTER_REQFORMUI.results[j].FldUiType === "CB") {
									var ofields = new sap.ui.layout.form.FormElement({
										label: data.results[0].NAV_REQFILTER_REQFORMUI.results[j].FldLabel
									});
									var oInputFields = new sap.m.CheckBox();

								}
								if (data.results[0].NAV_REQFILTER_REQFORMUI.results[j].FldUiType === "RB") {
									var ofields = new sap.ui.layout.form.FormElement({
										label: data.results[0].NAV_REQFILTER_REQFORMUI.results[j].FldLabel
									});
									var oInputFields = new sap.m.RadioButton();

								}
								if (data.results[0].NAV_REQFILTER_REQFORMUI.results[j].FldUiType === "DD") {
									var ofields = new sap.ui.layout.form.FormElement({
										label: data.results[0].NAV_REQFILTER_REQFORMUI.results[j].FldLabel
									});
									var oInputFields = new sap.m.ComboBox();

								}
								ofields.addField(oInputFields);
								oFormLayout.getFormContainers()[i].addFormElement(ofields);

							}
						}
					}
					this._DialogRole.close();
				}.bind(this),
				error: function (evt) {

				}
			});

		},
		_setValueHelp : function (oEvent) {
					debugger;
			if (!this._UOMVH1) {
				this._UOMVH1 = sap.ui.xmlfragment("mat.ZMDG_REQ_MAT.view.dynamicVH", this);
				this.getView().addDependent(this._UOMVH1);
			}
			this._UOMVH1.open();
			
			oInputDynamic = oEvent.getSource();
			var ofields = oEvent.getSource().getSelectedKey();
			var oFilter =  new sap.ui.model.Filter("Domname", sap.ui.model.FilterOperator.EQ, ofields);
			oEvent.getSource().getParent().getLabel();
			this._UOMVH1.setTitle(oEvent.getSource().getParent().getLabel());
		    this._UOMVH1.getBinding("items").filter([oFilter]);
		},
		onSelectdataDynamicVH: function (oEvent) {
			debugger;
			
		var oSelectedData = oEvent.getParameter("selectedItem").getTitle();
		oInputDynamic.setValue(oSelectedData);
		},
		_setValueField: function (oEvent) {
			debugger;

			oLabel = oEvent.getSource().getParent().getLabel();
			oValue = oEvent.getParameter("value");
			var omodelData = this.getView().getModel("resultModel").getData().results[0].NAV_REQFILTER_REQFORMUI.results;
			for (var i = 0; i < omodelData.length; i++) {
				if (omodelData[i].FldLabel === oLabel) {
					oValue = omodelData[i].FldValue;
				}
			}
			// if (oEvent.getParameter("value") === "") {
			// 	oEvent.getSource().setValueState(sap.ui.core.ValueState.Error)
			// } else {
			// 	oEvent.getSource().setValueState(sap.ui.core.ValueState.Success)
			// }
		},
		onSelectdataVH: function (event) {
			this.byId("BaseUnitOfMeasure").setValue(event.getParameter("selectedItem").getTitle());
			this.byId("UOMDesc").setValue(event.getParameter("selectedItem").getDescription());
		},
		onUomVH: function (event) {
			debugger;
			if (!this._UOMVH) {
				this._UOMVH = sap.ui.xmlfragment("mat.ZMDG_REQ_MAT.view.uomVh", this);
				this.getView().addDependent(this._UOMVH);
			}
			this._UOMVH.open();
			input = event;
		},

		onCancel: function () {
			this._DialogRole.close();
		},
		onBeforeRendering: function () {
	
		},
		
		_initializeAttachments: function () {
			var g = this;
			this.getView().setModel(new sap.ui.model.json.JSONModel(), "json");
			this.oFileUpload = this.byId('fileupload');
			var d = {
				dataitems: []
			};
			g.mockDataModel = new sap.ui.model.json.JSONModel(d);
			g.oFileUpload.setModel(g.mockDataModel, "json");
		},

		getXsrfToken: function () {
			var l = this;
			var sServiceUrl = '/sap/opu/odata/sap/zmdg_material_req_srv';
			var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
			this.sModel = oModel;
			var t = oModel.getSecurityToken();
			if (!t) {
				this.getView().getModel().refreshSecurityToken(function (e, o) {
					t = o.headers['x-csrf-token'];
				}, function () {
					sap.ca.ui.message.showMessageBox({
						type: sap.ca.ui.message.Type.ERROR,
						message: this.getView().getModel("i18n").getProperty("TOKEN_MSG"),
						details: ''
					});
				}, false);
			}
			return t;
		},
		onUploadFile: function (e) {
			var c, m, g, u, n, f;
			if (this.isMock) {
				f = "57_iPhone_Desktop_Launch.png";
				c = "Kapil Parmar";
				m = "image/jpg";
				g = "5082cc4d-da9f-2835-2c0a-8100ed47bcde";
				u = "img/home/57_iPhone_Desktop_Launch.png";
				n = u + '/$value';
			} else {
				var r = e.getParameters().getParameters().responseRaw;
				var p = new DOMParser();
				var x = p.parseFromString(r, "text/xml");
				c = x.getElementsByTagName("d:CreatedBy")[0].childNodes[0].nodeValue;
				m = x.getElementsByTagName("d:MimeType")[0].childNodes[0].nodeValue;
				g = x.getElementsByTagName("d:Guid")[0].childNodes[0].nodeValue;
				u = x.getElementsByTagName("id")[0].childNodes[0].nodeValue;
				n = u + '/$value';
				f = e.getParameters().getParameters().fileName;
			}
			var C = function () {
				var b = new Date();
				var h = b.getDate();
				var i = b.getMonth() + 1;
				var y = b.getFullYear();
				if (h < 10) {
					h = '0' + h;
				}
				if (i < 10) {
					i = '0' + i;
				}
				return y + '-' + i + '-' + h;
			};
			if (g !== "") {
				var d = this.mockDataModel.getData();
				var o = {
					"mimeType": m,
					"contributor": c,
					"uploaded": C(),
					"enableEdit": false,
					"enableDelete": true,
					"filename": f,
					"url": n,
					"documentId": g
				};
				d.dataitems.unshift(o);
				this.mockDataModel.setData(d);
				this.oFileUpload.getBinding("items").refresh(true);
				this.oFileUpload.rerender();
				var G = {
					Guid: g
				};
				this.oAttach.push(G);
				this.getView().byId("attachments").setCount(this.oAttach.length);

			}
		},
		onFileDeleted: function (e) {
			var d = e.getParameter("documentId");
			var a = this.mockDataModel.getData();
			for (var i = 0; i < a.dataitems.length; i++) {
				if (a.dataitems[i].documentId === d) {
					a.dataitems.splice(i, 1);
					break;
				}
			}
			for (var i = 0; i < this.oAttach.length; i++) {
				if (this.oAttach[i].Guid === d) {
					this.oAttach.splice(i, 1);
					break;
				}
			}
			this.getView().byId("attachments").setCount(this.oAttach.length);
			this.mockDataModel.setData(a);
			this.oFileUpload.getBinding("items").refresh(true);
			this.oFileUpload.rerender();
			if (this.oAttach.length === 0) {
				if (sap.ui.core.Fragment.byId("GeneralFragment", "RequestReason").getValue() === this.getView().getModel('i18n').getProperty(
						"AFTER_UPLOAD")) {
					sap.ui.core.Fragment.byId("GeneralFragment", "RequestReason").setValue();
				}
			}
		},
		onBeforeUploadFile: function (e) {
			var f = "";
			var t = this.getXsrfToken();
			var c = new sap.m.UploadCollectionParameter({
				name: "x-csrf-token",
				value: t
			});
			var h = this.oFileUpload.getHeaderParameters();
			if (h[0] === undefined) {
				this.oFileUpload.addHeaderParameter(c);
			}
			var a = this.oFileUpload.getHeaderParameters()[0].getValue("x-csrf-token");
			if (a === "") {
				this.oFileUpload.addHeaderParameter(c);
			}
			if (this.isMock) {
				f = "57_iPhone_Desktop_Launch.png";
			} else {
				f = e.getParameter("mParameters").files[0].name;
			}
			var C = new sap.m.UploadCollectionParameter({
				name: "slug",
				value: f
			});
			var h = this.oFileUpload.getHeaderParameters();
			this.oFileUpload.removeHeaderParameter(h[1]);
			this.oFileUpload.addHeaderParameter(C);
		},
		onFileUploadFailed: function (e) {
			sap.ca.ui.message.showMessageBox({
				type: sap.ca.ui.message.Type.ERROR,
				message: e.getParameters().exception.message
			});
		},
		
		
		onAfterRendering: function () {
		
			//this.onConfirmDialogPress();
			this._getDialogRole();
		},
		_getDialogRole: function () {
			if (!this._DialogRole) {
				this._DialogRole = sap.ui.xmlfragment("fragmentId", "mat.ZMDG_REQ_MAT.view.initpopup", this);
				this.getView().addDependent(this._DialogRole);
			}
			this._DialogRole.open();
		},

		onConfirmDialogPress: function () {
			if (!this.oConfirmDialog) {
				this.oConfirmDialog = new Dialog({
					type: DialogType.Message,
					title: "Confirm",
					content: [
						new HorizontalLayout({
							content: [
								new VerticalLayout({
									width: "120px",
									content: [
										new Text({
											text: "Type: "
										}),
										new Text({
											text: "Delivery: "
										}),
										new Text({
											text: "Items count: "
										})
									]
								}),
								new VerticalLayout({
									content: [
										new Text({
											text: "Shopping Cart"
										}),
										new Text({
											text: "Jun 26, 2013"
										}),
										new Text({
											text: "2"
										})
									]
								})
							]
						}),
						new TextArea("confirmationNote", {
							width: "100%",
							placeholder: "Add note (optional)"
						})
					],
					beginButton: new Button({
						type: ButtonType.Emphasized,
						text: "Submit",
						press: function () {
						//	var sText = Core.byId("confirmationNote").getValue();
						//	MessageToast.show("Note is: " + sText);
							this.oConfirmDialog.close();
						}.bind(this)
					}),
					endButton: new Button({
						text: "Cancel",
						press: function () {
							this.oConfirmDialog.close();
						}.bind(this)
					})
				});
			}

			this.oConfirmDialog.open();
		}

	});

});