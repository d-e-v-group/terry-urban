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
			'  <button class="tu-lightbox__prev" aria-label="Previous image">&#8249;</button>',
			'  <button class="tu-lightbox__next" aria-label="Next image">&#8250;</button>',
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
	}

	function prev() {
		activeIndex = (activeIndex - 1 + activeItems.length) % activeItems.length;
		renderImage();
	}

	function next() {
		activeIndex = (activeIndex + 1) % activeItems.length;
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
