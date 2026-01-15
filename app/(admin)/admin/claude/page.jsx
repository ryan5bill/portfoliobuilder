'use client';

import { useState, useRef, useEffect } from 'react';

const SYSTEM_PROMPT = `You are an AI assistant for Portfolio Builder (pbtracker.app), helping the admin manage their investment portfolio tracking platform.

Context about the platform:
- Two model portfolios: HRGP (High-Risk Growth) and SFGP (Safe Growth)
- HRGP: Concentrated AI/Crypto positions, started Dec 2020, aggressive growth strategy
- SFGP: Diversified leveraged ETFs, started Dec 2018, steady growth strategy
- Users can follow these portfolios, use a calculator to match allocations, and track their own trades
- Trade alerts are sent via email (Beehiiv) and SMS (Twilio)
- Built with Next.js, Supabase, and Tailwind CSS

You can help with:
- Writing trade alert messages
- Composing broadcast emails/SMS
- Portfolio analysis and suggestions
- Technical questions about the platform
- Content creation for subscribers
- Market analysis and commentary

Be concise and helpful. Format responses clearly.`;

export default function ClaudeAssistantPage() {
  const [apiKey, setApiKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const savedKey = localStorage.getItem('claude_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setIsConfigured(true);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSetApiKey = () => {
    if (apiKey.startsWith('sk-ant-')) {
      localStorage.setItem('claude_api_key', apiKey);
      setIsConfigured(true);
      setError('');
    } else {
      setError('Invalid API key format. Should start with sk-ant-');
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem('claude_api_key');
    setApiKey('');
    setIsConfigured(false);
    setMessages([]);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2048,
          system: SYSTEM_PROMPT,
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'API request failed');
      }

      const data = await response.json();
      const assistantMessage = {
        role: 'assistant',
        content: data.content[0].text
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedPrompts = [
    "Write a trade alert for buying NVDA",
    "Draft a weekly recap email for subscribers",
    "Explain the HRGP strategy in simple terms",
    "Create an SMS alert for a portfolio rebalance",
    "Help me analyze this month's returns"
  ];

  if (!isConfigured) {
    return (
      <div className="p-8">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pb-green to-pb-orange flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🤖</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Claude AI Assistant</h1>
            <p className="text-pb-text-muted">Get help managing your portfolio platform</p>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="font-semibold">Connect to Claude</h3>
            </div>
            <div className="card-body">
              <p className="text-sm text-pb-text-muted mb-4">
                Enter your Anthropic API key to enable the AI assistant. Your key is stored locally in your browser.
              </p>
              <div className="mb-4">
                <label className="block text-xs text-pb-text-dim mb-1">API Key</label>
                <input
                  type="password"
                  className="input font-mono"
                  placeholder="sk-ant-api03-..."
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                />
              </div>
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}
              <button onClick={handleSetApiKey} className="btn btn-primary w-full">
                Connect
              </button>
              <p className="text-xs text-pb-text-dim mt-4 text-center">
                Get your API key at{' '}
                <a href="https://console.anthropic.com" target="_blank" className="text-pb-green hover:underline">
                  console.anthropic.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 h-[calc(100vh-2rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pb-green to-pb-orange flex items-center justify-center">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">Claude Assistant</h1>
            <p className="text-xs text-pb-text-dim">AI-powered help for your platform</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-2 py-1 rounded text-xs bg-pb-green/20 text-pb-green">Connected</span>
          <button onClick={handleClearKey} className="btn btn-secondary text-sm">
            Disconnect
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 card overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="text-4xl mb-4">👋</div>
              <h3 className="font-semibold mb-2">How can I help you today?</h3>
              <p className="text-sm text-pb-text-muted mb-6 max-w-md">
                I can help you write trade alerts, compose broadcasts, analyze portfolios, and more.
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                {suggestedPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(prompt)}
                    className="px-3 py-2 bg-pb-bg-elevated border border-pb-border rounded-lg text-sm text-pb-text-muted hover:text-white hover:border-pb-border-light transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-xl ${
                    msg.role === 'user'
                      ? 'bg-pb-green/20 text-white'
                      : 'bg-pb-bg-elevated text-pb-text'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-pb-bg-elevated p-4 rounded-xl">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-pb-text-dim rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-pb-text-dim rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-pb-text-dim rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              Error: {error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-pb-border">
          <div className="flex gap-3">
            <textarea
              className="input flex-1 resize-none"
              rows={2}
              placeholder="Ask anything about your portfolio platform..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="btn btn-primary self-end"
            >
              Send
            </button>
          </div>
          <div className="text-xs text-pb-text-dim mt-2">
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
}
