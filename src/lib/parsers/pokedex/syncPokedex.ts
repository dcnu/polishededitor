import pokemon from '$data/pokemon.json';
import type { Box, Mon, PartyMon, Pokedex } from '$lib/types';

type PokemonData = (typeof pokemon)['polished'];

function getDexNumber(species: string, PF: 'polished' | 'faithful'): number {
	const data = pokemon[PF] as PokemonData;
	const found = data.find((p) => p.name === species);
	return found?.dexNo ?? 0;
}

function syncPokedex(
	pokedex: Pokedex,
	party: PartyMon[],
	boxes: Box[],
	PF: 'polished' | 'faithful'
): Pokedex {
	const caught = [...pokedex.caught];
	const seen = [...pokedex.seen];

	const setFlags = (mon: Mon | PartyMon | null) => {
		if (!mon || mon.isEgg) return;

		const dexNo = getDexNumber(mon.species, PF);
		if (dexNo > 0 && dexNo < caught.length) {
			caught[dexNo - 1] = true;
			seen[dexNo - 1] = true;
		}
	};

	// Process party
	for (const mon of party) {
		setFlags(mon);
	}

	// Process boxes
	for (const box of boxes) {
		for (const mon of box.mons) {
			setFlags(mon);
		}
	}

	return { caught, seen };
}

export default syncPokedex;
