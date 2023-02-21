function logError (e, s) {
	console.log('Error: ', e, s);
}

/*
class ESError extends Error {
	constructor(message, json) {
		super(message);
		this.jsonMessage = json;
	}
}
*/

export async function request (
	method,
	url,
	{ headers = {}, data, fetch = window && window.fetch, type = 'json' } = {}
) {
	let reqOptions = { method, headers };
	if (data) {
		if (data instanceof FormData) {
			reqOptions.headers["content-type"] = "multipart/form-data";
			reqOptions.body = data;
		} else {
			reqOptions.headers["content-type"] = "application/json";
			reqOptions.body = JSON.stringify(data);
		}
	}
	let response;
	try {
		response = await fetch(url, reqOptions);
		if (Math.floor(response.status / 100) !== 2) {
			throw new Error('API request failed!');
		}
		return response[type]();
	} catch (error) {
		if (response) {
			// FIXME not all HTTP error responses necesarily have a JSON body
			error.jsonMessage = await response.clone().json();
			error.httpStatus = response.status;
			error.httpStatusText = response.statusText;
		}

		logError('request() failure', error, error.stack);
		throw error;
	}
}
