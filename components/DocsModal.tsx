import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BookOpenIcon, XMarkIcon } from './icons';

const renderers = {
  h1: ({...props}) => <h1 className="text-3xl font-bold text-white mb-4 border-b border-cyan-400/20 pb-2" {...props} />,
  h2: ({...props}) => <h2 className="text-2xl font-semibold text-gray-100 mt-8 mb-4 border-b border-white/10 pb-2" {...props} />,
  h3: ({...props}) => <h3 className="text-xl font-semibold text-cyan-300 mt-6 mb-3" {...props} />,
  h4: ({...props}) => <h4 className="text-lg font-semibold text-gray-200 mt-4 mb-2" {...props} />,
  p: ({...props}) => <p className="text-gray-300 mb-4 leading-relaxed" {...props} />,
  ul: ({...props}) => <ul className="list-disc list-inside space-y-2 mb-4 pl-4" {...props} />,
  ol: ({...props}) => <ol className="list-decimal list-inside space-y-2 mb-4 pl-4" {...props} />,
  li: ({...props}) => <li className="text-gray-300" {...props} />,
  code: ({node, inline, className, children, ...props}: any) => {
    const match = /language-(\w+)/.exec(className || '');
    const lang = match ? match[1] : 'text';
    if (!inline) {
        return (
            <div className="relative my-4">
                <pre className="bg-black/30 p-4 rounded-md overflow-x-auto border border-white/10 text-sm" {...props}>
                    <code>{children}</code>
                </pre>
                 <span className="absolute top-2 right-2 text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">{lang}</span>
            </div>
        )
    }
    return <code className="bg-gray-700 text-cyan-300 px-1.5 py-1 rounded-md font-mono text-sm" {...props}>{children}</code>;
  },
  blockquote: ({...props}) => <blockquote className="border-l-4 border-cyan-500 pl-4 py-2 my-4 bg-black/20 text-gray-400 italic" {...props} />,
  table: ({...props}) => <div className="overflow-x-auto my-4"><table className="w-full text-left border-collapse" {...props} /></div>,
  thead: ({...props}) => <thead className="bg-gray-800/50" {...props} />,
  th: ({...props}) => <th className="border border-gray-700 p-3 font-semibold text-gray-100" {...props} />,
  td: ({...props}) => <td className="border border-gray-700 p-3 text-gray-300" {...props} />,
  a: ({...props}) => <a className="text-cyan-400 hover:underline" {...props} />,
  hr: ({...props}) => <hr className="border-gray-700 my-8" {...props} />,
};

type DocFile = 'ALGORITHM.md' | 'RECURSION.md' | 'README.md' | 'SLIDEBOOK.md';

const docMeta: Record<DocFile, { title: string, subtitle: string }> = {
    'ALGORITHM.md': {
        title: 'The CUBE Algorithm',
        subtitle: 'The complete implementation and theory behind the CUBE Protocol.'
    },
    'RECURSION.md': {
        title: 'Recursive Breakthrough',
        subtitle: 'The algorithm that contains itself—the inception cube.'
    },
    'README.md': {
        title: 'Protocol Overview',
        subtitle: 'The core philosophy and paradigm shifts behind the CUBE Protocol.'
    },
    'SLIDEBOOK.md': {
        title: 'SlideBook Integration',
        subtitle: 'Mapping complex SlideBook/3i microscopy operations to simple CUBE commands.'
    }
};


export const DocsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [markdown, setMarkdown] = useState('');
  const [activeDoc, setActiveDoc] = useState<DocFile>('ALGORITHM.md');

  useEffect(() => {
    setMarkdown('');
    fetch(`/${activeDoc}`)
      .then(response => {
          if (!response.ok) {
              throw new Error(`Network response was not ok for ${activeDoc}`);
          }
          return response.text();
      })
      .then(text => setMarkdown(text))
      .catch(err => {
          console.error(`Failed to load ${activeDoc}:`, err);
          setMarkdown('# Error\n\nCould not load the documentation file.');
      });
  }, [activeDoc]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);
  
  const TabButton: React.FC<{ doc: DocFile }> = ({ doc }) => {
      const isActive = activeDoc === doc;
      const baseClasses = "whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors";
      const activeClasses = "border-cyan-400 text-cyan-300";
      const inactiveClasses = "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500";
      
      return (
        <button
          onClick={() => setActiveDoc(doc)}
          className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
        >
          {docMeta[doc].title}
        </button>
      );
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-gray-950/40 backdrop-blur-2xl border border-white/10 rounded-lg max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl shadow-black/20">
        <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center">
            <BookOpenIcon className="w-7 h-7 text-cyan-400 mr-3" />
            <div>
              <h2 className="text-xl font-bold text-white">3i CUBE Protocol Documentation</h2>
               <p className="text-sm text-gray-400">{docMeta[activeDoc].subtitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:text-white hover:bg-white/10 transition-colors" aria-label="Close modal">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="px-6 border-b border-white/10 flex-shrink-0">
            <nav className="-mb-px flex space-x-6">
                <TabButton doc="ALGORITHM.md" />
                <TabButton doc="RECURSION.md" />
                <TabButton doc="README.md" />
                <TabButton doc="SLIDEBOOK.md" />
            </nav>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto text-gray-300">
           {markdown ? (
             <ReactMarkdown
                children={markdown}
                remarkPlugins={[remarkGfm]}
                components={renderers}
              />
           ) : (
             <div className="flex items-center justify-center h-full">
                <p className="text-gray-400">Loading documentation...</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};