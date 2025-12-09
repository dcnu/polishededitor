import addresses from '$data/addresses.json';
import type { Pokedex } from '$lib/types';

function writeFlagArray(
	fileHex: string[],
	startAddress: number,
	flags: boolean[],
	numBytes: number
): string[] {
	for (let byteIndex = 0; byteIndex < numBytes; byteIndex++) {
		let byte = 0;
		for (let bit = 0; bit < 8; bit++) {
			const flagIndex = byteIndex * 8 + bit;
			if (flagIndex < flags.length && flags[flagIndex]) {
				byte |= 1 << bit;
			}
		}
		fileHex[startAddress + byteIndex] = byte.toString(16).padStart(2, '0');
	}
	return fileHex;
}

function reverseParsePokedex(
	fileHex: string[],
	pokedex: Pokedex,
	PF: 'polished' | 'faithful'
): string[] {
	const numBytes = addresses.wPokédexFlagBytes;

	fileHex = writeFlagArray(fileHex, addresses.wPokédexCaught, pokedex.caught, numBytes);
	fileHex = writeFlagArray(fileHex, addresses.wPokédexSeen, pokedex.seen, numBytes);

	return fileHex;
}

export default reverseParsePokedex;
