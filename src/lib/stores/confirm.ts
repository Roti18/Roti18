import { writable } from 'svelte/store';

export type ConfirmOptions = {
	title: string;
	description?: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm?: () => void | Promise<void>;
};

export type ConfirmState = {
	open: boolean;
	title?: string;
	description?: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm?: () => void | Promise<void>;
};

export const confirmStore = writable<ConfirmState>({
	open: false
});

export function openConfirm(options: ConfirmOptions) {
	confirmStore.set({
		open: true,
		...options
	});
}

export function closeConfirm() {
	confirmStore.set({ open: false });
}
