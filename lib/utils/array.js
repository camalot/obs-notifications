"use strict";

module.exports = {
	clean: (array) => {
		for(let i = 0; i < array.length; ++i) {
			if(array[i] === null || array[i] === undefined || array[i] === "") {
				array.splice(i,1);
				i--;
			}
		}
		return array;
	}
};
