import { buf2hex } from '$lib/utils';
import type { BagSlot, Box, PartyMon, Player, Pokedex } from '$lib/types';
import parseBag from './bag/forward/parseBag';
import parseBoxes from './boxes/forward/parseBoxes';
import parseParty from './party/forward/parseParty';
import parsePlayer from './player/forward/parsePlayer';
import parsePokedex from './pokedex/forward/parsePokedex';

async function parseSave(
	file: File,
	PF: 'polished' | 'faithful'
): Promise<[PartyMon[], Box[], Record<string, BagSlot>, Player, Pokedex]> {
	const fileHex = await buf2hex(file);
	const party: PartyMon[] = parseParty(fileHex, PF);
	const boxes: Box[] = parseBoxes(fileHex, PF);
	const bag: Record<string, BagSlot> = parseBag(fileHex, PF);
	const player: Player = parsePlayer(fileHex, PF);
	const pokedex: Pokedex = parsePokedex(fileHex, PF);
	return [party, boxes, bag, player, pokedex];
}

export default parseSave;
