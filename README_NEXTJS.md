# 🎭 Comedy Hub - Next.js Edition

A modern, responsive comedy website built with Next.js 14, Tailwind CSS, and Framer Motion. Features a sleek landing page and AI-powered humor generation across multiple categories.

## ✨ Features

### 🎯 Modern Tech Stack
- **Next.js 14** - Latest React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **TypeScript** - Type-safe development
- **Lucide React** - Beautiful icon library

### 🎪 Comedy Categories
- **🔥 Roasts** - Playful burns and witty insults
- **😄 Puns** - Clever wordplay and groan-worthy jokes
- **🤔 Riddles** - Interactive brain teasers with answer reveals
- **📚 Joke Stories** - Longer-form comedy narratives
- **🔞 Adult Humor** - Explicit content (18+ only)

### 🎨 Modern Design
- **Glassmorphism UI** - Modern glass-like design elements
- **Gradient Backgrounds** - Beautiful color transitions
- **Smooth Animations** - Framer Motion powered transitions
- **Responsive Design** - Works perfectly on all devices
- **Dark Theme** - Easy on the eyes

### 🛡️ Safety Features
- **Age Verification** - Required for adult content
- **Terms Agreement** - Clear consent for explicit content
- **Content Warnings** - Prominent warnings for adult sections
- **Local Storage** - Remembers verification status

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd roast-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Landing Page
- **Hero Section** - Eye-catching introduction with call-to-action
- **Feature Cards** - Visual representation of each comedy category
- **Stats Section** - Quick overview of what the site offers
- **Smooth Animations** - Engaging user experience

### Comedy Generator
- **Category Navigation** - Easy switching between humor types
- **One-Click Generation** - Instant content generation
- **Interactive Elements** - Answer reveals for riddles
- **Loading States** - Smooth loading animations

### Adult Content Access
1. Click "Adult Humor (18+)" on landing page
2. Enter your age (must be 18+)
3. Agree to terms and conditions
4. Access adult humor content

## 🔧 Configuration

### Grok API Integration
To enable AI-powered content generation:

1. **Get API Key**
   - Sign up at [Groq Console](https://console.groq.com/)
   - Create a new API key
   - Copy your API key

2. **Configure Environment**
   - Copy `env.example` to `.env.local`:
     ```bash
     cp env.example .env.local
     ```
   - Edit `.env.local` and add your API key:
     ```env
     GROQ_API_KEY=your_actual_api_key_here
     ```

3. **Restart Development Server**
   ```bash
   npm run dev
   ```

4. **Test API Integration**
   - Generate content in any category
   - Check browser console for API status
   - Fallback content will be used if API fails

### Customization

#### Adding New Content
Edit the content arrays in `ComedyGenerator.tsx`:
```typescript
const contentMap = {
  roasts: [
    "Your new roast here!",
    // ... existing roasts
  ],
  // ... other categories
}
```

#### Styling Changes
Modify `tailwind.config.js` for custom colors and animations:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      }
    }
  }
}
```

#### Adding New Categories
1. Add category to `categories` array in `ComedyGenerator.tsx`
2. Add content to `contentMap`
3. Update navigation and icons

## 📱 Responsive Design

The website is fully responsive and optimized for:
- **Desktop** - Full feature experience
- **Tablet** - Adapted layout and navigation
- **Mobile** - Touch-friendly interface
- **All Screen Sizes** - Fluid design that works everywhere

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (`from-primary-500 to-secondary-500`)
- **Secondary**: Purple gradient (`from-secondary-500 to-primary-500`)
- **Accent**: Red for warnings and adult content
- **Background**: Dark gradient with glassmorphism

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, large sizes
- **Body**: Clean, readable text
- **Hierarchy**: Clear visual hierarchy

### Components
- **Buttons**: Gradient backgrounds with hover effects
- **Cards**: Glassmorphism with backdrop blur
- **Modals**: Centered with backdrop blur
- **Navigation**: Clean, minimal design

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect to Vercel
3. Deploy automatically

### Netlify
1. Build the project: `npm run build`
2. Deploy the `out` folder

### Other Platforms
- **Railway** - Easy deployment
- **Heroku** - Traditional hosting
- **AWS** - Enterprise hosting

## 🛠️ Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Project Structure
```
├── app/
│   ├── components/          # React components
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── public/                 # Static assets
├── tailwind.config.js      # Tailwind configuration
├── next.config.js          # Next.js configuration
└── package.json            # Dependencies
```

## 🐛 Troubleshooting

### Common Issues

**Q: Build errors with TypeScript**
A: Ensure all components have proper TypeScript types

**Q: Tailwind styles not applying**
A: Check `tailwind.config.js` and ensure proper file paths

**Q: Framer Motion animations not working**
A: Verify `framer-motion` is installed and imported correctly

**Q: Icons not displaying**
A: Check `lucide-react` installation and imports

**Q: API not working / getting fallback content**
A: 
- Check if `.env.local` exists and has correct API key
- Verify API key is valid at [Groq Console](https://console.groq.com/)
- Check browser console for error messages
- Ensure you've restarted the development server after adding API key

**Q: Rate limiting errors**
A: Groq API has rate limits. Wait a moment and try again, or upgrade your plan

**Q: Content not generating**
A: 
- Check internet connection
- Verify API key is not expired
- Check browser console for detailed error messages
- Fallback content will be used if API fails

### Performance Issues
- Use `next/image` for optimized images
- Implement code splitting for large components
- Optimize animations for better performance

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Additional humor categories
- More sophisticated AI integration
- Enhanced animations
- Better mobile experience
- Additional language support

## 📄 License

This project is open source and available under the MIT License.

## 🎉 Enjoy!

Have fun with your modern comedy hub! The sleek design and smooth animations make it a joy to use.

---

**Note**: This is a modern rewrite of the original comedy website using Next.js and Tailwind CSS for a better developer and user experience.
