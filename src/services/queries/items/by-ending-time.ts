import { client } from '$services/redis';
import { itemsKey, itemsByEndingAtKey } from '$services/keys';
import { deserialize } from './deserialize';

export const itemsByEndingTime = async (
	order: 'DESC' | 'ASC' = 'DESC',
	offset = 0,
	count = 10
) => {
	const ids = await client.zRange(itemsByEndingAtKey(), Date.now(), '+inf', {
		BY: 'SCORE',
		LIMIT: {
			offset,
			count,
		},
	});
	const x = await client.hGetAll('items#dc6975');
	console.log(x);
	const results = await Promise.all(
		ids.map(id => client.hGetAll(itemsKey(id)))
	);
	console.log(results);

	return results.map((item, i) => deserialize(ids[i], item));
};
