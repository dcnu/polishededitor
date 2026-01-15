import { reduce, splitRead } from './utils';

interface Evolution {
	from: string;
	to: string;
}

interface EvolutionChains {
	// Maps species name to array of pre-evolution names (all forms, lowest to highest)
	preEvolutions: Record<string, string[]>;
}

function extractEvolutions(lines: string[]): EvolutionChains {
	const evolutions: Evolution[] = [];
	let currentMon = '';

	for (const line of lines) {
		// Match evos_attacks declarations
		const evosMatch = line.match(/evos_attacks\s+(\w+)/);
		if (evosMatch) {
			currentMon = evosMatch[1];
			continue;
		}

		// Match evo_data lines: evo_data EVOLVE_TYPE, PARAM, EVOLVED_SPECIES[, FORM]
		const evoMatch = line.match(/evo_data\s+\w+,\s*\w+,\s*(\w+)/);
		if (evoMatch && currentMon) {
			const evolvedTo = evoMatch[1];
			evolutions.push({
				from: currentMon,
				to: evolvedTo
			});
		}
	}

	// Build reverse lookup: for each species, what are all its pre-evolutions?
	const preEvolutions: Record<string, string[]> = {};

	// Normalize species names for matching
	const normalizedEvolutions = evolutions.map((e) => ({
		from: reduce(e.from),
		to: reduce(e.to)
	}));

	// For each evolution, trace the full chain
	function getPreEvolutions(species: string, visited: Set<string> = new Set()): string[] {
		if (visited.has(species)) return [];
		visited.add(species);

		const preEvos: string[] = [];
		for (const evo of normalizedEvolutions) {
			if (evo.to === species) {
				preEvos.push(evo.from);
				// Recursively get pre-evolutions of the pre-evolution
				preEvos.push(...getPreEvolutions(evo.from, visited));
			}
		}
		return preEvos;
	}

	// Build the complete chains for all species that have evolutions
	const allSpecies = new Set([
		...normalizedEvolutions.map((e) => e.from),
		...normalizedEvolutions.map((e) => e.to)
	]);

	for (const species of allSpecies) {
		const preEvos = getPreEvolutions(species);
		if (preEvos.length > 0) {
			// Deduplicate and sort by chain order (furthest pre-evolution first)
			preEvolutions[species] = [...new Set(preEvos)].reverse();
		}
	}

	return { preEvolutions };
}

const LEVEL_MOVES = splitRead('data/pokemon/evos_attacks.asm');

const evolutions = {
	polished: extractEvolutions(LEVEL_MOVES.polished),
	faithful: extractEvolutions(LEVEL_MOVES.faithful)
};

export default evolutions;
