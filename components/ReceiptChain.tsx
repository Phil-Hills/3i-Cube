import React from 'react';
import type { Receipt } from '../types';

interface ReceiptChainProps {
  receipts: Receipt[];
  duplicatesSkipped: number;
}

export const ReceiptChain: React.FC<ReceiptChainProps> = ({ receipts, duplicatesSkipped }) => {
  return (
    <div className="bg-[#0a0a0a] rounded-xl flex flex-col h-full border border-white/10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0"></div>
      <div className="flex items-center justify-between p-4 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-emerald-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <h2 className="text-sm font-mono tracking-widest text-zinc-300 uppercase">Receipt Chain</h2>
        </div>
        <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
          {receipts.length} receipts · {duplicatesSkipped} skipped
        </div>
      </div>
      
      <div className="flex-grow p-4 font-mono text-[11px] space-y-3 overflow-y-auto bg-[#050505] shadow-inner custom-scrollbar">
        {receipts.length === 0 ? (
          <div className="text-zinc-600 text-center mt-4 italic">No receipts yet</div>
        ) : (
          receipts.map((receipt, index) => (
            <div key={index} className="bg-[#0a0a0a] p-3 rounded-lg border border-white/5 shadow-sm">
              <div className="flex justify-between text-zinc-500 mb-2 uppercase tracking-wider">
                <span>{receipt.timestamp.toLocaleTimeString()}</span>
                <span className="text-emerald-400/90 font-bold">✓ VERIFIED</span>
              </div>
              <div className="text-zinc-300 truncate text-[13px] leading-relaxed" title={receipt.coordinate}>
                ◈ {receipt.coordinate}
              </div>
              <div className="text-zinc-500 mt-2 flex justify-between items-center border-t border-white/5 pt-2">
                <span>BLAKE3: {receipt.hash.slice(0, 16)}...</span>
                {receipt.packetAuth && (
                  <span className="text-sky-400/80 bg-sky-900/10 px-2 py-1 rounded border border-sky-500/20 text-[10px] uppercase tracking-wider" title="◈ Claim 20: Packet-level authentication">
                    Auth: {receipt.packetAuth.seq}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
