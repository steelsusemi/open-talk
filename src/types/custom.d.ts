declare module 'react-markdown' {
  import React from 'react';
  
  interface ReactMarkdownProps {
    children: string;
    remarkPlugins?: any[];
    components?: any;
  }
  
  const ReactMarkdown: React.FC<ReactMarkdownProps>;
  
  export default ReactMarkdown;
}

declare module 'react-syntax-highlighter' {
  import React from 'react';
  
  export const Prism: React.FC<any>;
}

declare module 'react-syntax-highlighter/dist/cjs/styles/prism' {
  const vscDarkPlus: any;
  export { vscDarkPlus };
}

declare module 'remark-gfm' {
  const remarkGfm: any;
  export default remarkGfm;
} 