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

class ConfirmService {
    state = $state<ConfirmState>({
        open: false
    });

    open(options: ConfirmOptions) {
        this.state = {
            open: true,
            ...options
        };
    }

    close() {
        this.state = { open: false };
    }
}

export const confirmService = new ConfirmService();
