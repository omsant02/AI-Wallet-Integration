import { RpcProvider, Account, uint256, constants } from 'starknet';

// Your deployed wallet details
export const WALLET_ADDRESS = "0x2ad7edadcf0bf9c8e78a70257de27e0ee45b5c911462fbb90f2f26fa07122b3";
export const WALLET_PRIVATE_KEY = "0x3f35bf512b13ea0113d44e7eea00aa8b686e316650d4363452e77006141cbdd";
export const ETH_CONTRACT = "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";

// Initialize provider
export const provider = new RpcProvider({ 
    nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_7"
});

// Function to convert amount to uint256
export const toUint256 = (amount: string) => {
    return uint256.bnToUint256(amount);
};