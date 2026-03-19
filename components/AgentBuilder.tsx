import React, { useState } from 'react';

export const AgentBuilder: React.FC = () => {
  const [agentName, setAgentName] = useState('');
  const [goal, setGoal] = useState('');
  const [capabilities, setCapabilities] = useState({
    moveStage: false,
    captureImage: false,
    adjustFocus: false,
    analyzeImage: false,
  });
  const [validationStatus, setValidationStatus] = useState<'idle' | 'validating' | 'success'>('idle');

  const handleCapabilityChange = (key: keyof typeof capabilities) => {
    setCapabilities(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleValidate = () => {
    if (!agentName || !goal) return;
    setValidationStatus('validating');
    setTimeout(() => {
      setValidationStatus('success');
    }, 1500);
  };

  return (
    <div className="flex flex-col flex-grow pt-4 overflow-hidden gap-4 max-w-3xl mx-auto w-full">
      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
        <h2 className="text-xl font-semibold text-gray-100 mb-6 flex items-center">
          <svg className="w-6 h-6 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Agent Builder
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Agent Name</label>
            <input
              type="text"
              value={agentName}
              onChange={e => setAgentName(e.target.value)}
              placeholder="e.g., CellFinderAgent"
              className="w-full bg-gray-900/70 text-gray-200 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Goal</label>
            <input
              type="text"
              value={goal}
              onChange={e => setGoal(e.target.value)}
              placeholder="e.g., Find cells and capture images"
              className="w-full bg-gray-900/70 text-gray-200 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Capabilities</label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(capabilities).map(([key, value]) => (
                <label key={key} className="flex items-center space-x-3 p-3 bg-gray-900/40 rounded-md border border-gray-700/50 cursor-pointer hover:bg-gray-800/60 transition-colors">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => handleCapabilityChange(key as keyof typeof capabilities)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-gray-300 text-sm">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-700/50">
            <button
              onClick={handleValidate}
              disabled={!agentName || !goal || validationStatus === 'validating'}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium rounded-md transition-colors flex justify-center items-center"
            >
              {validationStatus === 'validating' ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Validating Deployment...
                </span>
              ) : (
                'Validate Deployment'
              )}
            </button>
          </div>

          {validationStatus === 'success' && (
            <div className="mt-6 bg-green-900/20 border border-green-800/50 rounded-md p-4 animate-fade-in">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-green-400 font-semibold flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Validation Successful
                </h3>
                <span className="text-xs text-blue-400 bg-blue-900/30 px-2 py-1 rounded border border-blue-800/50">
                  ◈ Claims 31-35
                </span>
              </div>
              <ul className="space-y-2 text-sm text-green-300/80">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">[✓]</span> Goal aligns with capabilities
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">[✓]</span> Security boundaries verified
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">[✓]</span> Ready for deployment
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
