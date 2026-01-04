import React from 'react';
import ReactMarkdown from 'react-markdown';

/**
 * Component to render markdown text with proper styling
 */
interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <ReactMarkdown
        components={{
          // Paragraph styling
          p: ({ children }) => (
            <p className="mb-2 last:mb-0 text-gray-800 leading-relaxed">
              {children}
            </p>
          ),
          // Strong/Bold text
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900">
              {children}
            </strong>
          ),
          // Italic text
          em: ({ children }) => (
            <em className="italic text-gray-700">
              {children}
            </em>
          ),
          // Unordered list
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1 my-2">
              {children}
            </ul>
          ),
          // Ordered list
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1 my-2">
              {children}
            </ol>
          ),
          // List items
          li: ({ children }) => (
            <li className="ml-4 text-gray-800">
              {children}
            </li>
          ),
          // Code blocks
          code: ({ inline, children }) => {
            if (inline) {
              return (
                <code className="bg-gray-100 text-brand-600 px-1.5 py-0.5 rounded text-sm font-mono">
                  {children}
                </code>
              );
            }
            return (
              <code className="block bg-gray-100 p-3 rounded-lg text-sm font-mono overflow-x-auto my-2">
                {children}
              </code>
            );
          },
          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-brand-500 pl-4 italic my-2 text-gray-700">
              {children}
            </blockquote>
          ),
          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 hover:text-brand-700 underline"
            >
              {children}
            </a>
          ),
          // Headings
          h1: ({ children }) => (
            <h1 className="text-xl font-bold mb-2 mt-3 text-gray-900">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-bold mb-2 mt-3 text-gray-900">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold mb-2 mt-2 text-gray-900">
              {children}
            </h3>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

// Keep for backward compatibility
export const parseMarkdownToJSX = (text: string) => {
  return <MarkdownRenderer content={text} />;
};

export const formatChatText = (text: string): string => {
  if (!text) return '';
  return text;
};

