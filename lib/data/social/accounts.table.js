"use strict";

let _name = "accounts";
let _database = null;
const config = require("./config");
const color = require("../../utils").color;
const async = require("async");

const DEFAULT = config.social.defaults.DEFAULT;
console.log(JSON.stringify(DEFAULT));
let create = () => {
	return new Promise((resolve, reject) => {
		try {
			if (!_database || !_database.connected) {
				return reject("Database not open (accounts:create)");
			}
			_database.sql.run(
				`CREATE TABLE IF NOT EXISTS ${_name} ( ` +
					"created NUMERIC NOT NULL, name TEXT NOT NULL UNIQUE, network_id NUMERIC NOT NULL, enabled NUMERIC NOT NULL DEFAULT(1));",
				err => {
					if (err) {
						console.log("ERROR IN CREATE");
						return reject(err);
					}

					_database.sql.run(

					, err => {
						if(err) {
							return reject(err);
						}
					});

					return resolve();
				}
			);

			console.log("done create");
		} catch (err) {
			return reject(err);
		}
	});
};

let all = () => {
	return new Promise((resolve, reject) => {
		if (!_database || !_database.connected) {
			return reject("Database not open (quotes:all)");
		}
		let data = [];
		_database.sql.each(`SELECT A.rowid AS id, A.created, A.name, A.network_id, N.name AS network_name, ` +
			`N.image AS network_image, N.color AS network_color, N.background AS network_background, N.background2 AS network_background2, ` + 
			`A.enabled FROM ${_name} AS A INNER JOIN networks AS N ON A.network_id = N.rowid`, {}, (err, row) => {
				if (err) {
					return reject(err);
				}
				data.push({
					id: row.id,
					created: row.created,
					name: row.name,
					network: {
						id: row.network_id,
						name: row.network_name,
						image: row.network_image,
						background: row.network_background,
						background2: row.network_background2,
						color: row.network_color
					},
					enabled: row.enabled
				});
			}, (err, rows) => {
				if (err) {
					return reject(err);
				}
				console.log("data:" + JSON.stringify(data));
				return resolve(data);
			});
	});
};

let add = () => {
	return new Promise((resolve, reject) => {
		try {
			return resolve();
		} catch (err) {
			return reject(err);
		}
	});
};

let remove = () => {
	return new Promise((resolve, reject) => {
		try {
			return resolve();
		} catch (err) {
			return reject(err);
		}
	});
};

let get = () => {
	return new Promise((resolve, reject) => {
		try {
			return resolve();
		} catch (err) {
			return reject(err);
		}
	});
};

module.exports = db => {
	try {
		_database = db;
		return {
			name: _name,
			create: create,
			all: all,
			add: add,
			remove: remove,
			get: get,
			database: _database
		};
	} catch (err) {
		throw err;
	}
};
