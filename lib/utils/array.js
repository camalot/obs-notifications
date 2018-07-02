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
	},
	concat(array1, array2) {
		var a = array1.concat(array2);
		for (var i = 0; i < a.length; ++i) {
			for (var j = i + 1; j < a.length; ++j) {
				if (a[i] === a[j])
					a.splice(j--, 1);
			}
		}

		return a;
	}

};
