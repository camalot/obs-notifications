$.expr[':'].closest = function (elem, index, match) {
	return $(elem).closest(match[3]).length;
};

$(function() {
	$("[data-settings]").each(function(i) {
		let $button = $(this);
		$button.on("click", function() {
			let $form = $($button.data("settings")).first();
			
			let $editor = $("[data-editor]", $form);
			let $textarea = $($editor.data("editor"), $form);
			let editor = ace.edit($editor.get(0));
			let value = editor.getValue();
			$textarea.text(value);
			$form.submit();
		});
		
	});
});
