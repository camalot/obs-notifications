(function ($) {
	$(function () {
		const SOCKET_ENDPOINT = "ws://192.168.2.3:3880";
		let reconnectPointer = null;
		let socket;

		function _startWS(socketAddress) {

			socket = new WebSocket();
			socket.onopen = function (e) {
				console.log('Connected to server!');
				$(".hms-value").empty();
			};
			socket.onclose = function (e) {
				$(".hms-value").empty();
				console.log('Disconnected from server');
				clearTimeout(reconnectPointer);
				console.log("Reconnect attempt in 5 seconds.");
				socket = null;
				reconnectPointer = setTimeout(() => {
					console.log("Attempting to reconnect...");
					start(socketAddress);
				}, 5000);
			};
			socket.onmessage = function (e) {
				let data = JSON.parse(e.data);
				if (data.bpm) {
					$(".hms-value").html(data.bpm);
				} else {
					$(".hms-value").empty();
				}
			};
			socket.onerror = function (e) {
				console.error('An error has occurred!\n' + e.message);
			};
		}

		_startWS(SOCKET_ENDPOINT);
	});
})(jQuery);
