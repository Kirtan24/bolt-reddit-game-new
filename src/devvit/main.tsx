import { Devvit, Post } from '@devvit/public-api';

// Side effect import to bundle the server. The /index is required for server splitting.
import '../server/index';
import { defineConfig } from '@devvit/server';
import { postConfigNew } from '../server/core/post';

defineConfig({
  name: '[Bolt] Chain Reaction - Silly Sh!t Challenge',
  entry: 'index.html',
  height: 'tall',
  menu: { enable: false },
});

export const Preview: Devvit.BlockComponent<{ text?: string }> = ({ text = 'Loading...' }) => {
  return (
    <zstack width={'100%'} height={'100%'} alignment="center middle">
      <vstack width={'100%'} height={'100%'} alignment="center middle" backgroundColor="#1a1a2e">
        {/* Animated orbs background */}
        <hstack gap="medium" alignment="center middle">
          <text size="xxlarge">💥</text>
          <text size="xxlarge">⚡</text>
          <text size="xxlarge">🔥</text>
        </hstack>
        
        <spacer size="medium" />
        
        <text
          maxWidth={`90%`}
          size="xxlarge"
          weight="bold"
          alignment="center middle"
          wrap
          color="#ffd700"
        >
          ⚡ CHAIN REACTION ⚡
        </text>
        
        <spacer size="small" />
        
        <text maxWidth={`85%`} size="large" alignment="center middle" wrap color="#ff6b6b">
          🎮 SILLY SH!T CHALLENGE ENTRY 🎮
        </text>
        
        <spacer size="small" />
        
        <text maxWidth={`80%`} size="medium" alignment="center middle" wrap color="#cccccc">
          The most ridiculously fun orb explosion game ever! Battle AI, trigger epic chain reactions, embrace total chaos!
        </text>
        
        <spacer size="medium" />
        
        <hstack gap="large" alignment="center middle">
          <vstack alignment="center middle" gap="small">
            <text size="large" color="#4ecdc4">🔵</text>
            <text size="small" color="#4ecdc4" weight="bold">YOU</text>
          </vstack>
          
          <text size="large" color="#ffffff" weight="bold">VS</text>
          
          <vstack alignment="center middle" gap="small">
            <text size="large" color="#ff6b6b">🔴</text>
            <text size="small" color="#ff6b6b" weight="bold">EVIL AI</text>
          </vstack>
        </hstack>
        
        <spacer size="medium" />
        
        <vstack alignment="center middle" gap="small">
          <text size="small" color="#feca57">🏆 Built for Reddit's Hackathon 🏆</text>
          <text size="xsmall" color="#888888">Powered by Bolt x Devvit</text>
        </vstack>
        
        <spacer size="small" />
        
        <text size="small" color="#96ceb4" alignment="center middle">
          💡 Tap to enter the chaos! 💡
        </text>
      </vstack>
    </zstack>
  );
};

// Menu item for creating new posts
Devvit.addMenuItem({
  label: '[Bolt Chain Reaction]: New Chaos Game 🎮',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;

    let post: Post | undefined;
    try {
      const subreddit = await reddit.getCurrentSubreddit();
      post = await reddit.submitPost({
        title: '⚡ Chain Reaction - Epic Orb Explosion Game! 🎮 [Silly Sh!t Challenge]',
        subredditName: subreddit.name,
        preview: <Preview />,
      });
      await postConfigNew({
        redis: context.redis,
        postId: post.id,
      });
      ui.showToast({ text: '🎮 Chain Reaction chaos unleashed! 💥' });
      ui.navigateTo(post.url);
    } catch (error) {
      if (post) {
        await post.remove(false);
      }
      if (error instanceof Error) {
        ui.showToast({ text: `💥 Error creating chaos: ${error.message}` });
      } else {
        ui.showToast({ text: '💥 Error unleashing the chaos!' });
      }
    }
  },
});

export default Devvit;