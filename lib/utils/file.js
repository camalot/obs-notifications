"use strict";

const path = require('path');
const fs = require('fs');
const normalizedPath = path.join(__dirname, "../../");



let readFileSync = (file) => {
	try {
		let fullPath = path.join(normalizedPath, file);

		if (fs.existsSync(fullPath)) {
			let data = Buffer.from(fs.readFileSync(fullPath));
			return data;
		} else {
			console.log(`File does not exist: ${fullPath}`);
			return "";
		}
	} catch (e) {
		console.error(e);
		return "";
	}
};


module.exports = {
	readFileSync: readFileSync
};
