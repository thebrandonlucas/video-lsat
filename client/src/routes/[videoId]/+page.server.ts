import { PUBLIC_API_URL } from '$env/static/public';
import type { PageServerLoad } from './$types';
import { Lsat } from 'lsat-js';
import type { Video } from '../types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const { videoId } = params;
	const url = `${PUBLIC_API_URL}/video/${videoId}`;
	const res = await fetch(url);
	// todo: create api response types so we don't have to keep doing this
	const { video } = (await res.json()) as unknown as { message: string; video: Video };
	const header = res.headers.get('www-authenticate');
	// TODO: handle error states
	const lsat = Lsat.fromHeader(header || '');
	// set macaroon cookies here?
	return { lsat: lsat.toJSON(), video };
};
