'use strict';

const xconfig = require('../config');
const merge = require('merge');

let config = {
	social: {
		route: ['/social'],
		accounts: {
			twitch: process.env.APP_SOCIAL_TWITCH || null,
			mixer: process.env.APP_SOCIAL_MIXER || null,
			twitter: process.env.APP_SOCIAL_TWITTER || null,
			facebook: process.env.APP_SOCIAL_FACEBOOK || null,
			instagram: process.env.APP_SOCIAL_INSTAGRAM || null,
			youtube: process.env.APP_SOCIAL_YOUTUBE || null,
			tumblr: process.env.APP_SOCIAL_TUMBLR || null,
			paypal: process.env.APP_SOCIAL_PAYPAL || null,
			patreon: process.env.APP_SOCIAL_PATREON || null,
			snapchat: process.env.APP_SOCIAL_SNAPCHAT || null,
			steam: process.env.APP_SOCIAL_STEAM || null,
			xbox: process.env.APP_SOCIAL_XBOX || null,
			psn: process.env.APP_SOCIAL_PSN || null,
			origin: process.env.APP_SOCIAL_ORIGIN || null,
			uplay: process.env.APP_SOCIAL_UPLAY || null,
			nintendo: process.env.APP_SOCIAL_NINTENDO || null,
			battlenet: process.env.APP_SOCIAL_BATTLENET || null,
			deviantart: process.env.APP_SOCIAL_DEFIANTART || null,
			reddit: process.env.APP_SOCIAL_REDDIT || null,
			gamewisp: process.env.APP_SOCIAL_GAMEWISP || null,
			playstv: process.env.APP_SOCIAL_PAYSTV || null,
			discord: process.env.APP_SOCIAL_DISCORD || null, 
			store: process.env.APP_SOCIAL_STORE || null,
			github: process.env.APP_SOCIAL_GITHUB || null,
		}
	}
};


let enabled_config = {
	twitch: config.social.accounts.twitch && config.social.accounts.twitch !== '' ? 1 : 0,
	mixer: config.social.accounts.mixer && config.social.accounts.mixer !== '' ? 1 : 0,
	twitter: config.social.accounts.twitter && config.social.accounts.twitter !== '' ? 1 : 0,
	facebook: config.social.accounts.facebook && config.social.accounts.facebook !== '' ? 1 : 0,
	instagram: config.social.accounts.instagram && config.social.accounts.instagram !== '' ? 1 : 0,
	youtube: config.social.accounts.youtube && config.social.accounts.youtube !== '' ? 1 : 0,
	tumblr: config.social.accounts.tumblr && config.social.accounts.tumblr !== '' ? 1 : 0,
	paypal: config.social.accounts.paypal && config.social.accounts.paypal !== '' ? 1 : 0,
	patreon: config.social.accounts.patreon && config.social.accounts.patreon !== '' ? 1 : 0,
	snapchat: config.social.accounts.snapchat && config.social.accounts.snapchat !== '' ? 1 : 0,
	steam: config.social.accounts.steam && config.social.accounts.steam !== '' ? 1 : 0,
	xbox: config.social.accounts.xbox && config.social.accounts.xbox !== '' ? 1 : 0,
	psn: config.social.accounts.psn && config.social.accounts.psn !== '' ? 1 : 0,
	origin: config.social.accounts.origin && config.social.accounts.origin !== '' ? 1 : 0,
	uplay: config.social.accounts.uplay && config.social.accounts.uplay !== '' ? 1 : 0,
	nintendo: config.social.accounts.nintendo && config.social.accounts.nintendo !== '' ? 1 : 0,
	battlenet: config.social.accounts.battlenet && config.social.accounts.battlenet !== '' ? 1 : 0,
	deviantart: config.social.accounts.deviantart && config.social.accounts.deviantart !== '' ? 1 : 0,
	reddit: config.social.accounts.reddit && config.social.accounts.reddit !== '' ? 1 : 0,
	gamewisp: config.social.accounts.gamewisp && config.social.accounts.gamewisp !== '' ? 1 : 0,
	playstv: config.social.accounts.playstv && config.social.accounts.playstv !== '' ? 1 : 0,
	discord: config.social.accounts.discord && config.social.accounts.discord !== '' ? 1 : 0,
	store: config.social.accounts.store && config.social.accounts.store !== '' ? 1 : 0,
	github: config.social.accounts.github && config.social.accounts.github !== '' ? 1 : 0
};

config.social.enabled = enabled_config;

module.exports = merge(xconfig, config);
