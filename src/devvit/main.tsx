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
      {/* Animated Background */}
      <vstack width={'100%'} height={'100%'} alignment="center middle" backgroundColor="#0a0a1a">
        {/* Gradient Overlay */}
        <zstack width={'100%'} height={'100%'} alignment="center middle">
          <vstack 
            width={'100%'} 
            height={'100%'} 
            alignment="center middle" 
            backgroundColor="rgba(26, 26, 46, 0.95)"
          />
          
          {/* Main Content */}
          <vstack alignment="center middle" gap="large" maxWidth="90%">
            {/* Game Logo/Title Section */}
            <vstack alignment="center middle" gap="medium">
              {/* Animated Orbs Display */}
              <hstack gap="small" alignment="center middle">
                <text size="xxlarge" color="#4ecdc4">●</text>
                <text size="large" color="#ff6b6b">●●</text>
                <text size="medium" color="#4ecdc4">●</text>
                <text size="xxlarge" color="#ff6b6b">●●●</text>
                <text size="large" color="#4ecdc4">●●</text>
              </hstack>
              
              <text
                size="xxlarge"
                weight="bold"
                alignment="center"
                color="#ffffff"
                wrap
              >
                ⚡ CHAIN REACTION ⚡
              </text>
              
              <text
                size="large"
                alignment="center"
                color="#ffd700"
                wrap
              >
                Strategic Orb Warfare
              </text>
            </vstack>

            {/* Game Description */}
            <vstack alignment="center middle" gap="small" maxWidth="85%">
              <text
                size="medium"
                alignment="center"
                color="#cccccc"
                wrap
              >
                🎯 Place orbs strategically on the grid
              </text>
              <text
                size="medium"
                alignment="center"
                color="#cccccc"
                wrap
              >
                💥 Trigger explosive chain reactions
              </text>
              <text
                size="medium"
                alignment="center"
                color="#cccccc"
                wrap
              >
                🏆 Dominate the battlefield against AI
              </text>
            </vstack>

            {/* Player vs AI Section */}
            <vstack alignment="center middle" gap="medium">
              <text size="large" color="#ffffff" weight="bold">BATTLE ARENA</text>
              
              <hstack gap="large" alignment="center middle">
                {/* Player Side */}
                <vstack alignment="center middle" gap="small">
                  <text size="xxlarge" color="#4ecdc4">🔵</text>
                  <text size="medium" color="#4ecdc4" weight="bold">YOU</text>
                  <text size="small" color="#cccccc">Strategic</text>
                </vstack>
                
                {/* VS */}
                <vstack alignment="center middle" gap="small">
                  <text size="large" color="#ffd700" weight="bold">⚔️</text>
                  <text size="medium" color="#ffffff" weight="bold">VS</text>
                </vstack>
                
                {/* AI Side */}
                <vstack alignment="center middle" gap="small">
                  <text size="xxlarge" color="#ff6b6b">🔴</text>
                  <text size="medium" color="#ff6b6b" weight="bold">AI</text>
                  <text size="small" color="#cccccc">Tactical</text>
                </vstack>
              </hstack>
            </vstack>

            {/* Game Features */}
            <vstack alignment="center middle" gap="small">
              <hstack gap="medium" alignment="center middle">
                <text size="small" color="#4ecdc4">🎮 Real-time Strategy</text>
                <text size="small" color="#ff6b6b">🧠 Smart AI Opponent</text>
              </hstack>
              <hstack gap="medium" alignment="center middle">
                <text size="small" color="#ffd700">⚡ Chain Explosions</text>
                <text size="small" color="#9b59b6">🎯 Tactical Gameplay</text>
              </hstack>
            </vstack>

            {/* Call to Action */}
            <vstack alignment="center middle" gap="small">
              <text
                size="large"
                weight="bold"
                alignment="center"
                color="#ffd700"
                wrap
              >
                🚀 Ready for Battle? 🚀
              </text>
              
              <text
                size="medium"
                alignment="center"
                color="#ffffff"
                wrap
              >
                Click "Launch App" to start your strategic conquest!
              </text>
            </vstack>

            {/* Game Stats Preview */}
            <hstack gap="large" alignment="center middle">
              <vstack alignment="center middle" gap="xsmall">
                <text size="medium" color="#4ecdc4" weight="bold">5×5</text>
                <text size="small" color="#cccccc">Grid</text>
              </vstack>
              
              <vstack alignment="center middle" gap="xsmall">
                <text size="medium" color="#ff6b6b" weight="bold">∞</text>
                <text size="small" color="#cccccc">Strategies</text>
              </vstack>
              
              <vstack alignment="center middle" gap="xsmall">
                <text size="medium" color="#ffd700" weight="bold">⚡</text>
                <text size="small" color="#cccccc">Fast-Paced</text>
              </vstack>
            </hstack>

            {/* Bottom Hint */}
            <text
              size="small"
              alignment="center"
              color="#888888"
              wrap
            >
              💡 Tip: Corner cells are safer but harder to expand from!
            </text>
          </vstack>
        </zstack>
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