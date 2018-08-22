"use strict";

let _name = "networks";
let _database = null;
const config = require("./config");
const color = require('../lib/utils').color;


let create = () => {
	return new Promise((resolve, reject) => {
		try {
			if (!_database || !_database.connected) {
				return reject("Database not open (networks:create)");
			}
			let utc = _database.utcNow();
			_database.sql.run("CREATE TABLE IF NOT EXISTS networks ( " +
				"created NUMERIC NOT NULL, name TEXT NOT NULL UNIQUE, icon TEXT NOT NULL, color NUMERIC NOT NULL, " +
				"background NUMERIC NOT NULL, background2 NUMERIC, system NUMERIC NOT NULL DEFAULT(0))");
			for(let network in config.social.defaults) {
				if(network !== "DEFAULT") {
					_database.sql.run("INSERT INTO networks (created, name, icon, color, background, background2, system) VALUES ($created, $name, $icon, $color, $background, $background2, 1)", {

					});
				}
			}
			
			return resolve(this);
		} catch (err) {
			return reject(err);
		}
	});
};

let all = () => {
	return new Promise((resolve, reject) => {
		try {
			return resolve();
		} catch (err) {
			return reject(err);
		}
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

module.exports = (db) => {
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
