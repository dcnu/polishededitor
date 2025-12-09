import addresses from '$data/addresses.json';
import type { Pokedex } from '$lib/types';

function parseFlagArray(fileHex: string[], startAddress: number, numBytes: number): boolean[] {
	const flags: boolean[] = [];
	for (let byteIndex = 0; byteIndex < numBytes; byteIndex++) {
		const byte = parseInt(fileHex[startAddress + byteIndex], 16);
		for (let bit = 0; bit < 8; bit++) {
			flags.push((byte & (1 << bit)) !== 0);
		}
	}
	return flags;
}

function parsePokedex(fileHex: string[], PF: 'polished' | 'faithful'): Pokedex {
	const numBytes = addresses.wPokedexFlagBytes;

	const caught = parseFlagArray(fileHex, addresses.wPokedexCaught, numBytes);
	const seen = parseFlagArray(fileHex, addresses.wPokedexSeen, numBytes);

	return { caught, seen };
}

export default parsePokedex;
