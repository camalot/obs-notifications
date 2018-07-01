"use strict";
let config = {};

// include a `.env` file in the root
// loaded in /bin/www
// or have them loaded into the environment

config.siteHostName = process.env.APP_HOSTNAME || "gm.bit13.com";
config.sitePort = process.env.APP_PORT || 3000;

config.slPath = "D:\\Data\\OBS\\labels";
config.transitionSpeed = 10 * 1000;
config.recents = [
	"subscriber",
	"resubscriber",
	"mixer_subscriber",
	"cheerer",
	"donator"
];
module.exports = config;
