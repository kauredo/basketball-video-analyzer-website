export interface Guide {
  href: string;
  label: string;
}

// Single source of truth for the guide pages — used by both the Footer nav and
// the RelatedGuides cross-links so labels and the list can't drift.
export const guides: Guide[] = [
  { href: '/film-breakdown', label: 'How to break down game film' },
  { href: '/for-coaches', label: 'Film review for coaches' },
  { href: '/scouting', label: 'Scouting opponents from film' },
  { href: '/free-alternative', label: 'A free alternative to Hudl' },
];
