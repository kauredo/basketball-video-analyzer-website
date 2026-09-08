export interface Guide {
  href: string;
  label: string;
  /** One line, condensed from that page's own lede and headings. */
  blurb: string;
}

// Single source of truth for the guide pages, used by both the Footer nav and
// the RelatedGuides cross-links so labels and the list can't drift.
export const guides: Guide[] = [
  { href: '/film-breakdown', label: 'How to break down game film', blurb: 'Three passes through a game: load it, mark the plays, export the folders.' },
  { href: '/for-coaches', label: 'Film review for coaches', blurb: 'A weekly rhythm that fits in one sitting.' },
  { href: '/scouting', label: 'Scouting opponents from film', blurb: "Read a team's tendencies off their own tape, across more than one game." },
  { href: '/free-alternative', label: 'A free alternative to Hudl', blurb: "What Hudl does that this doesn't, and what this does." },
  { href: '/vs-inbound-studio', label: 'Compared with Inbound Studio', blurb: 'The closest comparison here. Both run locally; one is €14.99 a month.' },
  { href: '/hudl-alternatives', label: 'Hudl alternatives for basketball', blurb: 'Five tools compared, including doing it by hand in VLC.' },
];
