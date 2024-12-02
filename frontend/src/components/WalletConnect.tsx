import { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { SendETHModal } from './SendETHModal';

export function WalletConnect() {
    const { connect, disconnect, isConnected, account } = useWallet();
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);

    if (isConnected && account) {
        return (
            <div className="space-y-6">
                <div className="p-6 bg-[#1a1b23] rounded-xl border border-gray-800">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-gray-200">
                                Wallet Details
                            </h2>
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                <span className="text-green-500 text-sm">Connected</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Wallet Address</label>
                            <div className="p-3 bg-[#2a2b33] rounded-lg font-mono text-sm break-all text-gray-300">
                                {account.address}
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-4">
                            <button 
                                onClick={disconnect}
                                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
                            >
                                Disconnect
                            </button>
                            <button 
                                onClick={() => setIsSendModalOpen(true)}
                                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
                            >
                                Send ETH
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-[#1a1b23] rounded-xl border border-gray-800">
                        <h3 className="text-sm text-gray-400 mb-2">ETH Balance</h3>
                        <div className="text-2xl font-semibold text-gray-200">0.00 ETH</div>
                    </div>

                    <div className="p-6 bg-[#1a1b23] rounded-xl border border-gray-800">
                        <h3 className="text-sm text-gray-400 mb-2">Network</h3>
                        <div className="text-2xl font-semibold text-gray-200">Sepolia</div>
                    </div>
                </div>

                <SendETHModal 
                    isOpen={isSendModalOpen}
                    onClose={() => setIsSendModalOpen(false)}
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-[#1a1b23] rounded-xl border border-gray-800">
            <div className="text-center space-y-4 mb-8">
                <h2 className="text-2xl font-bold text-gray-200">
                    Welcome to Starknet Wallet
                </h2>
                <p className="text-gray-400">
                    Connect your wallet to get started
                </p>
            </div>

            <button 
                onClick={connect}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
            >
                Connect Wallet
            </button>
        </div>
    );
}