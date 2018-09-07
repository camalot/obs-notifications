"use strict";

let _name = "sources";
let _database = null;

let create = () => {
	return new Promise((resolve, reject) => {
		try {
			if (!_database || !_database.connected) {
				return reject("Database not open (sources:create)");
			}
			_database.sql.run(
				`CREATE TABLE IF NOT EXISTS ${_name} ( ` +
				"created NUMERIC NOT NULL, alias TEXT NOT NULL UNIQUE, level INTEGER NOT NULL DEFAULT(7), " + 
				"length INTEGER NOT NULL DEFAULT(1000), advertise INTEGER NOT NULL DEFAULT(0));",
				err => {
					if (err) {
						console.error(err);
						return reject(err);
					}
					console.log(`create database table ${_name} complete`);
					return resolve();
				}
			);		} catch (err) {
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

let update = () => {
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
			update: update,
			database: _database
		};
	} catch (err) {
		throw err;
	}
};
