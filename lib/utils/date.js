'use strict';
const moment = require('moment');
const momentts = require('moment-timezone');

let _getUnixTime = (date) => {
	return date.getTime() / 1000 | 0;
};

let _startOfDay = (date) => {
	// date.setHous(0,0,0,0);
	// return date;
	return moment(date).utc().startOf('day').toDate();
};

let _endOfDay = (date) => {
	// date.setHours(23,59,59,999);
	// return date;
	return moment(date).utc().endOf('day').toDate();
};

let _utc = (date) => {
	return moment(date).utc().toDate();
};

let _DoWArray = () => {
	return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
};

// this has to be like this because of the call to `arguments`
function _manipulate(date) {
	try {
		// args: ['+N days']
		const pattern = /^(\+|-)(\d{1,})\s(m(?:illi)?s(?:econds)?|s(?:econds)?|m(?:inutes)|h(?:ours)?|d(?:ays)?|w(?:eeks)?|M|months|Q|quarters|y(?:ears)?)$/g;
		// 1: operator
		// 2: number
		// 3: unit
		let xargs = [];
		const $arguments = [...arguments].slice(1);
		if ($arguments.length === 1) {
			if (typeof $arguments[0] === typeof []) {
				xargs = $arguments[0];
			} else if (typeof $arguments[0] === typeof "") {
				xargs.push($arguments[0]);
			} else {
				xargs = $arguments.slice(0);
			}
		} else {
			xargs = $arguments.slice();
		}

		let mdate = moment(date).utc();
		for (let x = 0; x < xargs.length; ++x) {
			let match;
			// This is necessary to avoid infinite loops with zero-width matches
			while ((match = pattern.exec(xargs[x])) !== null) {
				if (match.index === pattern.lastIndex) {
					pattern.lastIndex++;
				}
				let op = match[1] === "+" ? "add" : "subtract";
				let duration = match[2];
				let unit = match[3];
				// console.log(op + "(" + duration + ", " + unit + ")");
				mdate[op](duration, unit);
			}

		}
		return mdate.toDate();
	} catch (ex) {
		console.error(ex);
		throw ex;
	}
}

module.exports = {
	getUnixTime: _getUnixTime,
	startOfDay: _startOfDay,
	endOfDay: _endOfDay,
	utc: _utc,
	manipulate: _manipulate,
	dowArray: _DoWArray
};
