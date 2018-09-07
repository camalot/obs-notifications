"use strict";

let _name = "";
let _database = null;


if(!_name || _name === "") {
	throw new Error("_name not defined");
}

let create = () => {
	return new Promise((resolve, reject) => {
		try {
			if (!_database || !_database.connected) {
				return reject(`Database not open (${_name}:create)`);
			}

			return resolve();
		} catch (err) {
			return reject(err);
		}
	});
};

let all = () => {
	return new Promise((resolve, reject) => {
		try {
			if (!_database || !_database.connected) {
				return reject(`Database not open (${_name}:all)`);
			}
			return resolve();
		} catch (err) {
			return reject(err);
		}
	});
};

let add = () => {
	return new Promise((resolve, reject) => {
		try {
			if (!_database || !_database.connected) {
				return reject(`Database not open (${_name}:add)`);
			}
			return resolve();
		} catch (err) {
			return reject(err);
		}
	});
};

let remove = () => {
	return new Promise((resolve, reject) => {
		try {
			if (!_database || !_database.connected) {
				return reject(`Database not open (${_name}:remove)`);
			}
			return resolve();
		} catch (err) {
			return reject(err);
		}
	});
};

let get = () => {
	return new Promise((resolve, reject) => {
		try {
			if (!_database || !_database.connected) {
				return reject(`Database not open (${_name}:get)`);
			}
			return resolve();
		} catch (err) {
			return reject(err);
		}
	});
};

let update = () => {
	return new Promise((resolve, reject) => {
		try {
			if (!_database || !_database.connected) {
				return reject(`Database not open (${_name}:update)`);
			}
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
