import {get} from 'svelte/store';

import {
	_credentials,
	_isAuthModalOpen
} from '$lib/app/stores/auth.js';
import {request} from '$lib/utils/net.js';

const authBaseURL = 'https://api.dap-tools.uk/auth';

const getTokenRequestEndpointURL = email =>
	`${authBaseURL}/request?email=${email}`;
const getTokenVerifyEndpointURL = (email, token) =>
	`${authBaseURL}/authenticate?email=${email}&token=${token}`;

export const authedRequest = async (
	method,
	url,
	options = {}
) => {
	const headers = {...options.headers};

	const credentials = get(_credentials);
	if (credentials?.token) {
		const {email, token} = credentials;
		headers.Authorization = `Basic ${btoa(`${email}:${token}`)}`;
	}
	let response;
	try {
		response = await request(
			method,
			url,
			{
				...options,
				headers
			}
		);
	} catch (error) {
		if (error.httpStatus === 401 || error.httpStatus === 403) {
			_credentials.set(null);
			_isAuthModalOpen.set(true);
		}
		throw error;
	}
	return response;
}

export const requestNestaToken = async email => {
	const endpoint = getTokenRequestEndpointURL(email);
	const response = await fetch(endpoint);

	const result = {};
	if (response.status !== 204) {
		result.error = await response.text();
	}

	return result;
}

export const verifyNestaToken = async (email, token) => {
	const endpoint = getTokenVerifyEndpointURL(email, token);
	const response = await fetch(endpoint);
	const result = await response.text();

	return JSON.parse(result);
}
