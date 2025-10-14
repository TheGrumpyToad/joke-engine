# 🎭 Jest - Centralized Humor Website

A comprehensive humor website that serves as a centralized comedy platform with multiple humor categories. Features a clean, engaging interface where users can instantly generate roasts, puns, riddles, and joke stories with single clicks.

## ✨ Features

### 🎯 Core Functionality
- **Single HTML File**: Everything contained in one file for easy deployment
- **Offline Capable**: Works completely offline once loaded (with local fallback content)
- **Mobile Responsive**: Optimized for all device sizes
- **Modern UI**: Clean design with smooth animations and gradients
- **Instant Generation**: One-click content generation for all categories
- **User Authentication**: Google Sign-In integration with Firebase
- **User Stats Tracking**: Personal statistics and leaderboard system
- **Clickable User Profiles**: View detailed stats by clicking on user names

### 🎪 Humor Categories

#### 🔥 Roasts
- Playful, witty insults that are funny but not mean-spirited
- Perfect for friendly banter and comedic burns
- Generated content with local fallback database

#### 😄 Puns
- Clever wordplay and groan-worthy jokes
- Creative puns that play on words
- Instant generation with witty humor

#### 🤔 Riddles
- Interactive brain teasers with answer reveals
- Click-to-reveal answer functionality
- Mix of classic and new riddles

#### 📚 Joke Stories
- Longer-form comedy content
- Multi-paragraph funny stories
- Engaging narrative humor

#### 🔞 Adult Humor (18+ Only)
- **Age Verification Required**: Must verify 18+ age
- **Terms Agreement**: Must agree to adult content terms
- **Explicit Content**: Sexual humor, crude jokes, adult themes
- **Persistent Verification**: Remembers verification status

### 🛡️ Safety Features
- **Age Verification System**: Prevents underage access to adult content
- **Terms & Conditions**: Clear agreement for adult content
- **Content Warnings**: Prominent warnings for adult sections
- **Local Storage**: Remembers verification status

### 👥 User Stats & Leaderboard
- **Personal Statistics**: Track your own comedy generation stats
- **User Leaderboard**: View all users ranked by total generations
- **Clickable Profiles**: Click on any user's name to view their detailed stats
- **Category Breakdown**: See individual stats for roasts, puns, riddles, and stories
- **Activity Tracking**: Monitor last active dates and account creation
- **Real-time Updates**: Stats update automatically as you generate content

## 🚀 Quick Start

### Option 1: Localhost Development (Recommended)
```bash
# Navigate to project directory
cd /Users/shanetan/roast-bot

# Start Python HTTP server
python3 -m http.server 3000

# Open browser to: http://localhost:3000
```

### Option 2: Node.js Express Server
```bash
# Install dependencies
npm install

# Start the server
npm start

# Open browser to: http://localhost:3000
```

### Option 3: Direct Use (Local Fallback Only)
1. Download `index.html`
2. Open in any web browser
3. Start generating humor immediately!

### Option 4: With Grok API Integration
1. Get a Grok API key from [Groq](https://console.groq.com/)
2. Open `index.html` in a text editor
3. Replace `YOUR_GROK_API_KEY` with your actual API key
4. Save and open in browser

## 🔧 Setup Instructions

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3.x (for simple HTTP server) OR Node.js (for Express server)
- Optional: Grok API key for dynamic content generation

### Installation Steps

1. **Clone or Download**
   ```bash
   git clone <repository-url>
   cd roast-bot
   ```

2. **Configure Grok API (Optional)**
   - Sign up at [Groq Console](https://console.groq.com/)
   - Generate an API key
   - Open `index.html` in a text editor
   - Find line: `let grokApiKey = 'YOUR_GROK_API_KEY';`
   - Replace with: `let grokApiKey = 'your-actual-api-key';`

3. **Start Localhost Server**
   ```bash
   # Option A: Python HTTP Server
   python3 -m http.server 3000
   
   # Option B: Node.js Express Server
   npm install
   npm start
   ```

4. **Access the Website**
   - Open browser to: http://localhost:3000
   - All humor categories will be available

## 🎨 Customization

### Adding New Content
The app includes local fallback content arrays that you can modify:

```javascript
// Example: Adding new roasts
const roasts = [
    "Your new roast here!",
    // ... existing roasts
];
```

### Styling Modifications
All CSS is contained within the HTML file. Key sections to modify:
- **Colors**: Update gradient backgrounds in CSS
- **Fonts**: Change font-family in body styles
- **Animations**: Modify keyframe animations
- **Layout**: Adjust container and section styles

### API Configuration
To use different AI models or APIs:

```javascript
async function generateWithGrok(prompt) {
    // Modify the API endpoint and parameters
    const response = await fetch('YOUR_API_ENDPOINT', {
        // Update headers and body as needed
    });
}
```

## 📱 Browser Compatibility

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🔒 Privacy & Security

- **No Data Collection**: No user data is stored or transmitted
- **Local Storage Only**: Age verification status stored locally
- **No Tracking**: No analytics or tracking scripts
- **API Optional**: Works fully offline without API calls

## 🛠️ Technical Details

### Architecture
- **Single File**: All HTML, CSS, and JavaScript in one file
- **Progressive Enhancement**: Works without JavaScript (basic functionality)
- **Responsive Design**: CSS Grid and Flexbox for layouts
- **Modern JavaScript**: ES6+ features with async/await

### Performance
- **Fast Loading**: Minimal external dependencies
- **Smooth Animations**: CSS animations for better UX
- **Efficient Code**: Optimized JavaScript for quick execution

### API Integration
- **Grok API**: Uses Groq's API for dynamic content generation
- **Fallback System**: Local content when API unavailable
- **Error Handling**: Graceful degradation on API failures

## 🎯 Usage Examples

### Basic Usage
1. Open the website
2. Click on any humor category
3. Click "Generate" button
4. Enjoy the humor!

### Adult Content Access
1. Click "Adult Humor" button
2. Enter your age (18+)
3. Check the terms agreement
4. Click "Verify Age & Continue"
5. Generate adult humor content

### Mobile Usage
- Touch-friendly interface
- Responsive navigation
- Optimized button sizes
- Smooth scrolling

## 🐛 Troubleshooting

### Common Issues

**Q: Adult content button not showing**
A: You need to verify your age first. Refresh the page and go through age verification.

**Q: Content not generating**
A: Check your internet connection and API key configuration. The app will use local content as fallback.

**Q: Animations not working**
A: Ensure you're using a modern browser with CSS animation support.

**Q: Mobile layout issues**
A: Clear browser cache and ensure you're using the latest version of the file.

### API Issues
- **Rate Limiting**: Grok API has rate limits. Wait a moment and try again.
- **Invalid Key**: Ensure your API key is correct and active.
- **Network Issues**: Check your internet connection.

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Additional humor categories
- More local content
- Enhanced animations
- Better mobile experience
- Additional API integrations

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the code comments
3. Test with different browsers
4. Verify API configuration

## 🎉 Enjoy!

Have fun with your new comedy hub! Remember to use humor responsibly and respect others' boundaries.

---

**Disclaimer**: This website contains adult humor content. Users must be 18+ to access adult sections. The creators are not responsible for how users interpret or use the generated content.
