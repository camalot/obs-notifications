'use strict';

const xconfig = require('../config');
const merge = require('merge');

let config = {
	social: {
		route: ["/social"],
		delay: parseInt(process.env.APP_SOCIAL_DELAY || "20"),
		pause: parseInt(process.env.APP_SOCIAL_PAUSE || "0"),
		defaults: {
			DEFAULT: {
				background: "#000",
				adjustment: parseInt(process.env.APP_SOCIAL_BGADJUSTMENT || "25"),
				color: "#fff",
				image: "/images/social/blank.png"
			},
			twitter: {
				background: "#4b9bd8",
				color: "#fff",
				image: "/images/social/twitter.png"
			},
			github: {
				background: "#000",
				color: "#fff",
				image: "/images/social/github.png"
			},
			facebook: {
				background: "#3a5795",
				color: "#fff",
				image: "/images/social/facebook.png"
			},
			instagram: {
				background: "#44749c",
				color: "#fff",
				image: "/images/social/instagram.png"
			},
			youtube: {
				background: "#ec2727",
				color: "#fff",
				image: "/images/social/youtube.png"
			},
			paypal: {
				background: "#005082",
				color: "#fff",
				image: "/images/social/paypal.png"
			},
			twitch: {
				background: "#6542a6",
				color: "#fff",
				image: "/images/social/twitch.png"
			},
			mixer: {
				background: "#1c202e",
				color: "#fff",
				image: "/images/social/mixer.png"
			},
			tumblr: {
				background: "#324f6d",
				color: "#fff",
				image: "/images/social/tumblr.png"
			},
			patreon: {
				background: "#e6461a",
				color: "#fff",
				image: "/images/social/patreon.png"
			},
			snapchat: {
				background: "#fffc00",
				color: "#fff",
				image: "/images/social/snapchat.png"
			},
			steam: {
				background: "#000",
				color: "#fff",
				image: "/images/social/steam.png"
			},
			xbox: {
				background: "#117d10",
				color: "#fff",
				image: "/images/social/xbox.png"
			},
			psn: {
				background: "#0b266b",
				color: "#fff",
				image: "/images/social/psn.png"
			},
			origin: {
				background: "#f05a22",
				color: "#fff",
				image: "/images/social/origin.png"
			},
			uplay: {
				background: "#4891cb",
				color: "#fff",
				image: "/images/social/uplay.png"
			},
			nintendo: {
				background: "#f68b33",
				color: "#fff",
				image: "/images/social/nintendo.png"
			},
			battlenet: {
				background: "#0081B4",
				color: "#fff",
				image: "/images/social/battlenet.png"
			},
			store: {
				background: "#ad3e27",
				color: "#fff",
				image: "/images/social/store.png"
			},
			discord: {
				background: "#7289DA",
				color: "#fff",
				image: "/images/social/discord.png"
			},
			deviantart: {
				background: "#05cc47",
				color: "#fff",
				image: "/images/social/deviantart.png"
			},
			reddit: {
				background: "#fff",
				color: "#000",
				image: "/images/social/reddit.png"
			},
			gamewisp: {
				background: "#f8a853",
				color: "#000",
				image: "/images/social/gamewisp.png"
			},
			playstv: {
				background: "#35373b",
				color: "#fff",
				image: "/images/social/playstv.png"
			}
		}
	}
};

let getValueOrDefault = (key, prop, defaultValue) => {
	key = key.toUpperCase();
	prop = prop.toLowerCase();
	let defaultKey = config.social.defaults[key.toLowerCase()] && config.social.defaults[key.toLowerCase()][prop] ? key.toLowerCase() : "DEFAULT";
	console.log(`APP_SOCIAL_CUSTOM_${prop.toUpperCase()}_${key}`);
	let customValue = process.env[`APP_SOCIAL_CUSTOM_${prop.toUpperCase()}_${key}`];
	if (customValue) {
		console.log(`APP_SOCIAL_CUSTOM_${prop.toUpperCase()}_${key}:${customValue}`);
		return customValue;
	} else if (config.social.defaults[defaultKey] && config.social.defaults[defaultKey][prop]) {
		console.log(`${defaultKey}.${prop}:${config.social.defaults[defaultKey][prop]}`);
		return config.social.defaults[defaultKey][prop];
	} else {
		return defaultValue;
	}
}

let getAccountFGColor = (key) => {
	return getValueOrDefault(key,'color', "#fff");
};

let getAccountBGColor = (key) => {
	return getValueOrDefault(key, 'background', "#000");
};

let getAccountBGSecondaryColor = (key) => {
	let bg = getAccountBGColor(key);
	return getValueOrDefault(key, "background2", _colorAdjust(bg, config.social.defaults.DEFAULT.adjustment));
}

let getAccountImage = (key) => {
	return getValueOrDefault(key, "image", '/images/social/blank.png');
};


let accounts = {};
let pattern = /^APP_SOCIAL_ACCOUNT_(.+?)$/i;
for(let e in process.env) {
	let m = pattern.exec(e);
	if(m && m[1]) {
		console.debug(m[1]);
		let id = m[1];
		let account_id = id.toLowerCase();
		let bgColor = getAccountBGColor(id);
		accounts[account_id] = {
			text: process.env[m[0]],
			color: getAccountFGColor(id),
			background: bgColor,
			background2: getAccountBGSecondaryColor(id),
			image: getAccountImage(id)
		}
	}
}

config.social.accounts = merge(config.social.accounts, accounts);

function _colorAdjust(col, amt) {

	var usePound = false;

	if (col[0] == "#") {
		col = col.slice(1);
		usePound = true;
	}

	if(col.length === 3) {
		col = `${col[0]}${col[0]}${col[1]}${col[1]}${col[2]}${col[2]}`;
		console.log(col);
	}

	var R = parseInt(col.substring(0, 2), 16);
	var G = parseInt(col.substring(2, 4), 16);
	var B = parseInt(col.substring(4, 6), 16);

	// to make the colour less bright than the input
	// change the following three "+" symbols to "-"
	R = R + amt;
	G = G + amt;
	B = B + amt;

	if (R > 255) R = 255;
	else if (R < 0) R = 0;

	if (G > 255) G = 255;
	else if (G < 0) G = 0;

	if (B > 255) B = 255;
	else if (B < 0) B = 0;

	var RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
	var GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
	var BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

	return (usePound ? "#" : "") + RR + GG + BB;

}
// let enabled_config = {
// 	twitch: config.social.accounts.twitch && config.social.accounts.twitch !== '' ? 1 : 0,
// 	mixer: config.social.accounts.mixer && config.social.accounts.mixer !== '' ? 1 : 0,
// 	twitter: config.social.accounts.twitter && config.social.accounts.twitter !== '' ? 1 : 0,
// 	facebook: config.social.accounts.facebook && config.social.accounts.facebook !== '' ? 1 : 0,
// 	instagram: config.social.accounts.instagram && config.social.accounts.instagram !== '' ? 1 : 0,
// 	youtube: config.social.accounts.youtube && config.social.accounts.youtube !== '' ? 1 : 0,
// 	tumblr: config.social.accounts.tumblr && config.social.accounts.tumblr !== '' ? 1 : 0,
// 	paypal: config.social.accounts.paypal && config.social.accounts.paypal !== '' ? 1 : 0,
// 	patreon: config.social.accounts.patreon && config.social.accounts.patreon !== '' ? 1 : 0,
// 	snapchat: config.social.accounts.snapchat && config.social.accounts.snapchat !== '' ? 1 : 0,
// 	steam: config.social.accounts.steam && config.social.accounts.steam !== '' ? 1 : 0,
// 	xbox: config.social.accounts.xbox && config.social.accounts.xbox !== '' ? 1 : 0,
// 	psn: config.social.accounts.psn && config.social.accounts.psn !== '' ? 1 : 0,
// 	origin: config.social.accounts.origin && config.social.accounts.origin !== '' ? 1 : 0,
// 	uplay: config.social.accounts.uplay && config.social.accounts.uplay !== '' ? 1 : 0,
// 	nintendo: config.social.accounts.nintendo && config.social.accounts.nintendo !== '' ? 1 : 0,
// 	battlenet: config.social.accounts.battlenet && config.social.accounts.battlenet !== '' ? 1 : 0,
// 	deviantart: config.social.accounts.deviantart && config.social.accounts.deviantart !== '' ? 1 : 0,
// 	reddit: config.social.accounts.reddit && config.social.accounts.reddit !== '' ? 1 : 0,
// 	gamewisp: config.social.accounts.gamewisp && config.social.accounts.gamewisp !== '' ? 1 : 0,
// 	playstv: config.social.accounts.playstv && config.social.accounts.playstv !== '' ? 1 : 0,
// 	discord: config.social.accounts.discord && config.social.accounts.discord !== '' ? 1 : 0,
// 	store: config.social.accounts.store && config.social.accounts.store !== '' ? 1 : 0,
// 	github: config.social.accounts.github && config.social.accounts.github !== '' ? 1 : 0
// };

// config.social.enabled = enabled_config;

module.exports = merge(xconfig, config);
