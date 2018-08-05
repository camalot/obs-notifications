"use strict";

let _database = null;

let create = () => {
	return new Promise((resolve, reject) => {
		try {
			if (!_database || !_database.connected) {
				return reject("Database not open (quotes:create)");
			}
			// , " + 
			// "FOREIGN KEY(category) REFERENCES categories(category)
			_database.sql.run("CREATE TABLE IF NOT EXISTS quotes " +
				"(text TEXT NOT NULL UNIQUE, created NUMERIC NOT NULL, user TEXT NOT NULL, category TEXT NOT NULL)");
			return resolve();
		} catch (err) {
			return reject(err);
		}
	});
};

let remove = (id) => {
	return new Promise((resolve, reject) => {
		if (!_database || !_database.connected) {
			return reject("Database not open (quotes:remove)");
		}

		_database.sql.run("DELETE FROM quotes where rowid = $id", { $id: id }, (err) => {
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
		if (!_database || !_database.connected) {
			return reject("Database not open (quotes:get)");
		}
		let data = null;
		_database.sql.each("SELECT rowid AS id, text, created, user, category FROM quotes where rowid = $id LIMIT 1", { $id: id }, (err, row) => {
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
		var all = cat === "*";

		if (!_database || !_database.connected) {
			return reject("Database not open (quotes:all)");
		}

		let data = [];
		_database.sql.each("SELECT rowid AS id, text, created, user, category FROM quotes where category = $category OR 1 = $all", { $category: cat || undefined, $all: all ? 1 : 0 }, (err, row) => {
			if (err) {
				return reject(err);
			}
			console.log(`${row.id}: [${new Date(row.created)}] ${row.user}: ${row.text}`);
			data.push({
				id: row.id,
				created: row.created,
				user: row.user,
				text: row.text,
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

let random = (category) => {
	return new Promise((resolve, reject) => {
		let cat = category === "" || category === "null" ? null : category;
		console.log(`Category: ${cat}`);
		var all = cat === "*";

		let data = null;
		if (!_database || !_database.connected) {
			return reject("Database not open (quotes:random)");
		}

		_database.sql.each("SELECT rowid as id, text, created, user, category FROM quotes where category = $category OR 1 = $all ORDER BY RANDOM() LIMIT 1", { $category: cat || undefined, $all: all ? 1 : 0 }, (err, row) => {
			if (data === null) {
				data = {
					id: row.id,
					created: row.created,
					user: row.user,
					text: row.text,
					category: row.category
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
		if (!_database || !_database.connected) {
			return reject("Database not open (quotes:add)");
		}

		let utc = _database.utcNow();
		_database.sql.run("INSERT INTO quotes (text, created, user, category) VALUES ($text, $date, $user, $category)",
			{ $text: data.text, $date: utc, $user: data.user, $category: data.category }, (err) => {
				if (err) {
					return reject(err);
				}
				return resolve({
					id: data.rowid,
					text: data.text,
					date: utc,
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
			name: "quotes",
			create: create,
			all: all,
			add: add,
			random: random,
			remove: remove,
			get: get,
			database: _database
		};
	} catch (err) {
		throw err;
	}
};
