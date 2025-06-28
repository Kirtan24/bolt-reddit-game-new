import { Devvit, Post } from '@devvit/public-api';

// Side effect import to bundle the server. The /index is required for server splitting.
import '../server/index';
import { defineConfig } from '@devvit/server';
import { postConfigNew } from '../server/core/post';

defineConfig({
  name: '[Bolt] Chain Reaction',
  entry: 'index.html',
  height: 'tall',
  menu: { enable: false },
});

export const Preview: Devvit.BlockComponent<{ text?: string }> = ({ text = 'Loading...' }) => {
  return (
    <zstack width={'100%'} height={'100%'} alignment="center middle">
      <vstack width={'100%'} height={'100%'} alignment="center middle" backgroundColor="#1a1a2e">
        <image
          url="loading.gif"
          description="Loading Chain Reaction..."
          height={'140px'}
          width={'140px'}
          imageHeight={'240px'}
          imageWidth={'240px'}
        />
        <spacer size="medium" />
        <text
          maxWidth={`90%`}
          size="xxlarge"
          weight="bold"
          alignment="center middle"
          wrap
          color="#ffffff"
        >
          Chain Reaction
        </text>
        <spacer size="small" />
        <text maxWidth={`80%`} size="large" alignment="center middle" wrap color="#cccccc">
          Strategic orb placement game - trigger chain reactions to win!
        </text>
        <spacer size="medium" />
        <hstack gap="medium">
          <text size="medium" color="#4ecdc4">
            🔵 You
          </text>
          <text size="medium" color="#ffffff">
            VS
          </text>
          <text size="medium" color="#ff6b6b">
            🔴 AI
          </text>
        </hstack>
        <spacer size="small" />
        <text size="small" color="#888888">
          Built with Bolt x Devvit
        </text>
      </vstack>
    </zstack>
  );
};

// Menu item for creating new posts
Devvit.addMenuItem({
  label: '[Bolt Chain Reaction]: New Game',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;

    let post: Post | undefined;
    try {
      const subreddit = await reddit.getCurrentSubreddit();
      post = await reddit.submitPost({
        title: '🎮 Chain Reaction - Strategic Orb Game',
        subredditName: subreddit.name,
        preview: <Preview />,
      });
      await postConfigNew({
        redis: context.redis,
        postId: post.id,
      });
      ui.showToast({ text: 'Chain Reaction game created!' });
      ui.navigateTo(post.url);
    } catch (error) {
      if (post) {
        await post.remove(false);
      }
      if (error instanceof Error) {
        ui.showToast({ text: `Error creating game: ${error.message}` });
      } else {
        ui.showToast({ text: 'Error creating game!' });
      }
    }
  },
});

export default Devvit;