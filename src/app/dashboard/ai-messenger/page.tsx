"use client";

import {
  Bot,
  Code,
  Copy,
  FileText,
  Lightbulb,
  RotateCcw,
  Send,
  Settings,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  User,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
  isTyping?: boolean;
}

const suggestedPrompts = [
  "Help me write a professional email",
  "Explain this code snippet",
  "Generate a project proposal",
  "Create a meeting agenda",
  "Write a technical documentation",
  "Analyze this data and provide insights",
];

const mockAIResponse = (userMessage: string): string => {
  const responses = {
    "help me write":
      "I'd be happy to help you write a professional email! Here's a structured approach:\n\n1. **Subject Line**: Keep it clear and concise\n2. **Greeting**: Use appropriate salutation\n3. **Body**: State your purpose clearly\n4. **Closing**: Professional sign-off\n\nWould you like me to draft a specific email for you?",
    "explain this code":
      "I can help explain code snippets! Please share the code you'd like me to analyze, and I'll break it down step by step, explaining:\n\n- What each part does\n- How it works\n- Potential improvements\n- Best practices\n\nPaste your code and I'll provide a detailed explanation.",
    "generate a project":
      "I'll help you create a comprehensive project proposal! Here's what I'll include:\n\n**Project Proposal Structure:**\n1. Executive Summary\n2. Project Objectives\n3. Scope and Deliverables\n4. Timeline and Milestones\n5. Budget and Resources\n6. Risk Assessment\n7. Success Metrics\n\nWhat type of project are you proposing?",
    "create a meeting":
      "I'll help you create an effective meeting agenda! Here's a template:\n\n**Meeting Agenda Template:**\n- Meeting Title and Date\n- Attendees\n- Objectives\n- Agenda Items with Time Allocations\n- Action Items\n- Next Steps\n\nWhat's the meeting about and who will be attending?",
    "write a technical":
      "I'll help you write comprehensive technical documentation! Here's the structure:\n\n**Technical Documentation Structure:**\n1. Overview and Introduction\n2. System Architecture\n3. Installation Guide\n4. API Documentation\n5. Configuration\n6. Troubleshooting\n7. Examples and Use Cases\n\nWhat system or technology are you documenting?",
    "analyze this data":
      "I'll help you analyze data and provide insights! Here's my approach:\n\n**Data Analysis Framework:**\n1. Data Overview and Quality Assessment\n2. Descriptive Statistics\n3. Trend Analysis\n4. Pattern Recognition\n5. Key Insights and Findings\n6. Recommendations\n7. Visualizations\n\nPlease share your dataset or describe what data you'd like me to analyze.",
  };

  const lowerMessage = userMessage.toLowerCase();
  for (const [key, response] of Object.entries(responses)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }

  return (
    "I understand you're asking about: \"" +
    userMessage +
    "\"\n\nI'm here to help! I can assist with:\n- Writing and editing content\n- Code explanation and debugging\n- Data analysis and insights\n- Project planning and documentation\n- Creative writing and brainstorming\n- Technical problem-solving\n\nHow can I assist you further?"
  );
};

export default function AIMessengerPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI assistant. I can help you with writing, coding, analysis, and much more. What would you like to work on today?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: mockAIResponse(inputMessage),
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInputMessage(prompt);
  };

  const _copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex h-[calc(100vh-45px)] bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                AI Assistant
              </h1>
              <p className="text-sm text-gray-500">Powered by GPT-4</p>
            </div>
          </div>

          <Button variant="outline" size="sm" className="w-full">
            <RotateCcw className="h-4 w-4 mr-2" />
            New Conversation
          </Button>
        </div>

        {/* Suggested Prompts */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Suggested Prompts
          </h3>
          <div className="space-y-2">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSuggestedPrompt(prompt)}
                className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Capabilities
          </h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span>Creative Writing</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Code className="h-4 w-4 text-green-500" />
              <span>Code Analysis</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FileText className="h-4 w-4 text-blue-500" />
              <span>Documentation</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Lightbulb className="h-4 w-4 text-orange-500" />
              <span>Problem Solving</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  AI Assistant
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-500">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((message) => (
            <div key={message.id} className="flex space-x-3">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback
                  className={
                    message.isUser
                      ? "bg-gray-500"
                      : "bg-gradient-to-br from-blue-500 to-purple-600"
                  }
                >
                  {message.isUser ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {message.isUser ? "You" : "AI Assistant"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {message.timestamp}
                  </span>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {message.text}
                  </p>
                </div>
                {!message.isUser && (
                  <div className="flex items-center space-x-2 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      Good
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                    >
                      <ThumbsDown className="h-3 w-3 mr-1" />
                      Bad
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex space-x-3">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600">
                  <Bot className="h-4 w-4 text-white" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    AI Assistant
                  </span>
                  <span className="text-xs text-gray-500">typing...</span>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="min-h-[44px] resize-none"
                disabled={isTyping}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="h-11 px-4"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            AI can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  );
}
