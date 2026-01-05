import { type Component } from 'svelte';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

class ToastService {
    toasts = $state<Toast[]>([]);

    add(message: string, type: ToastType = 'info', duration = 3000) {
        const id = Math.random().toString(36).substring(2, 9);
        const toast: Toast = { id, message, type, duration };
        this.toasts.push(toast);

        if (duration > 0) {
            setTimeout(() => {
                this.remove(id);
            }, duration);
        }
    }

    success(message: string, duration?: number) {
        this.add(message, 'success', duration);
    }

    error(message: string, duration?: number) {
        this.add(message, 'error', duration);
    }

    warning(message: string, duration?: number) {
        this.add(message, 'warning', duration);
    }

    info(message: string, duration?: number) {
        this.add(message, 'info', duration);
    }

    remove(id: string) {
        this.toasts = this.toasts.filter((t) => t.id !== id);
    }
}

export const toastService = new ToastService();
