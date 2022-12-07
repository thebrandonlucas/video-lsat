import { PUBLIC_API_URL } from '$env/static/public';
import type { PageServerLoad } from '.svelte-kit/types/src/routes/$types';
import { error } from '@sveltejs/kit';
import type { Video } from './types';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const url = `${PUBLIC_API_URL}/videos`;
		const res = await fetch(url);
		const videos: Video[] = await res.json();
		return { videos };
	} catch (e) {
		throw error(500, {
			message: String(e)
		});
	}
};
