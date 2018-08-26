"use strict";
const express = require("express");
const router = express.Router();
const config = require("./home.config");


router.get("/", (req, res, next) => {
	return new Promise((resolve, reject) => {
		try {

		} catch (err) {
			return next(err);
		}
	});
});
