# Polished Editor

A web-based save editor for [Polished Crystal](https://github.com/Rangi42/polishedcrystal), a ROM hack of Pokemon Crystal.

## Features

- Edit party Pokemon (species, stats, moves, held items)
- Manage PC box storage
- Modify bag contents and items
- Edit player data
- Support for both Polished Crystal and Faithful Crystal variants
- Auto-updates by scraping game data files
- Dark mode support

## Usage

1. Select your game variant (Polished or Faithful)
2. Upload your `.sav` or `.srm` battery save file (not emulator save states)
3. Edit your save data using the Party, PC Boxes, Bag, or Player tabs
4. Download the edited save
5. Replace your original save file (backup first)

## Tech Stack

- SvelteKit 5 with TypeScript
- Tailwind CSS 4
- Flowbite Svelte components
- Vercel deployment

## Development

```sh
pnpm install
pnpm dev
```

## Building

```sh
pnpm build
pnpm preview
```

## Data Extraction

The editor extracts game data from the `polishedcrystal/` submodule:

```sh
pnpm extract
```

This parses ASM files and generates JSON data in `src/data/`.

## Credits

Rev3lation, Sylvie (Rangi42), Cammy, Emi, FIQ, Darsh

## License

See [LICENSE.md](LICENSE.md)
