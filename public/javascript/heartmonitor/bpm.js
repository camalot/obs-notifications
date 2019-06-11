(function ($) {
	$(function () {
		const SOCKET_ENDPOINT = "ws://192.168.2.3:3880";
		const CLASS_BASE = "hms-range";
		const RANGES = {
			BLUE: {
				min: 0,
				max: 75
			},
			GREEN: {
				min: 76,
				max: 86
			},
			RED: {
				min: 87,
				max: 220
			}

		}
		let reconnectPointer = null;
		let socket;

		function _startWS(socketAddress) {

			socket = new WebSocket(socketAddress);
			socket.onopen = function (e) {
				console.log('Connected to server!');
				$(".hms-value")
					.data("bpm", "")
					.empty();
			};
			socket.onclose = function (e) {
				$(".hms-value")
					.removeClass(`hms-range-default ${_getColorClasses().join(' ')}`)
					.data("bpm", "")
					.empty();
				console.log('Disconnected from server');
				clearTimeout(reconnectPointer);
				console.log("Reconnect attempt in 5 seconds.");
				socket = null;
				reconnectPointer = setTimeout(() => {
					console.log("Attempting to reconnect...");
					_startWS(socketAddress);
				}, 5000);
			};
			socket.onmessage = function (e) {
				let payload = JSON.parse(e.data);
				switch (payload.event) {
					case "bpm":
						if (data.bpm) {
							$(".hms-value")
								.removeClass(`hms-range-default ${_getColorClasses().join(' ')}`)
								.data("bpm", payload.data.bpm)
								.addClass(_getColorClass(payload.data.bpm))
								.html(payload.data.bpm);
						} else {
							$(".hms-value")
								.removeClass(`hms-range-default ${_getColorClasses().join(' ')}`)
								.data("bpm", "")
								.empty();
						}
						break;
					case "error":
						if (payload.message) {
							console.error(payload.data.message);
							console.error(payload.data.stack);
						}
						break;
				}
			};

			socket.onerror = function (e) {
				console.error('An error has occurred!\n' + e.message);
			};
		}

		_startWS(SOCKET_ENDPOINT);
		function _getColorClasses() {
			let classes = [];
			for (let x in RANGES) {
				classes.push(`${CLASS_BASE}-${x.toLocaleLowerCase()}`);
			}
		}
		function _getColorClass(bpm) {

			for (let x in RANGES) {
				if (bpm >= RANGES[x].min && bpm <= RANGES[x].max) {
					return `${CLASS_BASE}-${x.toLowerCase()}`;
				}
			}

			return `${CLASS_BASE}-default`;
		}
	});
})(jQuery);
