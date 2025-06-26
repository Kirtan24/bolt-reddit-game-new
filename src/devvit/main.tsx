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
      {/* Game-themed Background */}
      <vstack width={'100%'} height={'100%'} alignment="center middle">
        {/* Gradient Background */}
        <zstack width={'100%'} height={'100%'} alignment="center middle">
          <vstack 
            width={'100%'} 
            height={'100%'} 
            alignment="center middle" 
            backgroundColor="#0a0a1a"
          />
          
          {/* Animated Grid Pattern Overlay */}
          <vstack 
            width={'100%'} 
            height={'100%'} 
            alignment="center middle" 
            backgroundColor="rgba(26, 26, 46, 0.95)"
          />
          
          {/* Main Game Preview Content */}
          <vstack alignment="center middle" gap="large" maxWidth="95%" padding="large">
            
            {/* Game Logo Section */}
            <vstack alignment="center middle" gap="medium">
              {/* Animated Orb Grid Preview */}
              <vstack gap="xsmall" alignment="center middle">
                <hstack gap="xsmall" alignment="center middle">
                  <text size="large" color="#4ecdc4">●</text>
                  <text size="medium" color="#ff6b6b">●●</text>
                  <text size="small" color="#4ecdc4">●</text>
                  <text size="large" color="#ff6b6b">●●●</text>
                  <text size="medium" color="#4ecdc4">●●</text>
                </hstack>
                <hstack gap="xsmall" alignment="center middle">
                  <text size="medium" color="#ff6b6b">●●</text>
                  <text size="large" color="#ffd700">💥</text>
                  <text size="small" color="#4ecdc4">●</text>
                  <text size="medium" color="#ff6b6b">●●</text>
                  <text size="large" color="#4ecdc4">●</text>
                </hstack>
                <hstack gap="xsmall" alignment="center middle">
                  <text size="small" color="#4ecdc4">●</text>
                  <text size="medium" color="#ff6b6b">●●</text>
                  <text size="large" color="#4ecdc4">●●●</text>
                  <text size="small" color="#ff6b6b">●</text>
                  <text size="medium" color="#4ecdc4">●●</text>
                </hstack>
              </vstack>
              
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
                Strategic Orb Explosion Game
              </text>
            </vstack>

            {/* Game Modes Preview */}
            <vstack alignment="center middle" gap="medium">
              <text size="large" color="#ffffff" weight="bold">🎮 GAME MODES</text>
              
              <hstack gap="medium" alignment="center middle" wrap>
                {/* Easy Mode */}
                <vstack alignment="center middle" gap="small" backgroundColor="rgba(76, 175, 80, 0.2)" padding="medium" cornerRadius="medium" borderColor="#4CAF50" borderWidth="thin">
                  <text size="large" color="#4CAF50">😊</text>
                  <text size="medium" color="#4CAF50" weight="bold">EASY</text>
                  <text size="small" color="#cccccc">All cells: 4 orbs</text>
                </vstack>
                
                {/* Medium Mode */}
                <vstack alignment="center middle" gap="small" backgroundColor="rgba(255, 152, 0, 0.2)" padding="medium" cornerRadius="medium" borderColor="#FF9800" borderWidth="thin">
                  <text size="large" color="#FF9800">😐</text>
                  <text size="medium" color="#FF9800" weight="bold">MEDIUM</text>
                  <text size="small" color="#cccccc">Variable thresholds</text>
                </vstack>
                
                {/* Hard Mode */}
                <vstack alignment="center middle" gap="small" backgroundColor="rgba(244, 67, 54, 0.2)" padding="medium" cornerRadius="medium" borderColor="#F44336" borderWidth="thin">
                  <text size="large" color="#F44336">😤</text>
                  <text size="medium" color="#F44336" weight="bold">HARD</text>
                  <text size="small" color="#cccccc">Random + obstacles</text>
                </vstack>
              </hstack>
            </vstack>

            {/* How to Play Section */}
            <vstack alignment="center middle" gap="small" backgroundColor="rgba(255, 255, 255, 0.05)" padding="medium" cornerRadius="medium">
              <text size="medium" color="#ffd700" weight="bold">🎯 HOW TO PLAY</text>
              <vstack alignment="center middle" gap="xsmall">
                <text size="small" color="#cccccc" alignment="center">
                  1️⃣ Place orbs strategically on the grid
                </text>
                <text size="small" color="#cccccc" alignment="center">
                  2️⃣ When cells reach their threshold, they explode!
                </text>
                <text size="small" color="#cccccc" alignment="center">
                  3️⃣ Chain reactions spread to neighboring cells
                </text>
                <text size="small" color="#cccccc" alignment="center">
                  4️⃣ Eliminate all enemy orbs to win!
                </text>
              </vstack>
            </vstack>

            {/* Player vs AI Battle */}
            <vstack alignment="center middle" gap="medium">
              <text size="medium" color="#ffffff" weight="bold">⚔️ BATTLE ARENA</text>
              
              <hstack gap="large" alignment="center middle">
                {/* Player Side */}
                <vstack alignment="center middle" gap="small">
                  <text size="xxlarge" color="#4ecdc4">🔵</text>
                  <text size="medium" color="#4ecdc4" weight="bold">YOU</text>
                  <text size="small" color="#cccccc">Strategic Mind</text>
                </vstack>
                
                {/* VS with explosion */}
                <vstack alignment="center middle" gap="small">
                  <text size="xxlarge" color="#ffd700">💥</text>
                  <text size="medium" color="#ffffff" weight="bold">VS</text>
                  <text size="small" color="#ffd700">EXPLOSIVE!</text>
                </vstack>
                
                {/* AI Side */}
                <vstack alignment="center middle" gap="small">
                  <text size="xxlarge" color="#ff6b6b">🔴</text>
                  <text size="medium" color="#ff6b6b" weight="bold">AI</text>
                  <text size="small" color="#cccccc">Tactical Brain</text>
                </vstack>
              </hstack>
            </vstack>

            {/* Game Features Grid */}
            <vstack alignment="center middle" gap="small">
              <hstack gap="medium" alignment="center middle" wrap>
                <text size="small" color="#4ecdc4">🎮 Real-time Strategy</text>
                <text size="small" color="#ff6b6b">🧠 Smart AI</text>
              </hstack>
              <hstack gap="medium" alignment="center middle" wrap>
                <text size="small" color="#ffd700">⚡ Chain Explosions</text>
                <text size="small" color="#9b59b6">🎯 Multiple Modes</text>
              </hstack>
              <hstack gap="medium" alignment="center middle" wrap>
                <text size="small" color="#e74c3c">🚫 Obstacles (Hard)</text>
                <text size="small" color="#2ecc71">🎲 Random Thresholds</text>
              </hstack>
            </vstack>

            {/* Call to Action */}
            <vstack alignment="center middle" gap="medium" backgroundColor="rgba(255, 215, 0, 0.1)" padding="large" cornerRadius="large" borderColor="#ffd700" borderWidth="thin">
              <text
                size="large"
                weight="bold"
                alignment="center"
                color="#ffd700"
                wrap
              >
                🚀 READY FOR EXPLOSIVE ACTION? 🚀
              </text>
              
              <text
                size="medium"
                alignment="center"
                color="#ffffff"
                wrap
              >
                Click "Launch App" to start your strategic conquest!
              </text>
              
              <text
                size="small"
                alignment="center"
                color="#cccccc"
                wrap
              >
                Choose your difficulty and dominate the battlefield!
              </text>
            </vstack>

            {/* Game Stats */}
            <hstack gap="large" alignment="center middle">
              <vstack alignment="center middle" gap="xsmall">
                <text size="medium" color="#4ecdc4" weight="bold">5×5</text>
                <text size="small" color="#cccccc">Grid</text>
              </vstack>
              
              <vstack alignment="center middle" gap="xsmall">
                <text size="medium" color="#ff6b6b" weight="bold">3</text>
                <text size="small" color="#cccccc">Modes</text>
              </vstack>
              
              <vstack alignment="center middle" gap="xsmall">
                <text size="medium" color="#ffd700" weight="bold">∞</text>
                <text size="small" color="#cccccc">Strategies</text>
              </vstack>
              
              <vstack alignment="center middle" gap="xsmall">
                <text size="medium" color="#9b59b6" weight="bold">⚡</text>
                <text size="small" color="#cccccc">Fast-Paced</text>
              </vstack>
            </hstack>

            {/* Pro Tip */}
            <text
              size="small"
              alignment="center"
              color="#888888"
              wrap
            >
              💡 Pro Tip: Watch the threshold numbers in cell corners - they show explosion points!
            </text>
          </vstack>
        </zstack>
      </vstack>
    </zstack>
  );
};

// Menu item for creating new posts
Devvit.addMenuItem({
  label: '[Bolt Chain Reaction]: New Explosive Game',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;

    let post: Post | undefined;
    try {
      const subreddit = await reddit.getCurrentSubreddit();
      post = await reddit.submitPost({
        title: '💥 Chain Reaction - Strategic Orb Explosion Game | 3 Difficulty Modes',
        subredditName: subreddit.name,
        preview: <Preview />,
      });
      await postConfigNew({
        redis: context.redis,
        postId: post.id,
      });
      ui.showToast({ text: '💥 Chain Reaction game created! Ready for explosive action!' });
      ui.navigateTo(post.url);
    } catch (error) {
      if (post) {
        await post.remove(false);
      }
      if (error instanceof Error) {
        ui.showToast({ text: `Error creating game: ${error.message}` });
      } else {
        ui.showToast({ text: 'Error creating explosive game!' });
      }
    }
  },
});

export default Devvit;