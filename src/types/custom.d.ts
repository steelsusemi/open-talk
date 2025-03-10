declare module 'react-markdown' {
  import React from 'react';
  
  interface ReactMarkdownProps {
    children: string;
    remarkPlugins?: unknown[];
    components?: Record<string, unknown>;
  }
  
  const ReactMarkdown: React.FC<ReactMarkdownProps>;
  
  export default ReactMarkdown;
}

declare module 'react-syntax-highlighter' {
  import React from 'react';
  
  export const Prism: React.FC<Record<string, unknown>>;
}

declare module 'react-syntax-highlighter/dist/cjs/styles/prism' {
  const vscDarkPlus: Record<string, unknown>;
  export { vscDarkPlus };
}

declare module 'remark-gfm' {
  const remarkGfm: unknown;
  export default remarkGfm;
} 