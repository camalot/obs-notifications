"use strict";

const sqlite3 = require('sqlite3').verbose();

let _database = null;
let _connected = false;
let open = () => {
	return new Promise((resolve, reject) => {
		try {
			_database = new sqlite3.Database('/databases/quotes.sqlite', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE);
			_connected = true;
			return create()
				.then(() => { return resolve(this); })
				.catch((err) => { return reject(err); });
		} catch (err) {
			return reject(err);
		}
	});
};
let create = () => {
	return new Promise((resolve, reject) => {
		try {
			if (!_connected) {
				return reject("Database not open");
			}

			_database.run("CREATE TABLE IF NOT EXISTS quotes (text TEXT, created NUMERIC, user TEXT, category TEXT)");
			return resolve(this);
		} catch (err) {
			return reject(err);
		}
	});
};

let close = () => {
	return new Promise((resolve, reject) => {
		try {
			_database.close();
			_connected = false;
			return resolve();
		} catch (err) {
			return reject(err);
		}
	});
};

let remove = (id) => {
	return new Promise((resolve, reject) => {
		if (!_connected) {
			return reject("Database not open");
		}

		_database.run("DELETE FROM quotes where rowid = $id", { $id: id }, (err) => {
			if (err) {
				return reject(err);
			}

			console.log(`deleted quote: ${id}`);
			return resolve();
		});
	});
};

let get = (id) => {
	return new Promise((resolve, reject) => {
		if (!_connected) {
			return reject("Database not open");
		}
		let data = null;
		_database.each("SELECT rowid AS id, text, created, user, category FROM quotes where rowid = $id LIMIT 1", { $id: id }, (err, row) => {
			if (err) {
				return reject(err);
			}

			data = {
				id: row.id,
				created: row.created,
				user: row.user,
				text: row.text,
				category: row.category
			};
		}, (err, rows) => {
			if (err) {
				return reject(err);
			}
			if (rows > 1) {
				return reject(`Too many results returned. Expected 1, got back ${rows}.`);
			}
			if (rows === 0 || data === null) {
				return reject("No data found");
			}

			return resolve(data);
		});
	});
};

let all = (category) => {
	return new Promise((resolve, reject) => {
		let cat = category === "" || category === "null" ? null : category;
		if (!_connected) {
			return reject("Database not open");
		}

		let data = [];
		_database.each("SELECT rowid AS id, text, created, user FROM quotes where category = $category", { $category: cat || undefined }, (err, row) => {
			if (err) {
				return reject(err);
			}
			console.log(`${row.id}: [${new Date(row.created)}] ${row.user}: ${row.text}`);
			data.push({
				id: row.id,
				created: row.created,
				user: row.user,
				text: row.text
			});
		}, (err, rows) => {
			if (err) {
				return reject(err);
			}

			return resolve(data);
		});
	});
};

let random = (category) => {
	return new Promise((resolve, reject) => {
		let cat = category === "" || category === "null" ? null : category;
		console.log(`Category: ${cat}`);
		let data = null;
		if (!_connected) {
			return reject("Database not open");
		}

		_database.each("SELECT rowid as id, text, created, user FROM quotes where category = $category ORDER BY RANDOM() LIMIT 1", { $category: cat || undefined }, (err, row) => {
			if (data === null) {
				data = {
					id: row.id,
					created: row.created,
					user: row.user,
					text: row.text
				};
			} else {
				throw new Error("Data object already set.");
			}
		}, (err, rows) => {
			if (err) {
				return reject(err);
			}

			if (rows === 0 || data === null) {
				return reject("No data found");
			}

			return resolve(data);
		});
	});
};

let add = (data) => {
	return new Promise((resolve, reject) => {
		if (!_connected) {
			return reject("Database not open");
		}
		let date = new Date();
		var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
			date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
		console.log(date.toString());

		_database.run("INSERT INTO quotes (text, created, user, category) VALUES ($text, $date, $user, $category)",
			{ $text: data.text, $date: now_utc, $user: data.user, $category: data.category }, (err) => {
				if (err) {
					return reject(err);
				}
				return resolve({
					id: data.rowid,
					text: data.text,
					date: now_utc,
					user: data.user,
					category: data.category
				});
			});
	});
};

module.exports = {
	open: open,
	create: create,
	close: close,
	all: all,
	add: add,
	random: random,
	remove: remove,
	get: get,
	database: _database,
	connected: _connected
};
