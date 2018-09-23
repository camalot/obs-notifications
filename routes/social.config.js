"use strict";

const xconfig = require("./admin/social.config");
const merge = require("merge");

let config = {
	"social": {
		route: ["/social"]
	}
};

module.exports = merge(xconfig, config);
