'use strict';
const bcrypt = require('bcrypt-nodejs');
const zxcvbn = require('zxcvbn');

const MIN_PASSWORD_LENGTH = 8;
module.exports = {
	validate: (req) => {
		return new Promise((resolve, reject) => {
			let pwr = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/g;
			if(!pwr.test(req.body.password)) {
				console.log("pwr test failed");
				return reject(`Password must be at least ${MIN_PASSWORD_LENGTH} characters in length and contain at least 1 uppercase alphabet, 1 lowercase alphabet, and 1 number.`);
			}
			let pwMatch = req.body.password == req.body.verify_password;
			if (!pwMatch) {
				console.log("pwMatch fail");
				return reject("Passwords do not match");
			}
			let strength = zxcvbn(req.body.password);
			if(strength.score < 1) {
				console.log("score fail");
				return reject(strength.feedback.warning || "Password too weak.");
			}

			if(req.body.account_type !== "Default") {
				// access key check
				if(!req.body.accesskey) {
					console.log("access key fail");
					return reject("Access Key missing. Please enter Access Key.")
				}

				// TODO: lookup access key to see if it is valid.

			}
			
			return resolve();
		});
	}
};
