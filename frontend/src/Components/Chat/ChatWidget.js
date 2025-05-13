import React, { useState, useRef, useEffect } from 'react';
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import './ChatWidget.css';

function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Add a welcome message when the chat first opens
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                role: 'assistant',
                content: 'Hi there! I\'m the SkillHive Assistant. How can I help you find learning resources today?'
            }]);
        }
    }, [isOpen, messages.length]);

    // Improved response generator with actual links
    const getResourceResponse = (userQuery) => {
        const query = userQuery.toLowerCase();
        let topic = '';
        
        // Extract the topic from user query
        if (query.includes('learn')) {
            topic = query.split('learn')[1].trim();
            // Remove any "how to", "about", etc.
            topic = topic.replace(/^(how to|about|to|i want to|can you help me|with)/i, '').trim();
            // Remove trailing punctuation
            topic = topic.replace(/[?.!]$/, '').trim();
        } else {
            // Try to extract based on common patterns
            const words = query.split(' ');
            topic = words[words.length - 1].replace(/[?.!]$/, '').trim();
        }
        
        if (!topic) topic = "your requested subject";

        // Create response with actual links depending on topic
        const resources = getResourcesByTopic(topic);
        
        return `Here are some resources to help you learn ${topic}:

**Beginner Level Resources:**
1. **${resources.beginner[0].title}**
   - ${resources.beginner[0].description}
   - [${resources.beginner[0].linkText}](${resources.beginner[0].url})

2. **${resources.beginner[1].title}**
   - ${resources.beginner[1].description}
   - [${resources.beginner[1].linkText}](${resources.beginner[1].url})

3. **${resources.beginner[2].title}**
   - ${resources.beginner[2].description}
   - [${resources.beginner[2].linkText}](${resources.beginner[2].url})

**Intermediate Level Resources:**
1. **${resources.intermediate[0].title}**
   - ${resources.intermediate[0].description}
   - [${resources.intermediate[0].linkText}](${resources.intermediate[0].url})

2. **${resources.intermediate[1].title}**
   - ${resources.intermediate[1].description}
   - [${resources.intermediate[1].linkText}](${resources.intermediate[1].url})

**Advanced Level Resources:**
1. **${resources.advanced[0].title}**
   - ${resources.advanced[0].description}
   - [${resources.advanced[0].linkText}](${resources.advanced[0].url})

2. **${resources.advanced[1].title}**
   - ${resources.advanced[1].description}
   - [${resources.advanced[1].linkText}](${resources.advanced[1].url})

**Community Resources:**
- [Stack Overflow ${topic} Questions](https://stackoverflow.com/questions/tagged/${topic.replace(/\s+/g, '-')})
- [Reddit r/${topic.replace(/\s+/g, '')}](https://www.reddit.com/r/${topic.replace(/\s+/g, '')})

Need more specific resources? Feel free to ask!`;
    };

    // This function returns category-specific resources based on the topic
    const getResourcesByTopic = (topic) => {
        // Normalize topic for mapping
        const normalizedTopic = topic.toLowerCase().trim();
        
        // Define topic-specific resource mappings
        const topicMappings = {
            'javascript': {
                beginner: [
                    {
                        title: "JavaScript Fundamentals",
                        description: "Free interactive course covering all the basics",
                        linkText: "MDN JavaScript Guide",
                        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide"
                    },
                    {
                        title: "JavaScript for Beginners",
                        description: "Step-by-step introduction to JavaScript programming",
                        linkText: "freeCodeCamp JavaScript Course",
                        url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/"
                    },
                    {
                        title: "JavaScript Video Tutorials",
                        description: "Visual learning with hands-on examples",
                        linkText: "Traversy Media JavaScript Crash Course",
                        url: "https://www.youtube.com/watch?v=hdI2bqOjy3c"
                    }
                ],
                intermediate: [
                    {
                        title: "JavaScript Projects",
                        description: "Build real-world applications with JavaScript",
                        linkText: "JavaScript30 - 30 Day Challenge",
                        url: "https://javascript30.com/"
                    },
                    {
                        title: "Modern JavaScript Features",
                        description: "Learn ES6+ features and modern patterns",
                        linkText: "JavaScript.info Modern JS Tutorial",
                        url: "https://javascript.info/"
                    }
                ],
                advanced: [
                    {
                        title: "Advanced JavaScript Concepts",
                        description: "Deep dive into closures, prototypes, and asynchronous JS",
                        linkText: "You Don't Know JS Book Series",
                        url: "https://github.com/getify/You-Dont-Know-JS"
                    },
                    {
                        title: "JavaScript Design Patterns",
                        description: "Learn professional patterns and best practices",
                        linkText: "JavaScript Design Patterns",
                        url: "https://www.patterns.dev/posts/classic-design-patterns/"
                    }
                ]
            },
            'python': {
                beginner: [
                    {
                        title: "Python Basics",
                        description: "Official Python tutorial for beginners",
                        linkText: "Python.org Tutorial",
                        url: "https://docs.python.org/3/tutorial/"
                    },
                    {
                        title: "Python Crash Course",
                        description: "Recommended book for beginners with practical projects",
                        linkText: "Python Crash Course on Amazon",
                        url: "https://www.amazon.com/Python-Crash-Course-2nd-Edition/dp/1593279280/"
                    },
                    {
                        title: "Python Video Course",
                        description: "Free comprehensive video series",
                        linkText: "Corey Schafer's Python Tutorials",
                        url: "https://www.youtube.com/playlist?list=PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU"
                    }
                ],
                intermediate: [
                    {
                        title: "Python Projects",
                        description: "Practice with real-world Python applications",
                        linkText: "Real Python Project Tutorials",
                        url: "https://realpython.com/tutorials/projects/"
                    },
                    {
                        title: "Automate the Boring Stuff",
                        description: "Learn practical Python automation",
                        linkText: "Automate the Boring Stuff with Python",
                        url: "https://automatetheboringstuff.com/"
                    }
                ],
                advanced: [
                    {
                        title: "Advanced Python Features",
                        description: "Mastering decorators, generators, and metaclasses",
                        linkText: "Fluent Python Book",
                        url: "https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/"
                    },
                    {
                        title: "Python Design Patterns",
                        description: "Object-oriented designs and architectural patterns",
                        linkText: "Python Design Patterns Guide",
                        url: "https://python-patterns.guide/"
                    }
                ]
            },
            'react': {
                beginner: [
                    {
                        title: "React Fundamentals",
                        description: "Official tutorial from React team",
                        linkText: "React Official Documentation",
                        url: "https://reactjs.org/tutorial/tutorial.html"
                    },
                    {
                        title: "React for Beginners",
                        description: "Step-by-step introduction to components and hooks",
                        linkText: "freeCodeCamp React Course",
                        url: "https://www.freecodecamp.org/learn/front-end-development-libraries/#react"
                    },
                    {
                        title: "React Video Tutorials",
                        description: "Visual learning with practical examples",
                        linkText: "Net Ninja React Series",
                        url: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9gZD-Tvwfod2gaISzfRiP9d"
                    }
                ],
                intermediate: [
                    {
                        title: "React Projects",
                        description: "Build real-world applications with React",
                        linkText: "ReactJS Examples Repository",
                        url: "https://github.com/topics/react-examples"
                    },
                    {
                        title: "React Hooks",
                        description: "Master React's hook system",
                        linkText: "React Hooks Documentation",
                        url: "https://reactjs.org/docs/hooks-intro.html"
                    }
                ],
                advanced: [
                    {
                        title: "Advanced React Patterns",
                        description: "Learn professional component patterns",
                        linkText: "Advanced React Patterns",
                        url: "https://kentcdodds.com/blog/advanced-react-patterns"
                    },
                    {
                        title: "React Performance",
                        description: "Optimize React applications for speed",
                        linkText: "React Performance Guide",
                        url: "https://reactjs.org/docs/optimizing-performance.html"
                    }
                ]
            }
        };
        
        // Default resources for topics not explicitly defined
        const defaultResources = {
            beginner: [
                {
                    title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Fundamentals`,
                    description: "Interactive online course covering the basics",
                    linkText: "Coursera Courses",
                    url: `https://www.coursera.org/search?query=${encodeURIComponent(topic)}`
                },
                {
                    title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} for Beginners`,
                    description: "Comprehensive guide for newcomers",
                    linkText: "Udemy Courses",
                    url: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(topic)}`
                },
                {
                    title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Video Tutorials`,
                    description: "Free video lessons for beginners",
                    linkText: "YouTube Tutorials",
                    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic)}+tutorial+for+beginners`
                }
            ],
            intermediate: [
                {
                    title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Practice Projects`,
                    description: "Apply your knowledge with hands-on projects",
                    linkText: "GitHub Projects",
                    url: `https://github.com/search?q=${encodeURIComponent(topic)}+projects`
                },
                {
                    title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Community Resources`,
                    description: "Connect with others learning the same topic",
                    linkText: "Discord Communities",
                    url: `https://disboard.org/servers/tag/${encodeURIComponent(topic)}`
                }
            ],
            advanced: [
                {
                    title: `Advanced ${topic.charAt(0).toUpperCase() + topic.slice(1)}`,
                    description: "Expert-level techniques and methodologies",
                    linkText: "Advanced Courses",
                    url: `https://www.edx.org/search?q=${encodeURIComponent(topic)}`
                },
                {
                    title: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Certification`,
                    description: "Professional credentials in this field",
                    linkText: "Certification Programs",
                    url: `https://www.google.com/search?q=${encodeURIComponent(topic)}+professional+certification`
                }
            ]
        };
        
        // Return topic-specific resources if available, otherwise default
        return topicMappings[normalizedTopic] || defaultResources;
    };

    const formatMessageContent = (content) => {
        // Process markdown-style links [text](url)
        const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        let lastIndex = 0;
        const elements = [];
        let match;
        
        while ((match = markdownLinkRegex.exec(content)) !== null) {
            const [fullMatch, text, url] = match;
            const beforeText = content.slice(lastIndex, match.index);
            
            if (beforeText) {
                elements.push(<span key={`text-${lastIndex}`}>{beforeText}</span>);
            }

            elements.push(
                <a 
                    key={`link-${match.index}`} 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="chat-link"
                >
                    {text}
                </a>
            );

            lastIndex = match.index + fullMatch.length;
        }

        const remainingText = content.slice(lastIndex);
        if (remainingText) {
            elements.push(<span key={`text-${lastIndex}`}>{remainingText}</span>);
        }

        return elements.length > 0 ? elements : content;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = {
            role: 'user',
            content: input.trim()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        
        // Add delay to simulate processing
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
        await delay(800);

        try {
            // Check if we should use the API
            const useApi = process.env.REACT_APP_OPENAI_API_KEY && 
                          process.env.REACT_APP_USE_API === 'true';
            
            if (useApi) {
                // Attempt to use the API with retry logic
                let retries = 0;
                const maxRetries = 2;
                let success = false;
                
                while (retries <= maxRetries && !success) {
                    try {
                        const response = await fetch('https://api.openai.com/v1/chat/completions', {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                model: 'gpt-3.5-turbo',
                                messages: [
                                    {
                                        role: 'system',
                                        content: `You are a helpful learning resource assistant. When recommending resources:
                                        1. Always include direct URLs to resources
                                        2. For each skill level (Beginner/Intermediate/Advanced):
                                           - Provide at least one free online course with URL
                                           - Include specific book recommendations with links to Amazon/Goodreads
                                           - Link to relevant YouTube channels/playlists
                                           - Add practical exercises or projects with GitHub/CodePen links
                                        3. Format resources in Markdown with proper [text](url) syntax
                                        4. Always verify the resource exists and is relevant
                                        5. Include official documentation links when applicable
                                        6. Add community resources (Discord, Stack Overflow tags, Reddit)`
                                    },
                                    ...messages.slice(-5), // Keep last 5 messages for context
                                    userMessage
                                ],
                                max_tokens: 1000,
                                temperature: 0.7
                            })
                        });
                        
                        // Check for rate limiting
                        if (response.status === 429) {
                            throw new Error('Rate limit exceeded. Please try again in a moment.');
                        }

                        const data = await response.json();
                        
                        if (data.choices && data.choices[0]) {
                            setMessages(prev => [...prev, {
                                role: 'assistant',
                                content: data.choices[0].message.content
                            }]);
                            success = true;
                        } else {
                            throw new Error('Invalid API response format');
                        }
                    } catch (error) {
                        console.error(`Attempt ${retries + 1} failed:`, error);
                        retries++;
                        
                        if (retries <= maxRetries) {
                            // Exponential backoff for retries
                            await delay(1000 * Math.pow(2, retries));
                        } else {
                            // Fall back to local response after all retries failed
                            throw error;
                        }
                    }
                }
            } else {
                // Use local resource response system
                throw new Error('API disabled or key not provided');
            }
        } catch (error) {
            console.error('Error:', error);
            
            // Generate a resource response based on the user's input
            const resourceResponse = getResourceResponse(input);
            
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: resourceResponse
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chat-widget-container">
            <button 
                className={`chat-widget-button ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close chat" : "Open chat"}
            >
                {isOpen ? <IoMdClose /> : <IoChatbubbleEllipsesSharp />}
            </button>

            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <h3>SkillHive Assistant</h3>
                    </div>
                    <div className="messages-container">
                        {messages.map((msg, index) => (
                            <div 
                                key={index} 
                                className={`message ${msg.role === 'user' ? 'user-message' : 'assistant-message'}`}
                            >
                                {formatMessageContent(msg.content)}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="message assistant-message loading">
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={handleSubmit} className="chat-input-container">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about learning resources..."
                            className="chat-input"
                            aria-label="Chat input"
                        />
                        <button 
                            type="submit" 
                            className="send-button" 
                            disabled={!input.trim() || isLoading}
                            aria-label="Send message"
                        >
                            <IoSend />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default ChatWidget;