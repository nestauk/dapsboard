export const makeHandlerKeyAdapter = keys => handler => (...args) => event => {
	if (keys.includes(event.key)) {
		event.preventDefault();
		handler(...args);
	}
}

export const makeStandardKeyAdapter = makeHandlerKeyAdapter(['Enter', ' ']);
