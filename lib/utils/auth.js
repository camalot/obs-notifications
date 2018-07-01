'use strict';
const bcrypt = require('bcrypt-nodejs');
const shortid = require('shortid');
const siconfig = require('../../config/shortid');

module.exports = {
	// route middleware to make sure a user is logged in
	isLoggedIn: (req, res, next) => {
		process.nextTick(() => {
			// if user is authenticated in the session, carry on
			//if (req.isAuthenticated())
				return next();

			if (/^\/$/gi.test(req.route.path)) {
				return res.redirect('/features');
			}
			// if they aren't redirect them to the home page
			return res.redirect('/login');
		});
	},
	generatePasswordHash: (password) => {
		return new Promise(function(resolve, reject) {
			bcrypt.hash(password, bcrypt.genSaltSync(8), null, (err, result) => {
				if (err) {
					console.error(err);
					reject(err);
				} else {
					resolve(result);
				}
			});
		});
	},
	validatePassword: (password, local) => {
		return bcrypt.compareSync(password, local);
	},
	generateId: () => {
		return new Promise((resolve, reject) => {
			try {
				siconfig(shortid);
				resolve(shortid.generate());
			} catch (e) {
				reject(e);
			}
		});
	},
	generateIdSync: () => {
		siconfig(shortid);
		return shortid.generate();
	},
	isValidId: (id) => {
		return new Promise((resolve, reject) => {
			try {
				siconfig(shortid);
				resolve(shortid.isValid(id));
			} catch (ex) {
				reject(ex);
			}
		});
	}
}
