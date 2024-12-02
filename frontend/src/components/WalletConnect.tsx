import { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { SendETHModal } from './SendETHModal';
import { shortenAddress, formatEth } from '../hooks/useWallet';
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import { runConversation } from "./aicomponent";

export function WalletConnect() {
    const { 
        connect, 
        disconnect, 
        isConnected, 
        account, 
        balance, 
        transactions 
    } = useWallet();
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState('')
    const [result, setResult] = useState('')


    const handleSubmitComponent = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const processedResult = await processInputcomponent(inputValue)
        setResult(processedResult)
      }
    
      const HelloWorld = () => {
        return <button>Hello, World!</button>
      }
      const processInputcomponent = async (input: string): Promise<string>  => {
        let output = '';
        console.log(input);
        await runConversation(input).then((value: string) => {
          output = value;
        })
        .catch((error: string) => {
          console.error('Promise rejected with error: ' + error);
        });
        console.log(output)
        return output;
        //return <HelloWorld />
      }
    
    if (isConnected && account) {
        return (
            <div className="space-y-6">
                {/* Wallet Details Card */}
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

                        {/* Wallet Address Section */}
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Wallet Address</label>
                            <div className="relative">
                                <div className="p-3 bg-[#2a2b33] rounded-lg font-mono text-sm break-all text-gray-300">
                                    {account.address}
                                </div>
                                <button 
                                    onClick={() => navigator.clipboard.writeText(account.address)}
                                    className="absolute right-2 top-2 text-gray-400 hover:text-gray-200 text-sm p-1"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-between items-center pt-4">
                            <button 
                                onClick={disconnect}
                                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
                            >
                                Log Out
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

                {/* Balance and Network Info */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-[#1a1b23] rounded-xl border border-gray-800">
                        <h3 className="text-sm text-gray-400 mb-2">ETH Balance</h3>
                        <div className="text-2xl font-semibold text-gray-200">
                            {formatEth(balance)} ETH
                        </div>
                    </div>
                    
                    <div className="p-6 bg-[#1a1b23] rounded-xl border border-gray-800">
                        <h3 className="text-sm text-gray-400 mb-2">Network</h3>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="text-2xl font-semibold text-gray-200">Sepolia</span>
                        </div>
                    </div>
                </div>

                {/* Transaction History */}
                {transactions.length > 0 && (
                    <div className="p-6 bg-[#1a1b23] rounded-xl border border-gray-800">
                        <h3 className="text-xl font-semibold text-gray-200 mb-4">
                            Recent Transactions
                        </h3>
                        <div className="space-y-3">
                            {transactions.map((tx) => (
                                <div key={tx.hash} className="p-4 bg-[#2a2b33] rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="text-gray-400 text-sm">To:</p>
                                            <p className="text-gray-200 font-mono text-sm">
                                                {shortenAddress(tx.to)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-gray-400 text-sm">Amount:</p>
                                            <p className="text-gray-200">{tx.amount} ETH</p>
                                        </div>
                                    </div>
                                    <a 
                                        href={`https://sepolia.starkscan.co/tx/${tx.hash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:text-blue-300 text-sm block mt-2"
                                    >
                                        View on Explorer ↗
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                )}

                {/* Send ETH Modal */}
                <SendETHModal 
                    isOpen={isSendModalOpen}
                    onClose={() => setIsSendModalOpen(false)}
                />

                <div>
                <h1 className="text-4xl font-bold mb-8">AI Web3 Bot - Makes life easier 🛸</h1>
        
        <form onSubmit={handleSubmitComponent} className="w-full max-w-md space-y-4">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter some text..."
            className="w-full md:w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <button 
            type="submit"
            disabled={!inputValue}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            Submit
          </button>
          {/* <div>
          {resultComponent && resultComponent}
          </div> */}
          
          {result && (
            <p className="mt-4 text-xl font-semibold">Result: {result}</p>
          )}
        </form>
                </div>
            </div>
            
        );
    }

    // Not Connected State
    return (
        // <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-[#1a1b23] rounded-xl border border-gray-800">
        //     <div className="text-center space-y-4 mb-8">
        //         <h2 className="text-2xl font-bold text-gray-200">
        //             Welcome to Starknet Wallet
        //         </h2>
        //         <p className="text-gray-400">
        //             Enter your wallet to get started
        //         </p>
        //     </div>
            
        //     <button 
        //         onClick={connect}
        //         className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
        //     >
        //         Enter Your Wallet
        //     </button>
        // </div>
        <>
        <div>
            <LoginForm/>
            <RegisterForm/>
        </div>
      </>
    );
}