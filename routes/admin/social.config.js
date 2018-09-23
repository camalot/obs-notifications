'use strict';

const xconfig = require('../../config');
const merge = require('merge');

let config = {
	"admin/social": {
		route: ["/admin/social"],
		animations: {
			"fade": {
				display: "Fade",
				value: "fade"
			}, 
			"flip": {
				display: "Flip",
				value: "flip",
			}, 
			"hslide": {
				display: "Horizontal Slide",
				value: "hslide"
			},
			"vslide": {
				display: "Vertical Slide",
				value: "vslide"
			}, 
			"hbounce": {	
				display: "Horizontal Bounce",
				value: "hbounce"
			}
		}

	}
};

module.exports = merge(xconfig, config);
