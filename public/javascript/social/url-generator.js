$(function () {
	$("[data-url-generator]").each(function (i) {
		let group = $(this);
		let urlTemplate = group.data("url-generator");
		let textField = $(`#${group.data("field")}`);
		group.find(":input").on("change", function() {
			let pattern = /\$\{(.*?)\}/gi;
			let keys = urlTemplate.match(pattern);
			let matches = null;
			textField.val(urlTemplate);
			for (let x = 0; x < keys.length; ++x) {
				let key = keys[x];
				while ((matches = pattern.exec(key)) !== null) {
					let input = matches[1];
					let selected = $(`[name='${input}']:checked`).val();
					textField.val(textField.val().replace(key, selected));
				}
			}
		}).trigger("change");
		textField.on("click focus", function() {
			$(this).select();
		});
	});

	$("button[data-clipboard]").each(function(i) {
		let btn = $(this);
		let evt = btn.data("clipboard") || "click";
		btn.on(evt, function() {
			let field = $(`#${$(this).data('field')}`);
			copyTextToClipboard(field.val());
		});
	});
	
	function copyTextToClipboard(text) {
		if (!navigator.clipboard) {
			fallbackCopyTextToClipboard(text);
			return;
		}
		navigator.clipboard.writeText(text).then(function () {
			console.log('Async: Copying to clipboard was successful!');
		}, function (err) {
			console.error('Async: Could not copy text: ', err);
		});
	}
	function fallbackCopyTextToClipboard(text) {
		var textArea = document.createElement("textarea");
		textArea.value = text;
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();
	
		try {
			var successful = document.execCommand('copy');
			var msg = successful ? 'successful' : 'unsuccessful';
			console.log('Fallback: Copying text command was ' + msg);
		} catch (err) {
			console.error('Fallback: Oops, unable to copy', err);
		}
	
		document.body.removeChild(textArea);
	}
});
