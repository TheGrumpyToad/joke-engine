# Comedy Hub - Localhost Setup

## 🚀 Quick Start (Multiple Options)

### Option 1: Python HTTP Server (Simplest)
```bash
# Navigate to the project directory
cd /Users/shanetan/roast-bot

# Start Python HTTP server
python3 -m http.server 3000

# Open browser to: http://localhost:3000
```

### Option 2: Node.js Express Server (Recommended)
```bash
# Install dependencies
npm install

# Start the server
npm start

# Open browser to: http://localhost:3000
```

### Option 3: Development Mode (Auto-restart)
```bash
# Install dependencies
npm install

# Start in development mode
npm run dev

# Open browser to: http://localhost:3000
```

## 🎯 What You'll See

Once running on localhost, you'll have access to:

### 🎪 Comedy Categories
- **🔥 Roasts** - Playful burns and witty insults
- **😄 Puns** - Clever wordplay and groan-worthy jokes
- **🤔 Riddles** - Interactive brain teasers with answer reveals
- **📚 Joke Stories** - Longer-form comedy narratives
- **🔞 Adult Humor** - Explicit content (18+ only)

### 🛡️ Features
- **Age Verification** - Required for adult content
- **Terms Agreement** - Must agree to adult content terms
- **Local Content** - Works offline with built-in humor database
- **Grok API Ready** - Configure API key for dynamic content
- **Mobile Responsive** - Works on all devices

## 🔧 Configuration

### Grok API Setup (Optional)
1. Get API key from [Groq Console](https://console.groq.com/)
2. Open `index.html` in text editor
3. Replace `YOUR_GROK_API_KEY` with your actual key
4. Restart server

### Customization
- **Add Content**: Modify the content arrays in `index.html`
- **Change Styling**: Update CSS within the HTML file
- **Add Categories**: Create new sections following existing patterns

## 📱 Access Points

- **Main Site**: http://localhost:3000
- **API Health**: http://localhost:3000/api/health
- **Direct File**: http://localhost:3000/index.html

## 🛠️ Troubleshooting

### Port Already in Use
```bash
# Use different port
python3 -m http.server 3001
# or
PORT=3001 npm start
```

### Node.js Issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Python Issues
```bash
# Try different Python version
python -m http.server 3000
# or
python2 -m SimpleHTTPServer 3000
```

## 🎉 Enjoy Your Comedy Hub!

The website is now running locally and ready to use. All humor categories are available with instant generation and smooth animations.
