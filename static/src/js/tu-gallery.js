/**
 * Gallery Lightbox
 * Handles lightbox functionality for all .tu-gallery sections on the page.
 * Multiple gallery instances are supported; each maintains its own image set.
 **/

(function () {
	// Vars
	// ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒

	let lightboxEl = null;
	let lightboxImg = null;
	let activeItems = []; // li.tu-gallery__item nodes from the active gallery
	let activeIndex = 0;

	// Logic
	// ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒

	function buildLightbox() {
		const el = document.createElement("div");
		el.className = "tu-lightbox";
		el.setAttribute("hidden", "");
		el.setAttribute("role", "dialog");
		el.setAttribute("aria-modal", "true");
		el.setAttribute("aria-label", "Image lightbox");
		el.innerHTML = [
			'<div class="tu-lightbox__overlay"></div>',
			'<div class="tu-lightbox__frame">',
			'  <img class="tu-lightbox__image" src="" alt="">',
			"</div>",
			'<button class="tu-lightbox__close" aria-label="Close">&times;</button>',
			'<div class="tu-lightbox__nav">',
			'  <button class="tu-lightbox__prev" aria-label="Previous image"><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-chevron-left" viewBox="0 0 9.8 16.8"><path d="M8.8 0c.3 0 .5.1.7.3.4.4.4 1 0 1.4L2.8 8.4l6.7 6.7c.4.4.4 1 0 1.4s-1 .4-1.4 0L0 8.4 8.1.3c.2-.2.4-.3.7-.3z" class="layer"/></svg></button>',
			'  <button class="tu-lightbox__next" aria-label="Next image"><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-chevron-right" viewBox="0 0 9.8 16.8"><path d="M1 16.8c-.3 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4L7 8.4.3 1.7C-.1 1.3-.1.7.3.3s1-.4 1.4 0l8.1 8.1-8.1 8.1c-.2.2-.4.3-.7.3z"/></svg></button>',
			"</div>",
		].join("");
		document.body.appendChild(el);
		return el;
	}

	function open(galleryEl, index) {
		activeItems = Array.from(
			galleryEl.querySelectorAll(".tu-gallery__item[data-lightbox-src]")
		);
		activeIndex = index;
		renderImage();
		lightboxEl.removeAttribute("hidden");
		document.body.classList.add("tu-lightbox-open");
		lightboxEl.querySelector(".tu-lightbox__close").focus();
	}

	function close() {
		lightboxEl.setAttribute("hidden", "");
		lightboxImg.src = "";
		document.body.classList.remove("tu-lightbox-open");
		activeItems = [];
	}

	function renderImage() {
		const item = activeItems[activeIndex];
		lightboxImg.src = item.dataset.lightboxSrc;
		lightboxImg.alt = item.dataset.caption || "";
		updateNavState();
		preloadAdjacent();
	}

	function preloadAdjacent() {
		[activeIndex - 1, activeIndex + 1].forEach(function (i) {
			if (i < 0 || i >= activeItems.length) return;
			var src = activeItems[i].dataset.lightboxSrc;
			if (!src) return;
			var img = new Image();
			img.src = src;
		});
	}

	function updateNavState() {
		const prevBtn = lightboxEl.querySelector(".tu-lightbox__prev");
		const nextBtn = lightboxEl.querySelector(".tu-lightbox__next");
		const atStart = activeIndex === 0;
		const atEnd   = activeIndex === activeItems.length - 1;
		prevBtn.disabled = atStart;
		nextBtn.disabled = atEnd;
	}

	function prev() {
		if (activeIndex === 0) return;
		activeIndex -= 1;
		renderImage();
	}

	function next() {
		if (activeIndex === activeItems.length - 1) return;
		activeIndex += 1;
		renderImage();
	}

	function bindGallery(galleryEl) {
		const items = galleryEl.querySelectorAll(
			".tu-gallery__item[data-lightbox-src]"
		);
		items.forEach(function (item, index) {
			item
				.querySelector(".tu-gallery__trigger")
				.addEventListener("click", function () {
					open(galleryEl, index);
				});
		});
	}

	function init() {
		const galleries = document.querySelectorAll(".tu-gallery");
		if (!galleries.length) return;

		lightboxEl = buildLightbox();
		lightboxImg = lightboxEl.querySelector(".tu-lightbox__image");

		// Lightbox controls
		lightboxEl
			.querySelector(".tu-lightbox__close")
			.addEventListener("click", close);
		lightboxEl
			.querySelector(".tu-lightbox__overlay")
			.addEventListener("click", close);
		lightboxEl
			.querySelector(".tu-lightbox__prev")
			.addEventListener("click", prev);
		lightboxEl
			.querySelector(".tu-lightbox__next")
			.addEventListener("click", next);

		// Keyboard
		document.addEventListener("keydown", function (e) {
			if (lightboxEl.hasAttribute("hidden")) return;
			if (e.key === "Escape") close();
			if (e.key === "ArrowLeft") prev();
			if (e.key === "ArrowRight") next();
		});

		// Swipe
		var touchStartX = 0;
		lightboxEl.addEventListener("touchstart", function (e) {
			touchStartX = e.changedTouches[0].screenX;
		}, { passive: true });
		lightboxEl.addEventListener("touchend", function (e) {
			var delta = e.changedTouches[0].screenX - touchStartX;
			if (Math.abs(delta) < 40) return;
			if (delta < 0) next();
			else prev();
		}, { passive: true });

		// Bind each gallery independently
		galleries.forEach(bindGallery);
	}

	// Do not edit below this line...
	// ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}
})();
