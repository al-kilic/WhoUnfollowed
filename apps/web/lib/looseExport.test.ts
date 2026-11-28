import { describe, expect, it } from 'vitest';
import { isRelationshipFile, looseFromFiles } from './looseExport';

describe('loose export files', () => {
  it('knows the follower and following lists, and nothing else', () => {
    for (const ok of ['followers_1.json', 'following.json', 'x/connections/followers_and_following/followers_2.html', 'Follower.txt', 'Following List.txt', 'followers.json'])
      expect(isRelationshipFile(ok)).toBe(true);
    for (const no of ['posts_1.json', 'following_hashtags.json', 'recently_unfollowed_profiles.json', 'photo.jpg', 'pending_follow_requests.json'])
      expect(isRelationshipFile(no)).toBe(false);
  });

  it('keeps a picked file\'s name as its path', async () => {
    const [f] = looseFromFiles([new File(['[]'], 'followers_1.json')]);
    expect(f!.path).toBe('followers_1.json');
    expect(await f!.text()).toBe('[]');
  });
});
