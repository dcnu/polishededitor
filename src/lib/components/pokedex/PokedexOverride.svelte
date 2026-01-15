<script lang="ts">
	import { Alert, Button, Checkbox, Heading, P, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
	import pokemon from '$data/pokemon.json';
	import evolutions from '$data/evolutions.json';
	import type { Box, Mon, PartyMon, Pokedex } from '$lib/types';

	type PokemonData = (typeof pokemon)['polished'];
	type PreEvolutionMap = Record<string, string[]>;

	let {
		pokedex = $bindable(),
		party,
		boxes,
		PF
	}: {
		pokedex: Pokedex;
		party: PartyMon[];
		boxes: Box[];
		PF: 'polished' | 'faithful';
	} = $props();

	interface Mismatch {
		preEvoName: string;
		preEvoDexNo: number;
		ownedEvoName: string;
		seen: boolean;
		caught: boolean;
	}

	function reduce(str: string): string {
		return str
			.toLowerCase()
			.replaceAll(' ', '')
			.replaceAll('_', '')
			.replaceAll('-', '')
			.replaceAll("'", '')
			.replaceAll('.', '')
			.replaceAll('♂', 'm')
			.replaceAll('♀', 'f')
			.replaceAll('é', 'e');
	}

	function getOwnedSpecies(): Set<string> {
		const owned = new Set<string>();

		const addMon = (mon: Mon | PartyMon | null) => {
			if (!mon || mon.isEgg) return;
			owned.add(reduce(mon.species));
		};

		for (const mon of party) {
			addMon(mon);
		}

		for (const box of boxes) {
			for (const mon of box.mons) {
				addMon(mon);
			}
		}

		return owned;
	}

	function findMismatches(): Mismatch[] {
		const data = pokemon[PF] as PokemonData;
		const preEvoMap = evolutions[PF].preEvolutions as PreEvolutionMap;
		const owned = getOwnedSpecies();
		const mismatches: Mismatch[] = [];

		// For each owned Pokémon, check if any pre-evolution is seen but not caught
		for (const ownedSpecies of owned) {
			const preEvos = preEvoMap[ownedSpecies];
			if (!preEvos) continue;

			for (const preEvoId of preEvos) {
				// Find the pre-evolution's data
				const preEvoPokemon = data.find((p) => reduce(p.name) === preEvoId);
				if (!preEvoPokemon) continue;

				const dexNo = preEvoPokemon.dexNo;
				if (dexNo <= 0 || dexNo >= pokedex.caught.length) continue;

				const seen = pokedex.seen[dexNo - 1];
				const caught = pokedex.caught[dexNo - 1];

				// Mismatch: seen but not caught, while user owns an evolution
				if (seen && !caught) {
					// Find the display name of the owned evolution
					const ownedPokemon = data.find((p) => reduce(p.name) === ownedSpecies);
					mismatches.push({
						preEvoName: preEvoPokemon.name,
						preEvoDexNo: dexNo,
						ownedEvoName: ownedPokemon?.name ?? ownedSpecies,
						seen,
						caught
					});
				}
			}
		}

		// Sort by dex number
		mismatches.sort((a, b) => a.preEvoDexNo - b.preEvoDexNo);

		// Deduplicate by pre-evo dex number (same pre-evo might appear for multiple owned evolutions)
		const seen = new Set<number>();
		return mismatches.filter((m) => {
			if (seen.has(m.preEvoDexNo)) return false;
			seen.add(m.preEvoDexNo);
			return true;
		});
	}

	let mismatches = $derived(findMismatches());
	let selectedOverrides = $state<Set<number>>(new Set());

	function toggleOverride(dexNo: number) {
		const newSet = new Set(selectedOverrides);
		if (newSet.has(dexNo)) {
			newSet.delete(dexNo);
		} else {
			newSet.add(dexNo);
		}
		selectedOverrides = newSet;
	}

	function applyOverrides() {
		const newCaught = [...pokedex.caught];
		for (const dexNo of selectedOverrides) {
			newCaught[dexNo - 1] = true;
		}
		pokedex = { ...pokedex, caught: newCaught };
		selectedOverrides = new Set();
	}

	function selectAll() {
		selectedOverrides = new Set(mismatches.map((m) => m.preEvoDexNo));
	}

	function selectNone() {
		selectedOverrides = new Set();
	}
</script>

<div class="space-y-4">
	<Heading tag="h3">Evolution Override</Heading>
	<P class="text-gray-600 dark:text-gray-400">
		The following Pokémon are marked as "seen" but not "caught" in your Pokédex, even though you own a later evolution. Check the ones you'd like to mark as "caught".
	</P>

	{#if mismatches.length === 0}
		<Alert color="green">
			No mismatches found. All pre-evolutions of your owned Pokémon are properly marked as caught.
		</Alert>
	{:else}
		<div class="flex gap-2 mb-3">
			<Button size="xs" outline onclick={selectAll}>Select All</Button>
			<Button size="xs" outline onclick={selectNone}>Select None</Button>
			<Button size="xs" color="green" disabled={selectedOverrides.size === 0} onclick={applyOverrides}>
				Apply ({selectedOverrides.size})
			</Button>
		</div>

		<Table striped>
			<TableHead>
				<TableHeadCell class="w-12"></TableHeadCell>
				<TableHeadCell>Dex #</TableHeadCell>
				<TableHeadCell>Pre-Evolution</TableHeadCell>
				<TableHeadCell>You Own</TableHeadCell>
				<TableHeadCell>Status</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each mismatches as mismatch}
					<TableBodyRow>
						<TableBodyCell>
							<Checkbox
								checked={selectedOverrides.has(mismatch.preEvoDexNo)}
								onchange={() => toggleOverride(mismatch.preEvoDexNo)}
							/>
						</TableBodyCell>
						<TableBodyCell>#{mismatch.preEvoDexNo.toString().padStart(3, '0')}</TableBodyCell>
						<TableBodyCell class="font-medium">{mismatch.preEvoName}</TableBodyCell>
						<TableBodyCell>{mismatch.ownedEvoName}</TableBodyCell>
						<TableBodyCell>
							<span class="text-yellow-600 dark:text-yellow-400">Seen only</span>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	{/if}
</div>
