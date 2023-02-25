import type { CreateItemAttrs } from '$services/types';
import { client } from '$services/redis';
import { serialize } from './serialize';
import { genId } from '$services/utils';
import { itemsKey } from '$services/keys';
import { deserialize } from './deserialize';

export const getItem = async (id: string) => {
	const item = await client.hGetAll(itemsKey(id));

	if (Object.keys(item).length === 0) {
		return null;
	}

	return deserialize(id, item);
};

export const getItems = async (ids: string[]) => {
	const commands = ids.map(id => {
		return client.hGetAll(itemsKey(id));
	});

	// pipeline
	const results = await Promise.all(commands);

	return results.map((result, i) => {
		if (Object.keys(result).length === 0) {
			return null;
		}
		return deserialize(ids[i], result);
	});
};

export const createItem = async (attrs: CreateItemAttrs) => {
	const id = genId();

	const serialized = serialize(attrs);

	await client.hSet(itemsKey(id), serialized);

	return id;
};