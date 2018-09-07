"use strict";
function Lurker(channel) {
	let eleId = `${channel}-embed`;
	let te = $(`#${eleId}`).get(0);
	if (te) {
		new Twitch.Embed(eleId, {
			width: "100%",
			height: "100%",
			channel: channel,
			allowfullscreen: true,
			theme: "dark",
			chat: "default"
		});
		// (function betterttv() {
		// 	var script = document.createElement('script'); script.type = 'text/javascript'; script.src = 'https://cdn.betterttv.net/betterttv.js';
		// 	var head = document.getElementsByTagName('head')[0]; if (!head) return; head.appendChild(script);
		// })();
	}
}

function getUserIds() {
	//https://api.twitch.tv/helix/users?login=darthminos&login=thekrymzun
}

$(function() {

	/*
	"data": [{
		"id": "58491861",
		"login": "darthminos",
		"display_name": "DarthMinos",
		"type": "",
		"broadcaster_type": "affiliate",
		"description": "I write code and I play games. I am better at writing code.",
		"profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/6a38b261-d2a9-4fc7-9429-f284f3ddf1a4-profile_image-300x300.png",
		"offline_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/8538f4b7fa0924e6-channel_offline_image-1920x1080.jpeg",
		"view_count": 3568
}, {
		"id": "147657851",
		"login": "thekrymzun",
		"display_name": "TheKrymzun",
		"type": "",
		"broadcaster_type": "affiliate",
		"description": "Twitch Affiliate | Technologist | Gamer | Sith Lord | Mandalorian Mercenary",
		"profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/0226bcc5-d612-4957-b20f-bd975b8c86ed-profile_image-300x300.png",
		"offline_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/2e74634d55386df2-channel_offline_image-1920x1080.png",
		"view_count": 9304
		}]
	*/
	let channels = [
		"becomesavage",
		"thekrymzun",
		"sabborn",
		"xoxokaralee"
	];

	
});
