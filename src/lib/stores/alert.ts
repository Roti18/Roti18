import { writable } from 'svelte/store';

export type AlertType = 'success' | 'error' | 'info';

export type AlertState = {
	open: boolean;
	title?: string;
	message?: string;
	type?: AlertType;
};

export const alertStore = writable<AlertState>({
	open: false
});

export function openAlert(options: Omit<AlertState, 'open'>) {
	alertStore.set({
		open: true,
		type: 'info',
		...options
	});
}

export function closeAlert() {
	alertStore.set({ open: false });
}
