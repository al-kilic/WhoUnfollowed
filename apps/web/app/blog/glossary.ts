// Shared term definitions shown on pillar posts, as both a readable glossary
// section and a schema.org DefinedTermSet for AI-answer-engine citation.
export interface GlossaryTerm {
  term: string;
  definition: string;
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Non-follower',
    definition: 'An account you follow that does not follow you back. Found from a single Instagram data export, no history required.',
  },
  {
    term: 'Unfollower',
    definition: 'An account that followed you at some point and later stopped. Finding one requires comparing two data exports taken at different times.',
  },
  {
    term: 'Ghost follower',
    definition: 'An account that still follows you but shows little to no sign of activity, commonly an abandoned profile or a bot from a past follow-for-follow campaign. Approximated using follow-tenure and reciprocity, since Instagram does not label accounts as inactive.',
  },
  {
    term: 'Follow ratio',
    definition: 'Your follower count divided by the number of accounts you follow. Used as a rough signal of audience genuineness, not a ranking factor Instagram publishes directly.',
  },
  {
    term: 'Instagram data export',
    definition: "A ZIP file Instagram is required to provide under GDPR Article 20, containing a user's own account data, including complete followers and following lists with timestamps.",
  },
  {
    term: 'Snapshot',
    definition: 'A single parsed Instagram data export, saved with the date it was taken so it can be compared against a later export.',
  },
];
