"use strict";
function DarthMinosSocialOverlay(settings) {
	$(".popup .right span").each(function () {
		let $this = $(this);
		let socialName = settings.social[$this.data("name")];
		$this.append(socialName);
	});
	let popups = $(".animate-popup");
	let i = 0;
	let pause = settings.popup.pause * 1000;
	function animatePopup() {
		if (i >= popups.length) {
			i = 0;
		}
		popups
			.eq(i)
			.addClass("show-popup")
			.delay(settings.popup.delay * 1000)
			.queue(function () {
				let $this = $(this);
				$this
					.addClass("hide-popup")
					.delay(1000)
					.queue(function () {
						$(this)
							.removeClass("hide-popup")
							.removeClass("show-popup")
							.dequeue();

						if (i == popups.length) {
							setTimeout(animatePopup, pause);
						} else {
							animatePopup();
						}
					})
					.dequeue();
			});
		i++;
	}
	animatePopup();
}
