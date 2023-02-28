import { createClient } from 'redis';
import { createIndexes } from './create-indexes';

const client = createClient({
	socket: {
		host: process.env.REDIS_HOST,
		port: parseInt(process.env.REDIS_PORT),
	},
	password: process.env.REDIS_PW,
});

client.on('error', err => console.error(err));
client.connect();

client.on('connect', async () => {
	try {
		await createIndexes();
	} catch (err) {
		console.error(err);
	}
});

export { client };
