'use client';

import { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export default function CodeBlock({ code, language = 'bash' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="relative group my-4">
      <div className="flex items-center justify-between px-4 py-2 border border-gb-border border-b-0 rounded-t-lg" style={{ background: '#1a1a2e' }}>
        <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">{language}</span>
        <button
          onClick={handleCopy}
          className="text-[11px] text-gray-400 hover:text-white transition-colors focus-ring rounded px-2 py-0.5"
          aria-label="Copy code"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre
        className="!mt-0 !rounded-t-none border border-gb-border"
        style={{
          background: '#1a1a2e',
          padding: '16px',
          borderRadius: '0 0 12px 12px',
          overflowX: 'auto',
          margin: 0,
        }}
      >
        <code className="text-[13px] font-mono leading-relaxed" style={{ color: '#e2e8f0', background: 'none', padding: 0 }}>
          {code}
        </code>
      </pre>
    </div>
  );
}
