"use strict";

const xconfig = require("../../../config");
const merge = require("merge");

let config = {
	social: {
		delay: 20,
		pause: 0,
		defaults: {
			DEFAULT: {
				background: "#000",
				adjustment: 25,
				color: "#fff",
				image: "/public/images/social/blank.png"
			},
			twitter: {
				background: "#4b9bd8",
				color: "#fff",
				image: "/public/images/social/twitter.png"
			},
			github: {
				background: "#000",
				color: "#fff",
				image: "/public/images/social/github.png"
			},
			facebook: {
				background: "#3a5795",
				color: "#fff",
				image: "/public/images/social/facebook.png"
			},
			googleplus: {
				background: "#DB4D3F",
				color: "#fff",
				image: "/public/images/social/googleplus.png"
			},
			instagram: {
				background: "#44749c",
				color: "#fff",
				image: "/public/images/social/instagram.png"
			},
			youtube: {
				background: "#ec2727",
				color: "#fff",
				image: "/public/images/social/youtube.png"
			},
			paypal: {
				background: "#005082",
				color: "#fff",
				image: "/public/images/social/paypal.png"
			},
			twitch: {
				background: "#6542a6",
				color: "#fff",
				image: "/public/images/social/twitch.png"
			},
			mixer: {
				background: "#1c202e",
				color: "#fff",
				image: "/public/images/social/mixer.png"
			},
			tumblr: {
				background: "#324f6d",
				color: "#fff",
				image: "/public/images/social/tumblr.png"
			},
			patreon: {
				background: "#e6461a",
				color: "#fff",
				image: "/public/images/social/patreon.png"
			},
			snapchat: {
				background: "#fffc00",
				color: "#000",
				image: "/public/images/social/snapchat.png"
			},
			steam: {
				background: "#000",
				color: "#fff",
				image: "/public/images/social/steam.png"
			},
			xbox: {
				background: "#117d10",
				color: "#fff",
				image: "/public/images/social/xbox.png"
			},
			psn: {
				background: "#0b266b",
				color: "#fff",
				image: "/public/images/social/psn.png"
			},
			epic: {
				background: "#343432",
				color: "#fff",
				image: "/public/images/social/epic.png"
			},
			origin: {
				background: "#f05a22",
				color: "#fff",
				image: "/public/images/social/origin.png"
			},
			uplay: {
				background: "#4891cb",
				color: "#fff",
				image: "/public/images/social/uplay.png"
			},
			nintendo: {
				background: "#f78b33",
				color: "#fff",
				image: "/public/images/social/nintendo.png"
			},
			battlenet: {
				background: "#0081B4",
				color: "#fff",
				image: "/public/images/social/battlenet.png"
			},
			store: {
				background: "#ad3e27",
				color: "#fff",
				image: "/public/images/social/store.png"
			},
			discord: {
				background: "#7289DA",
				color: "#fff",
				image: "/public/images/social/discord.png"
			},
			deviantart: {
				background: "#009544",
				color: "#fff",
				image: "/public/images/social/deviantart.png"
			},
			reddit: {
				background: "#FF4500",
				color: "#fff",
				image: "/public/images/social/reddit.png"
			},
			gamewisp: {
				background: "#f8a853",
				color: "#000",
				image: "/public/images/social/gamewisp.png"
			},
			playstv: {
				background: "#14b3b2",
				color: "#fff",
				image: "/public/images/social/playstv.png"
			},
			destiny: {
				background: "#222",
				color: "#fff",
				image: "/public/images/social/destiny.png"
			},
			skype: {
				background: "#00ADEF",
				color: "#fff",
				image: "/public/images/social/skype.png"
			},
			pinterest: {
				background: "#CC2127",
				color: "#fff",
				image: "/public/images/social/pinterest.png"
			},
			linkedin: {
				background: "#007bb6",
				color: "#fff",
				image: "/public/images/social/linkedin.png"
			},
			sub: {
				background: "#6C23FF",
				color: "#fff",
				image: "/public/images/social/sub.png"
			}
		}
	}
};

module.exports = merge(xconfig, config);
