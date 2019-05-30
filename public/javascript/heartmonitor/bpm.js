(function ($) {
	$(function () {
		var socket = new WebSocket("ws://127.0.0.1:3880");
		socket.onopen = function (e) {
			console.log('Connected to server!');
			$(".hms-value").empty();
		};
		socket.onclose = function (e) {
			console.log('Disconnected from server');
			$(".hms-value").empty();
		};
		socket.onmessage = function (e) {
			var data = JSON.parse(e.data);
			if (data.bpm) {
				$(".hms-value").html(data.bpm);
			}
		};
		socket.onerror = function (e) {
			console.log('An error has occurred!\n' + e.message);
		};
	});
})(jQuery);
