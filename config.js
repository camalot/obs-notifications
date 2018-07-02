"use strict";
let config = {};

// include a `.env` file in the root
// loaded in /bin/www
// or have them loaded into the environment

config.siteHostName = process.env.APP_HOSTNAME || "";
config.sitePort = process.env.APP_PORT || 3000;

config.slPath = process.env.APP_STREAMLABELS_PATH || "D:\\Data\\OBS\\labels";
config.transitionSpeed = 10000;
config.animationSpeed = 1000;


config.recents = [
	{ name: "subscriber", type: "subscriber" },
	{ name: "resubscriber", type: "subscriber" },
	{ name: "mixer_subscriber", type: "subscriber" },
	{ name: "cheerer", type: "cheer" },
	{ name: "donator", type: "donation" }
];

config.goals = [
	"total_subscriber_count",
	"total_subscriber_score",
	"donation_goal"
];


config.custom = {
	alltimetop: [
		"all_time_top_donators",
		"all_time_top_cheerers"
	]
};

module.exports = config;
