// src/hooks/useWallet.ts

import { create } from 'zustand';
import { Account, uint256 } from 'starknet';
import { provider, WALLET_ADDRESS, WALLET_PRIVATE_KEY, ETH_CONTRACT } from '../services/starknet';
import { persist } from 'zustand/middleware';

interface Transaction {
    hash: string;
    to: string;
    amount: string;
    timestamp: number;
}

interface WalletState {
    account: Account | null;
    isConnected: boolean;
    balance: string;
    transactions: Transaction[];
    connect: () => void;
    disconnect: () => void;
    sendTransaction: (to: string, amount: string) => Promise<any>;
    updateBalance: () => Promise<void>;
    addTransaction: (tx: Transaction) => void;
}

export const useWallet = create<WalletState>()(
    persist(
        (set, get) => ({
            account: null,
            isConnected: false,
            balance: '0',
            transactions: [],

            connect: async () => {
                try {
                    const account = new Account(provider, WALLET_ADDRESS, WALLET_PRIVATE_KEY);
                    set({ account, isConnected: true });
                    // Update balance after connecting
                    const { updateBalance } = get();
                    await updateBalance();
                } catch (error) {
                    console.error('Connection error:', error);
                    set({ account: null, isConnected: false });
                }
            },

            disconnect: () => {
                set({ 
                    account: null, 
                    isConnected: false,
                    balance: '0'
                });
            },

            updateBalance: async () => {
                const { account } = get();
                if (!account) return;
            
                try {
                    const balanceResult = await account.callContract({
                        contractAddress: ETH_CONTRACT,
                        entrypoint: 'balanceOf',
                        calldata: [WALLET_ADDRESS]
                    });
            
                    // Access data array directly
                    const balance = uint256.uint256ToBN({
                        low: balanceResult[0], // First element is low
                        high: balanceResult[1]  // Second element is high
                    }).toString();
                    
                    set({ balance });
                } catch (error) {
                    console.error('Error fetching balance:', error);
                    set({ balance: '0' });
                }
            },

            addTransaction: (tx: Transaction) => {
                set((state) => ({
                    transactions: [tx, ...state.transactions].slice(0, 10) // Keep last 10 transactions
                }));
            },

            sendTransaction: async (to: string, amount: string) => {
                const { account, updateBalance, addTransaction } = get();
                if (!account) throw new Error('Wallet not connected');

                try {
                    // Convert amount to uint256
                    const amountUint256 = uint256.bnToUint256(amount);
                    
                    // Prepare transaction
                    const tx = await account.execute({
                        contractAddress: ETH_CONTRACT,
                        entrypoint: "transfer",
                        calldata: [
                            to,
                            amountUint256.low,
                            amountUint256.high
                        ]
                    });

                    // Wait for transaction to be confirmed
                    await provider.waitForTransaction(tx.transaction_hash);
                    
                    // Add transaction to history
                    addTransaction({
                        hash: tx.transaction_hash,
                        to,
                        amount: (Number(amount) / 1e18).toFixed(6),
                        timestamp: Date.now()
                    });

                    // Update balance after transaction
                    await updateBalance();

                    return tx;
                } catch (error) {
                    console.error('Transaction error:', error);
                    throw error;
                }
            }
        }),
        {
            name: 'wallet-storage',
            partialize: (state) => ({ 
                transactions: state.transactions 
            })
        }
    )
);

// Helper function to format ETH amount
export const formatEth = (wei: string): string => {
    try {
        return (Number(wei) / 1e18).toFixed(6);
    } catch {
        return '0.000000';
    }
};

// Helper function to shorten address
export const shortenAddress = (address: string): string => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};