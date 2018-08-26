"use strict";

let adjust = (color, amount) => {
	let parsed = parseInt(amount);
	let usePound = false;
	amount = isNaN(amount) ? 
		isNaN(parsed) ? 0 : parsed
		: amount;
	color = color || "#000000";

	if (color[0] == "#") {
		color = color.slice(1);
		usePound = true;
	}

	if (color.length === 3) {
		color = `${color[0]}${color[0]}${color[1]}${color[1]}${color[2]}${color[2]}`;
	}

	let R = parseInt(color.substring(0, 2), 16);
	R = isNaN(R) ? 0 : R;
	let G = parseInt(color.substring(2, 4), 16);
	G = isNaN(G) ? 0 : G;
	let B = parseInt(color.substring(4, 6), 16);
	B = isNaN(B) ? 0 : B;
	// to make the colour less bright than the input
	// change the following three "+" symbols to "-"
	R = R + amount;
	G = G + amount;
	B = B + amount;

	if (R > 255) R = 255;
	else if (R < 0) R = 0;

	if (G > 255) G = 255;
	else if (G < 0) G = 0;

	if (B > 255) B = 255;
	else if (B < 0) B = 0;

	let RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
	let GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
	let BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

	return (usePound ? "#" : "") + RR + GG + BB;

};

module.exports = {
	adjust: adjust
};
