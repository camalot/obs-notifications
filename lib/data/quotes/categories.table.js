"use strict";

let _database = null;

let create = () => {
	return new Promise((resolve, reject) => {
		try {
			if (!_database || !_database.connected) {
				return reject("Database not open (categories:create)");
			}

			_database.sql.run("CREATE TABLE IF NOT EXISTS categories (created NUMERIC NOT NULL, user TEXT NOT NULL, category TEXT NOT NULL UNIQUE)");
			return resolve(this);
		} catch (err) {
			return reject(err);
		}
	});
};
let remove = (id) => {
	return new Promise((resolve, reject) => {
		if (!_database || !_database.connected) {
			return reject("Database not open (categories:remove)");
		}
		_database.sql.each("SELECT category FROM categories where rowid = $id LIMIT 1", { $id: id }, (err, row) => {
			if (err) {
				return reject(err);
			}
			let category = row.category;
			_database.sql.run("DELETE FROM quotes where category = $category", { $category: category }, (err) => {
				if (err) {
					return reject(err);
				}
				_database.sql.run("DELETE FROM categories where rowid = $id", { $id: id }, (err) => {
					if (err) {
						return reject(err);
					}

					console.log(`deleted quote: ${id}`);
					return resolve();
				});
			});
		});
	});
};

let get = (id) => {
	return new Promise((resolve, reject) => {
		if (!_database || !_database.connected) {
			return reject("Database not open (categories:get)");
		}
		let data = null;
		_database.sql.each("SELECT rowid AS id, text, created, user, category FROM categories where rowid = $id LIMIT 1", { $id: id }, (err, row) => {
			if (err) {
				return reject(err);
			}

			data = {
				id: row.id,
				created: row.created,
				user: row.user,
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

let all = () => {
	return new Promise((resolve, reject) => {
		if (!_database || !_database.connected) {
			return reject("Database not open (categories:all)");
		}

		let data = [];
		_database.sql.each("SELECT rowid AS id, category FROM categories", (err, row) => {
			if (err) {
				return reject(err);
			}
			data.push({
				id: row.id,
				created: row.created,
				user: row.user,
				category: row.category
			});
		}, (err, rows) => {
			if (err) {
				return reject(err);
			}

			return resolve(data);
		});
	});
};

let add = (data) => {
	return new Promise((resolve, reject) => {
		if (!_database || !_database.connected) {
			return reject("Database not open (categories:add)");
		}
		let date = new Date();
		var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
			date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

		_database.sql.run("INSERT INTO quotes (text, created, user, category) VALUES ($text, $date, $user, $category)",
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

module.exports = (db) => {
	try {
		_database = db;
		return {
			name: "categories",
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
