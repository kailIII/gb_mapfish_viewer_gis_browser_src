/*
 * File: app/view/GbInfoPanel.js
 *
 * This file was generated by Sencha Architect version 2.0.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 4.0.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.0.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('Gb41.view.GbInfoPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.gbinfopanel',

	html: '<div id="infotool"></div>' +
		'<div id="infomeasure"></div>' +
		'<div id="infofeature"></div>',
	autoScroll: true,
	closable: false,
	closeAction: 'hide',
	title: 'Info',

	// **** Texte ****
	/**
	 * @cfg {String} txtDistance
	 * Text for distance measurements.
	 */
	//<locale>
	txtDistance: 'Distance',
	//</locale>

	/**
	 * @cfg {String} txtArea
	 * Text button area measurements.
	 */
	//<locale>
	txtArea: 'Area',
	//</locale>

	initComponent: function () {
		var me = this;
		GbZh.base.ViewerState.on('identifyclicked',  this.showXy, this, this);
		GbZh.base.ViewerState.on('featurequeryresultsready',  this.showResults, this, this);
		GbZh.base.ViewerState.on('updatemeasure',  this.showMeasurementResult, this, this);
		GbZh.base.ViewerState.on('topicready',  this.onTopicReady, this, this);
        this.on("afterrender", this.onAfterRender);

		me.callParent(arguments);
	},

	onAfterRender: function (event) {
		this.chooseTool('featureQuery');
	},

	onTopicReady: function (event) {
		var f = Ext.DomQuery.selectNode('#infofeature');
		if (f) {
			f.style.display = "none";
		}
	},

	chooseTool: function (tool) {
		Ext.DomQuery.selectNode('#infomeasure').style.display = "none";
		Ext.DomQuery.selectNode('#infofeature').style.display = "block";
		switch (tool) {
		case 'lineMeasure':
			Ext.DomQuery.selectNode('#infotool').innerHTML = 'Mit dem Messwerkzeug Linie zeichnen!';
			Ext.DomQuery.selectNode('#infofeature').style.display = "none";
			break;
		case 'areaMeasure':
			Ext.DomQuery.selectNode('#infotool').innerHTML = 'Mit dem Messwerkzeug Polygon zeichnen!';
			Ext.DomQuery.selectNode('#infofeature').style.display = "none";
			break;
		case 'featureQuery':
			Ext.DomQuery.selectNode('#infotool').innerHTML = 'In der Karte auf das interessierende Objekt klicken!';
			break;
		default:
		}

	},

	showMeasurementResult: function (event) {
		this.ownerCt.setActiveTab(this);
		var geometry = event.geometry;
		var valText;
		if (event.order === 1) { // Längen
			// if (units === 'xm') { measure = measure /
			// Math.pow(1000.0, order); units = 'km'; }
			valText = this.txtDistance + "<b>" + event.measure.toFixed(3) + "&nbsp;" + event.units + '</b>';
		} else { // Flächen
			valText = this.txtArea + "<b>" + event.measure.toFixed(3) + "&nbsp;" + event.units + "<sup>2</" + "sup>" + '</b>';
		}
		Ext.DomQuery.selectNode('#infomeasure').innerHTML = valText;
		Ext.DomQuery.selectNode('#infomeasure').style.display = "block";

	},

	showXy: function (ost, nord) {
		Ext.DomQuery.selectNode('#infomeasure').style.display = "none";
		Ext.DomQuery.selectNode('#infomeasure').innerHTML = '';

		Ext.DomQuery.selectNode('#infofeature').style.display = "block";
		this.ownerCt.setActiveTab(this);
		Ext.DomQuery.selectNode('#infofeature').innerHTML = '<div class="infokoord"><b>Informationen</b> für ausgewählte Themen bei Koordinate ' + Math.round(ost) + ' / ' + Math.round(nord);
		this.ost = ost;
		this.nord = nord;
		this.setLoading('Laden der Infos');

	},

	showResults: function (result) {
		Ext.DomQuery.selectNode('#infofeature').style.display = "block";
		var i, len, res;
		if (result.code === 1) {
			res = '';
			if (result.features && result.features.length) {
				for (i = 0, len = result.features.length; i < len; i += 1) {
					res += result.features[i].data;
				}
				Ext.DomQuery.selectNode('#infofeature').innerHTML = res;
			} else {
				Ext.DomQuery.selectNode('#infofeature').innerHTML = '(keine weiteren Informationen gefunden)';
			}
		} else {
			this.setLoading(false);
		}
		var mitxy = Ext.DomQuery.selectNode('#infoxy');

		if (GbZh.base.ViewerState.csradius > 0) {
			var circleStyle = {
				strokeColor: '#601345',
				strokeWidth: 2,
				strokeOpacity: 1,
				fillColor: '#601345',
				fillOpacity: 0.2
			};
			Gb41.utils.GbTools.drawCircle(this.ost, this.nord, GbZh.base.ViewerState.csradius, 'Umkreis', circleStyle);
		}

		if (mitxy !== undefined) {
			mitxy.innerHTML =  Math.round(this.ost) + ' / ' + Math.round(this.nord);
		}
		this.setLoading(false);

	}


});