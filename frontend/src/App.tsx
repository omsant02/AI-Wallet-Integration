import { WalletConnect } from './components/WalletConnect';

function App() {
    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        StarknetStake Wallet
                    </h1>
                    <div className="px-4 py-2 bg-gray-800 rounded-lg text-sm text-gray-400">
                        Sepolia Testnet
                    </div>
                </div>
                <WalletConnect />
            </div>
        </div>
    );
}

export default App;