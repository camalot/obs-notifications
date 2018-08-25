'use strict';

const xconfig = require('../config');
const merge = require('merge');
const color = require('../lib/utils').color;

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
			googleplus: {
				background: "#DB4D3F",
				color: "#fff", 
				image: "/images/social/googleplus.png"
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
				color: "#000",
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
			epic: {
				background: "#343432",
				color: "#fff",
				image: "/images/social/epic.png"
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
				background: "#f78b33",
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
				background: "#009544",
				color: "#fff",
				image: "/images/social/deviantart.png"
			},
			reddit: {
				background: "#FF4500",
				color: "#fff",
				image: "/images/social/reddit.png"
			},
			gamewisp: {
				background: "#f8a853",
				color: "#000",
				image: "/images/social/gamewisp.png"
			},
			playstv: {
				background: "#14b3b2",
				color: "#fff",
				image: "/images/social/playstv.png"
			},
			destiny: {
				background: "#222",
				color: "#fff",
				image: "/images/social/destiny.png"
			},
			skype: {
				background: "#00ADEF",
				color: "#fff",
				image: "/images/social/skype.png"
			},
			pinterest: {
				background: "#CC2127",
				color: "#fff",
				image: "/images/social/pinterest.png"
			},
			linkedin: {
				background: "#007bb6",
				color: "#fff",
				image: "/images/social/linkedin.png"
			}
		}
	}
};

let getValueOrDefault = (key, prop, defaultValue) => {
	key = key.toUpperCase();
	prop = prop.toLowerCase();
	let defaultKey = config.social.defaults[key.toLowerCase()] && config.social.defaults[key.toLowerCase()][prop] ? key.toLowerCase() : "DEFAULT";
	let customValue = process.env[`APP_SOCIAL_CUSTOM_${prop.toUpperCase()}_${key}`];
	if (customValue) {
		return customValue;
	} else if (config.social.defaults[defaultKey] && config.social.defaults[defaultKey][prop]) {
		return config.social.defaults[defaultKey][prop];
	} else {
		return defaultValue;
	}
};

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
		let id = m[1];
		let account_id = id.toLowerCase();
		let bgColor = getAccountBGColor(id);
		accounts[account_id] = {
			text: process.env[m[0]],
			color: getAccountFGColor(id),
			background: bgColor,
			background2: getAccountBGSecondaryColor(id),
			image: getAccountImage(id)
		};
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
module.exports = merge(xconfig, config);
