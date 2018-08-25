"use strict";
$(function() {
	$("input[type=checkbox][data-checkbox]").change(function() {
		let cbp = $(this).parent().get(0);
		let cb = $(this);
		let value = cb.get(0).checked;
		let method = cb.data("method") || "get";
		let url = cb.data("checkbox").replace(`:${cb.attr("name")}`, value);
		$.ajax(url, {
			complete: function(xhr, status) {

			}, 
			success: function(data, status, xhr) {
				cbp.MaterialSwitch[value ? "on" : "off"]();
			}, 
			error: function(xhr, status, err) {
				cbp.MaterialSwitch[value ? "off" : "on"]();
			},
			method: method
		});
	});
});
