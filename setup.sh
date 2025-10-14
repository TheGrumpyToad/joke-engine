#!/bin/bash

# Comedy Hub Setup Script
echo "🎭 Setting up Comedy Hub..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create environment file if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "🔧 Creating environment file..."
    cat > .env.local << EOF
# Groq API Configuration
# Get your API key from: https://console.groq.com/
GROQ_API_KEY=your_groq_api_key_here

# Optional: API endpoint (defaults to Groq's endpoint)
GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions

# Optional: Model to use (defaults to llama-3.1-70b-versatile)
GROQ_MODEL=llama-3.1-70b-versatile

# Next.js Configuration
NEXT_PUBLIC_APP_NAME=Comedy Hub
NEXT_PUBLIC_APP_VERSION=1.0.0
EOF
    echo "✅ Created .env.local file"
else
    echo "✅ .env.local file already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Get a Groq API key from: https://console.groq.com/"
echo "2. Edit .env.local and add your API key"
echo "3. Run: npm run dev"
echo "4. Open: http://localhost:3000"
echo ""
echo "Happy coding! 🎭"
