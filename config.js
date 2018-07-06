"use strict";
let config = {};

// include a `.env` file in the root
// loaded in /bin/www
// or have them loaded into the environment

config.siteHostName = process.env.APP_HOSTNAME || "";
config.sitePort = process.env.APP_PORT || 3000;

config.slPath = process.env.APP_STREAMLABELS_PATH;
config.transitionSpeed = 10000;
config.animationSpeed = 1000;
config.groups = {
	recents :[
		{ name: "subscriber", type: "subscriber" },
		{ name: "resubscriber", type: "subscriber" },
		{ name: "cheerer", type: "cheer" },
		{ name: "donator", type: "donation" }
	],
	goals :[
		"total_subscriber_count",
		"total_subscriber_score",
		"donation_goal"
	]
};


let path = require('path');
let fs = require('fs');
let customFile = path.join(__dirname, 'custom.config.json');
config.groups.custom = {};
try {
	fs.accessSync(customFile, fs.F_OK);
	console.log("loading custom config file");
	fs.readFile(customFile, "utf8", (err, data) => {
		if (!err) {
			let obj = JSON.parse(data);
			config.groups.custom = obj;
		}
	});
} catch (e) {
	// no env file
}


if (config.slPath === "" || config.slPath === null || config.slPath === undefined) {
	throw new Error("'APP_STREAMLABELS_PATH' is not set.");
}

module.exports = config;
