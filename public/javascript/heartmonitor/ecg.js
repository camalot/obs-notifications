	(function ($) {
		$(function () {
			var diff = Date.now() - new Date("04/01/1977").getTime();
			var ageDate = new Date(diff);
			var age = Math.abs(ageDate.getUTCFullYear() - 1970);


			var low = 20;
			var smoothie = new SmoothieChart({
				responsive: true,
				minValue: 0,
				//maxValue: 220 - (age + 5),
				maxValue: 120,
				scaleSmoothing: 0.125,
				maxValueScale: 1,
				minValueScale: 1,
				grid: {
					strokeStyle: 'rgb(0, 0, 0, 0)', fillStyle: 'rgb(0, 0, 0, 0)',
					lineWidth: 1, millisPerLine: 1000, verticalSections: 0,
				},
				labels: { fillStyle: 'rgb(0, 0, 0, 0)' }
			});
			smoothie.streamTo(document.getElementById("ecg-smoothie"));
			var ecgData = new TimeSeries();
			smoothie.addTimeSeries(ecgData, { strokeStyle: 'rgb(255, 0, 0, 0.5)', fillStyle: 'rgba(255, 0, 0, 0)', lineWidth: 5});

			var socket = new WebSocket("ws://192.168.2.3:3880");
			socket.onopen = function (e) {
				console.log('Connected to server!');
				ecgData.append(new Date().getTime(), low);
			};
			socket.onclose = function (e) {
				console.log('Disconnected from server');
				ecgData.append(new Date().getTime(), low);
			};
			socket.onmessage = function (e) {
				var data = JSON.parse(e.data);
				if (data.bpm) {
					console.log(data.bpm);
					if (ecgData) {
						ecgData.append(new Date().getTime() - 200, low);
						ecgData.append(new Date().getTime(), data.bpm);
						ecgData.append(new Date().getTime() + 200, low);

					}
				}
			};
			socket.onerror = function (e) {
				console.log('An error has occurred!\n' + e.message);
			};
		});
	})(jQuery);
