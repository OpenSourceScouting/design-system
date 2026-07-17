# research/

Working reference material for this design system. The contents of this
directory are gitignored because they are Scouting America's copyrighted
publications, not ours to redistribute.

To reconstruct it:

1. Download the [Scouting America 2024 Brand Guidelines](https://pathwaytoadventure.org/wp-content/uploads/2024/05/Scouting-America-Brand-Guidelines-2024-BC.pdf)
   and save it as `scouting-america-brand-guidelines-2024.pdf`.
2. Optionally extract the text layer for grep-friendly reference:
   `pdftotext -layout scouting-america-brand-guidelines-2024.pdf brand-text.txt`

Token comments in `src/styles/tokens.css` cite page numbers from that PDF.
`docs/BRAND-GUIDE.md` carries the distilled, shareable version of
the same rules.
