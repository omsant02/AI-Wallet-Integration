import React, { useState } from 'react';
import { useWallet } from '../hooks/useWallet';

interface SendETHModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SendETHModal({ isOpen, onClose }: SendETHModalProps) {
    const { sendTransaction } = useWallet();
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [status, setStatus] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus('Processing transaction...');

        try {
            const result = await sendTransaction(recipient, amount);
            setStatus(`Success! Transaction Hash: ${result.transaction_hash}`);
            setTimeout(onClose, 3000);
        } catch (err: any) { // Explicitly type the error
            setStatus(`Error: ${err?.message || 'Transaction failed'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-[#1a1b23] rounded-xl p-6 max-w-md w-full">
                <h2 className="text-xl font-semibold text-white mb-4">Send ETH</h2>
                
                <form onSubmit={handleSend} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">
                            Recipient Address
                        </label>
                        <input
                            type="text"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            className="w-full bg-[#2a2b33] border border-gray-700 rounded-lg p-2 text-white"
                            placeholder="0x..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">
                            Amount (in wei)
                        </label>
                        <input
                            type="text"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-[#2a2b33] border border-gray-700 rounded-lg p-2 text-white"
                            placeholder="Amount in wei"
                            required
                        />
                    </div>

                    {status && (
                        <div className="text-sm text-gray-300 bg-[#2a2b33] p-3 rounded-lg">
                            {status}
                        </div>
                    )}

                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Sending...' : 'Send ETH'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}