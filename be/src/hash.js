import crypto from 'crypto';


export const hash = input => {
	const hashFunction = crypto.createHash('md5');
	return hashFunction.update(input).digest('hex');
};
