import { createAuthClient } from 'better-auth/svelte';

export const authClient = createAuthClient();

export async function signInWithGoogle(callbackURL?: string) {
	const targetURL = callbackURL || window.location.href;
	return authClient.signIn.social({
		provider: 'google',
		callbackURL: targetURL
	});
}

export async function signOut() {
	return authClient.signOut({
		fetchOptions: {
			onSuccess: () => {
				window.location.reload();
			}
		}
	});
}
