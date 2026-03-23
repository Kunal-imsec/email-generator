# 🤖 AI Email Generator

A modern, intelligent email generator powered by Next.js and Anthropic's Claude API. Create professional emails in seconds with AI-powered assistance.

## ✨ Features

- 🎯 **Smart Email Generation** - AI-powered email creation for various purposes
- 🎨 **Multiple Tones** - Formal, Friendly, Persuasive, Casual, and Assertive styles
- 📝 **7 Email Types** - Cold Outreach, Follow-up, Apology, Job Application, Networking, Thank You, Sales Pitch
- ⚡ **Real-time Generation** - Instant email creation with loading states
- 📋 **Email History** - Automatically saves your last 5 generated emails
- 📋 **Copy & Edit** - Easy clipboard copying and inline editing
- 🌙 **Dark Mode** - Beautiful dark theme support
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 🛡️ **Rate Limiting** - Built-in protection against API abuse

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Anthropic API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kunal-imsec/GenAI-Preparation.git
   cd email-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Add your Anthropic API key to `.env.local`:
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Generating Emails

1. **Fill in the form:**
   - Recipient Name & Role
   - Email Purpose (select from dropdown)
   - Your Name
   - Key Points (bullet points)
   - Tone (button selector)
   - Email Length

2. **Click "Generate Email"** - AI creates your email instantly

3. **Use the output:**
   - Copy to clipboard
   - Edit inline
   - Regenerate with same inputs
   - View in email history

### Email Types

- **Cold Outreach** - Professional introduction emails
- **Follow-up** - Conversation continuation
- **Apology** - Sincere apology messages
- **Job Application** - Career opportunity emails
- **Networking** - Professional connection requests
- **Thank You** - Gratitude expressions
- **Sales Pitch** - Business proposals

### Tone Options

- **Formal** - Professional, structured language
- **Friendly** - Casual, conversational
- **Persuasive** - Convincing, influential
- **Casual** - Relaxed, informal
- **Assertive** - Confident, direct

## 🛠️ Technology Stack

- **Frontend:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **AI:** Anthropic Claude API
- **Validation:** Zod
- **State Management:** React Hooks

## 📁 Project Structure

```
email-generator/
├── app/
│   ├── page.tsx              # Main UI page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   └── api/
│       └── generate/
│           └── route.ts      # API endpoint
├── components/
│   ├── EmailForm.tsx         # Input form
│   ├── EmailOutput.tsx       # Email display
│   └── ToneSelector.tsx      # Tone selector
├── lib/
│   └── prompt.ts             # Prompt engineering
├── types/
│   └── index.ts              # TypeScript types
└── public/
```

## 🔧 Configuration

### Environment Variables

```env
ANTHROPIC_API_KEY=your_api_key_here
USE_MOCK_API=true  # Optional: Enable mock mode for testing
```

### Mock Mode

Enable mock mode to test the application without using API credits:

```env
USE_MOCK_API=true
```

This generates realistic email templates without calling the Claude API.

## 🎨 Features Deep Dive

### Prompt Engineering

The app uses sophisticated prompt engineering with:
- **System prompts** for consistent email quality
- **Few-shot examples** for style guidance
- **Dynamic prompts** based on user inputs
- **XML parsing** for structured output

### Rate Limiting

Built-in protection against API abuse:
- **10 requests per minute** per IP address
- **Graceful error handling**
- **User-friendly error messages**

### Email History

- **Automatic storage** in localStorage
- **Last 5 emails** preserved
- **One-click restore** functionality
- **Timestamp tracking**

## 🌟 Highlights

- **Zero Dependencies UI** - Pure Tailwind CSS, no component libraries
- **Type Safety** - Full TypeScript coverage
- **Accessibility** - Semantic HTML and ARIA support
- **Performance** - Optimized for speed and efficiency
- **Security** - Input validation and API key protection

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Anthropic](https://anthropic.com/) for the Claude API
- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the beautiful styling
- [Vercel](https://vercel.com/) for deployment platform

## 📞 Support

If you have any questions or need help, feel free to open an issue on GitHub.

---

**Made with ❤️ using Next.js and Claude AI**
