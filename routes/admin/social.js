'use strict';
const express = require('express');
const router = express.Router();
const config = require('./social.config');
const utils = require('../../lib/utils');
const merge = require('merge');


const Database = require("../../lib/data/database");
let database = new Database("social");

router.get("/", (req, res, next) => {
	try {
		return res.render("social/index", { layout: "material" });
	} catch (e) {
		return next(e);
	}
});


module.exports = router;
