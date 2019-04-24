'use strict';
const merge = require('merge');
const path = require('path');
const fs = require('fs-extra');
const customFile = path.join(__dirname, 'custom.config.json');

let config = {};

// include a `.env` file in the root
// loaded in /bin/www
// or have them loaded into the environment

config.siteHostName = process.env.APP_HOSTNAME || '';
config.sitePort = process.env.APP_PORT || 3000;

config.slPath = process.env.APP_STREAMLABELS_PATH;
config.databasePath = process.env.APP_DATABASE_PATH || 'databases/';

config.chatbot = {
	settings: {
		API_Key: process.env.APP_SLCB_API_KEY,
		API_Socket: process.env.APP_SLCB_SOCKET,
	},
	caster: {
		CasterCommand: "!so",
		Permission: "Moderator",
		APIKey: process.env.APP_TWITCH_CLIENT_ID,
		CasterColor: "rgba(255,0,0,255)",
		TwitchColor: "rgba(230,126,34,1)",
		InTransition: "SlideRight",
		OutTransition: "SlideRight",
		Duration: 5,
		InSound: "",
		OutSound: ""
	}
};

config.transitionSpeed = 10000;
config.animationSpeed = 1000;
config.groups = {
	recents :[
		{ name: 'subscriber', type: 'subscriber' },
		{ name: 'resubscriber', type: 'subscriber' },
		{ name: 'cheerer', type: 'cheer' },
		{ name: 'donator', type: 'donation' }
	],
	goals :[
		'total_subscriber_count',
		'total_subscriber_score',
		'donation_goal'
	]
};



config.groups.custom = {};
try {
	fs.accessSync(customFile, fs.F_OK);
	console.log('loading custom config file');
	fs.readFile(customFile, 'utf8', (err, data) => {
		if (!err) {
			let obj = JSON.parse(data);
			config.groups.custom = obj;
		}
	});
} catch (e) {
	// no env file
}

let obsFile = path.join(__dirname, 'obs.config.json');
config.obs = merge(config.obs,{});
config.obs.sources = {};
try {
	fs.accessSync(obsFile, fs.F_OK);
	console.log('loading obs config file');
	fs.readFile(obsFile, 'utf8', (err, data) => {
		if (!err) {
			let obj = JSON.parse(data);
			config.obs = merge(config.obs,obj);
		}
	});
} catch (e) {
	// no env file
}

config.pb = {
	upload: process.env.APP_PB_AUDIOHOOKS_PATH || "data/pb/audio-hooks"
};

if (config.pb.upload === '' || config.pb.upload === null || config.pb.upload === undefined) {
	throw new Error('"APP_PB_AUDIOHOOKS_PATH" is not set.');
}

config.pb.upload = path.isAbsolute(config.pb.upload) ? config.pb.upload : path.join(__dirname, config.pb.upload);
fs.ensureDirSync(config.pb.upload);

if (config.slPath === '' || config.slPath === null || config.slPath === undefined) {
	throw new Error('"APP_STREAMLABELS_PATH" is not set.');
}


if (config.databasePath === '' || config.databasePath === null || config.databasePath === undefined) {
	throw new Error('"APP_DATABASE_PATH" is not set.');
}

module.exports = config;
