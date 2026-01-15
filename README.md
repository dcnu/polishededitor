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

## Fork Modifications

Changes from [upstream](https://github.com/KohKaiSern/polishededitor):

- Pokédex evolution override (mark evolutions as caught/seen)
- Pokédex sync on save

## Usage

1. Select your game variant (Polished or Faithful)
2. Upload your `.sav` or `.srm` battery save file (not emulator save states)
3. Edit your save data using the Party, PC Boxes, Bag, or Player tabs
4. Download the edited save
5. Replace your original save file (backup first)

## Development

```sh
pnpm install
pnpm dev
pnpm build
pnpm extract  # regenerate game data from polishedcrystal/ submodule
```

## Credits

[KohKaiSern](https://github.com/KohKaiSern/polishededitor) (original), Rev3lation, Sylvie (Rangi42), Cammy, Emi, FIQ, Darsh

## License

See [LICENSE.md](LICENSE.md)
