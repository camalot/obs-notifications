'use strict';
const fs = require('fs');
const config = require("../../config");
function read(file) {
	return new Promise((resolve, reject) => {
		fs.readFile(file, 'utf8', function (err, data) {
			if (err) {
				console.log("error:");
				console.error(err);
				reject(err);
			}
			//data;

			let items = data.split(/,\s?/gi);
			resolve(items);
		});
	});
}

function readRecents() {
	return new Promise((resolve, reject) => {
		try {
		let fullList = [];
		for( let f = 0; f < config.recents.length; ++f ) {
			let path = `${config.slPath}\\most_recent_${config.recents[f]}.txt`;
			read(path).then((d) => { 
				fullList.push(d);
			}).catch((e) => {
				reject(e);
			});
		}
		resolve(fullList);
		} catch (err) { 
			console.log(err);
			reject(err);
		} 
	});
}

module.exports = {
	read: read,
	recents: readRecents
};
