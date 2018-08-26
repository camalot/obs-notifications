'use strict';

$(function () {
	$('[data-sortable]').each(function (i) {
		let group = $(this).data('sortable');
		var table = this;
		var dragger = tableDragger(table, {
			mode: 'row',
			dragHandler: '.handle',
			onlyBody: true,
			animation: 300
		});
		let dragTimeOut = null;
		dragger.on('drag', function(source, mode) {
			if (!dragTimeOut) {
				clearTimeout(dragTimeOut);
			}
		});
		dragger.on('drop', function (from, to, source, mode) {
			if (!dragTimeOut) {
				clearTimeout(dragTimeOut);
			}
			dragTimeOut = setTimeout(function() {
				// save the order of all
				let sortData = [];
				$('[data-sort]', table).each(function (r) {
					let id = $(this).data('sort-id');
					sortData.push({ id: id, sort: r });
				});
				let url = '/admin/social/accounts/sort';

				$.ajax(url, {
					method: "post",
					data: JSON.stringify({ data: sortData }),
					contentType: 'application/json',
					complete: function (xhr, status) {

					},
					success: function (data, xhr, status) {
						// go and enforces the new sorts
						for (let x = 0; x < data.length; ++x) {
							let sortInfo = data[x];
							$(`[data-sort-id=${sortInfo.id}]`, table).first().data("sort", sortInfo.sort);
						}
					},
					error: function (xhr, status, err) {

					}
				});
			}, 500);
			
		});
	});
});
