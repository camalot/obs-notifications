'use strict';

let init = (database) => {
	try {
		const fs = require("fs");
		const path = require("path");
		const normalizedPath = path.join(__dirname, "./");

		let tables = {};
		fs.readdirSync(normalizedPath).forEach((file) => {
			let tableMatch = /(.*?)\.table\.js/i;
			if (tableMatch.test(file)) {
				var name = file.substring(0, file.lastIndexOf('.')).replace(/\.table/gmi, "");
				console.log("load: " + name);
				tables[name] = require("./" + name + ".table")(database);
			}
		});
		return tables;
	} catch (err) {
		throw err;
	}
};
module.exports = init;
