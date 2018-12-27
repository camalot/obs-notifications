"use strict";

$(function () {
	$("[data-dialog]").each(function (i) {
		let dialogId = $(this).data("dialog");
		$(this).click(function () {
			let dialog = $(`#${dialogId}`).get(0);
			if (dialog) {
				if (dialogPolyfill) {
					dialogPolyfill.registerDialog(dialog);
				}
				dialog.showModal();
			}
		});
	});


	$("dialog button.close").click(function () {
		let dialog = $(this).closest("dialog").get(0);
		if (dialog) {
			dialog.close();
		}
	});
});
