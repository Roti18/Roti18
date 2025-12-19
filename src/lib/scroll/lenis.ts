import Lenis from '@studio-freight/lenis';

export function startLenis() {
	const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

	if (isTouch) return;

	const lenis = new Lenis({
		duration: 1.4,
		easing: (t) => 1 - Math.pow(1 - t, 3),
		smoothWheel: true
	});

	function raf(time: number) {
		lenis.raf(time);
		requestAnimationFrame(raf);
	}

	requestAnimationFrame(raf);
}
