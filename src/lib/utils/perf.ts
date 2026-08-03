import { browser } from '$app/environment';

/**
 * Returns true if the device is "laptop-class" (>= 1024px wide).
 * Use this to gate heavy GSAP filter effects like blur.
 */
export function canUseBlur(): boolean {
	if (!browser) return false;
	return window.innerWidth >= 1024;
}

/**
 * Returns a GSAP-compatible filter string.
 * On mobile, blur is stripped out for performance.
 */
export function blurFilter(blurPx: number, extras = ''): string {
	if (!canUseBlur()) return extras || 'none';
	const parts = [`blur(${blurPx}px)`];
	if (extras) parts.push(extras);
	return parts.join(' ');
}
