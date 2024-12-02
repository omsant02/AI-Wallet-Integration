import { create } from 'zustand';
import { Account, uint256 } from 'starknet';
import { provider, WALLET_ADDRESS, WALLET_PRIVATE_KEY, ETH_CONTRACT } from '../services/starknet';

interface WalletState {
    account: Account | null;
    isConnected: boolean;
    connect: () => void;
    disconnect: () => void;
    sendTransaction: (to: string, amount: string) => Promise<any>;
}

export const useWallet = create<WalletState>((set, get) => ({
    account: null,
    isConnected: false,
    connect: () => {
        const account = new Account(provider, WALLET_ADDRESS, WALLET_PRIVATE_KEY);
        set({ account, isConnected: true });
    },
    disconnect: () => set({ account: null, isConnected: false }),
    sendTransaction: async (to: string, amount: string) => {
        const { account } = get();
        if (!account) throw new Error('Wallet not connected');

        const amountUint256 = uint256.bnToUint256(amount);
        
        try {
            const tx = await account.execute({
                contractAddress: ETH_CONTRACT,
                entrypoint: "transfer",
                calldata: [to, amountUint256.low, amountUint256.high]
            });

            await provider.waitForTransaction(tx.transaction_hash);
            return tx;
        } catch (error) {
            console.error('Transaction error:', error);
            throw error;
        }
    }
}));