
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BookOpenIcon, XMarkIcon } from './icons';

const renderers = {
  h1: ({...props}) => <h1 className="text-3xl font-bold text-zinc-100 mb-4 border-b border-white/10 pb-2 font-mono uppercase tracking-wider" {...props} />,
  h2: ({...props}) => <h2 className="text-2xl font-semibold text-zinc-200 mt-8 mb-4 border-b border-white/5 pb-2 font-mono uppercase tracking-wider" {...props} />,
  h3: ({...props}) => <h3 className="text-xl font-semibold text-sky-400 mt-6 mb-3 font-mono uppercase tracking-wider" {...props} />,
  h4: ({...props}) => <h4 className="text-lg font-semibold text-zinc-300 mt-4 mb-2 font-mono uppercase tracking-wider" {...props} />,
  p: ({...props}) => <p className="text-zinc-400 mb-4 leading-relaxed text-[13px]" {...props} />,
  ul: ({...props}) => <ul className="list-disc list-inside space-y-2 mb-4 pl-4 text-zinc-400 text-[13px]" {...props} />,
  ol: ({...props}) => <ol className="list-decimal list-inside space-y-2 mb-4 pl-4 text-zinc-400 text-[13px]" {...props} />,
  li: ({...props}) => <li className="text-zinc-400" {...props} />,
  code: ({node, inline, className, children, ...props}: any) => {
    const match = /language-(\w+)/.exec(className || '');
    const lang = match ? match[1] : 'text';
    if (!inline) {
        return (
            <div className="relative my-4">
                <pre className="bg-[#050505] p-4 rounded-lg overflow-x-auto border border-white/5 text-[13px] shadow-inner" {...props}>
                    <code className="text-emerald-400/90 font-mono">{children}</code>
                </pre>
                 <span className="absolute top-2 right-2 text-[10px] font-mono uppercase tracking-widest text-zinc-500 bg-[#0a0a0a] px-2 py-1 rounded border border-white/5">{lang}</span>
            </div>
        )
    }
    return <code className="bg-[#050505] text-sky-400 px-1.5 py-1 rounded border border-white/5 font-mono text-[12px]" {...props}>{children}</code>;
  },
  blockquote: ({...props}) => <blockquote className="border-l-2 border-sky-500 pl-4 py-2 my-4 bg-[#050505] text-zinc-500 italic text-[13px] shadow-inner" {...props} />,
  table: ({...props}) => <div className="overflow-x-auto my-4 rounded-lg border border-white/5"><table className="w-full text-left border-collapse text-[13px]" {...props} /></div>,
  thead: ({...props}) => <thead className="bg-[#050505] border-b border-white/10" {...props} />,
  th: ({...props}) => <th className="p-3 font-mono uppercase tracking-wider text-zinc-300 text-[11px]" {...props} />,
  td: ({...props}) => <td className="border-t border-white/5 p-3 text-zinc-400" {...props} />,
  a: ({...props}) => <a className="text-sky-400 hover:text-sky-300 hover:underline transition-colors" {...props} />,
  hr: ({...props}) => <hr className="border-white/10 my-8" {...props} />,
};

export const DocsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    fetch('/README.md')
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.text();
      })
      .then(text => setMarkdown(text))
      .catch(err => {
          console.error('Failed to load README.md:', err);
          setMarkdown('# Error\n\nCould not load the documentation file.');
      });
  }, []);

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
  
  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-[#0a0a0a] border border-white/10 rounded-xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500/0 via-sky-500/20 to-sky-500/0"></div>
        <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center">
            <BookOpenIcon className="w-6 h-6 text-sky-400 mr-3" />
            <div>
              <h2 className="text-lg font-mono tracking-widest text-zinc-100 uppercase">Q Protocol Documentation</h2>
               <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mt-0.5">README.md</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors" aria-label="Close modal">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto bg-[#050505] custom-scrollbar shadow-inner">
           {markdown ? (
             <ReactMarkdown
                children={markdown}
                remarkPlugins={[remarkGfm]}
                components={renderers}
              />
           ) : (
             <div className="flex items-center justify-center h-40 text-sky-400/80 font-mono text-sm uppercase tracking-wider animate-pulse">
               Loading documentation...
             </div>
           )}
        </div>
      </div>
    </div>
  );
};