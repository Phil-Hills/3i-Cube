import React from 'react';
import type { Receipt } from '../types';

interface ReceiptChainProps {
  receipts: Receipt[];
  duplicatesSkipped: number;
}

export const ReceiptChain: React.FC<ReceiptChainProps> = ({ receipts, duplicatesSkipped }) => {
  return (
    <div className="bg-gray-800/50 rounded-lg flex flex-col h-full border border-gray-700/50 overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b border-gray-700/50 flex-shrink-0">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-emerald-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <h2 className="text-sm font-semibold text-gray-100">Receipt Chain</h2>
        </div>
        <div className="text-xs text-gray-400">
          {receipts.length} receipts · {duplicatesSkipped} duplicates skipped
        </div>
      </div>
      
      <div className="flex-grow p-3 font-mono text-xs space-y-2 overflow-y-auto">
        {receipts.length === 0 ? (
          <div className="text-gray-500 text-center mt-4">No receipts yet</div>
        ) : (
          receipts.map((receipt, index) => (
            <div key={index} className="bg-gray-900/50 p-2 rounded border border-gray-700/30">
              <div className="flex justify-between text-gray-400 mb-1">
                <span>{receipt.timestamp.toLocaleTimeString()}</span>
                <span className="text-emerald-400">✓ verified</span>
              </div>
              <div className="text-gray-200 truncate" title={receipt.coordinate}>
                ◈ {receipt.coordinate}
              </div>
              <div className="text-gray-500 mt-1 flex justify-between items-center">
                <span>BLAKE3: {receipt.hash.slice(0, 16)}...</span>
                {receipt.packetAuth && (
                  <span className="text-blue-400 bg-blue-900/30 px-1.5 py-0.5 rounded border border-blue-800/50 text-[10px]" title="◈ Claim 20: Packet-level authentication">
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
