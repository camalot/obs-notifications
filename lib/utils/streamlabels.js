'use strict';
const fs = require('fs');
const config = require("../../config");
const arrayUtil = require("./array");

function read(file) {
	return new Promise((resolve, reject) => {
		fs.exists(file, (exists) => {
			if (exists) {
				fs.readFile(file, 'utf8', function (err, data) {
					if (err) {
						console.log("error:");
						console.error(err);
						reject(err);
					}
					let items = arrayUtil.clean((data || "").trim().split(/,\s?/gi));
					resolve(items);
				});
			} else {
				reject(new Error(`File '${file}' was not found.`));
			}
		});
	});
}

function readRecents() {
	return new Promise((resolve, reject) => {
		try {
			let fullList = [];
			for (let f = 0; f < config.recents.length; ++f) {
				let path = `${config.slPath}\\most_recent_${config.recents[f].name}.txt`;
				read(path).then((d) => {
					if (d.length > 0) {
						fullList.push(d);
					}
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

function readGoals() {
	return new Promise((resolve, reject) => {
		try {
			let fullList = [];
			for (let f = 0; f < config.goals.length; ++f) {
				let path = `${config.slPath}\\${config.goals[f]}.txt`;
				read(path).then((d) => {
					if (d.length > 0) {
						fullList.push(d);
					}
				}).catch((e) => {
					console.log(e);
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
	recents: readRecents,
	goals: readGoals
};
