// Test fixtures only (made-up numbers in the real export's shape).
// Fixtures follow the real export's shape (checked Nov 2026); every number is made up.
export const cell = (value: string, timestamp = 0) => ({ href: '', value, timestamp });
export const post = (ts: number, o: Record<string, string>) => ({ title: '', media_map_data: { 'Media Thumbnail': { uri: 'media/other/1.jpg', title: 'caption @someone' } }, string_map_data: { 'Creation Timestamp': cell('', ts), ...Object.fromEntries(Object.entries(o).map(([k, v]) => [k, cell(v)])) } });
export const reel = (ts: number, o: Record<string, string>) => ({ title: '', media_map_data: {}, string_map_data: { Caption: cell('hi @someone'), 'Upload Timestamp': cell('', ts), ...Object.fromEntries(Object.entries(o).map(([k, v]) => [k, cell(v)])) } });
export const story = (ts: number, o: Record<string, string>) => ({ title: '', media_map_data: {}, string_map_data: { 'Creation Timestamp': cell('', ts), ...Object.fromEntries(Object.entries(o).map(([k, v]) => [k, cell(v)])) } });

export const AUDIENCE = { organic_insights_audience: [{ title: '', media_map_data: {}, string_map_data: {
  'Date Range': cell('Aug 21 - Nov 18'), Followers: cell('1,500'), 'Followers Delta': cell('+2.5% vs May 23 - Aug 20'),
  Follows: cell('200'), Unfollows: cell('150'),
  'Follower Percentage by City': cell('Lisbon: 9%, New York: 2.4%, São Paulo: 1.5%, Porto: 1.1%'),
  'Follower Percentage by Country': cell('Portugal: 30.5%, United States: 12%, Brazil: 8%, Spain: 4%'),
  'Follower Percentage by Age for All Genders': cell('13-17: 1.9%, 18-24: 19.4%, 25-34: 54.7%, 35-44: 15.7%, 65+: 0.6%'),
  'Total Follower Percentage for Men': cell('48.2%'), 'Total Follower Percentage for Women': cell('51.8%'),
  'Monday Follower Activity': cell('1,000'), 'Tuesday Follower Activity': cell('1,000'), 'Wednesday Follower Activity': cell('1,000'),
  'Thursday Follower Activity': cell('1,000'), 'Friday Follower Activity': cell('1,000'), 'Saturday Follower Activity': cell('1,300'), 'Sunday Follower Activity': cell('700'),
} }] };
export const REACH = { organic_insights_reach: [{ title: '', media_map_data: {}, string_map_data: {
  'Date Range': cell('Aug 21 - Nov 18'), 'Accounts Reached': cell('12000'), 'Accounts Reached Delta': cell('-12.5% vs May 23 - Aug 20'),
  Followers: cell('91.5%'), 'Non-Followers': cell('8.5%'), Impressions: cell('80,000'), 'Profile visits': cell('2,000'), 'External link taps': cell('5'), 'External link taps delta': cell('--'),
} }] };
export const INTERACTIONS = { organic_insights_interactions: [{ title: '', media_map_data: {}, string_map_data: {
  'Date Range': cell('Aug 21 - Nov 18'), 'Content Interactions': cell('3,000'), 'Content Interactions Delta': cell('-20% vs May 23 - Aug 20'),
  'Post Interactions': cell('1,000'), 'Story Interactions': cell('1,900'), 'Reels Interactions': cell('100'),
  'Accounts engaged': cell('400'), 'Engaged Account By Follow Type': cell('Followers: 95.2%, Non-followers: 4.8%'),
} }] };

