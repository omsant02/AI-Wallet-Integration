interface Transaction {
    hash: string;
    to: string;
    amount: string;
    timestamp: number;
}

interface TransactionHistoryProps {
    transactions: Transaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
    return (
        <div className="p-6 bg-[#1a1b23] rounded-xl border border-gray-800">
            <h3 className="text-xl font-semibold text-gray-200 mb-4">Recent Transactions</h3>
            <div className="space-y-3">
                {transactions.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">No transactions yet</p>
                ) : (
                    transactions.map((tx) => (
                        <div key={tx.hash} className="p-4 bg-[#2a2b33] rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="text-gray-400 text-sm">To:</p>
                                    <p className="text-gray-200 font-mono text-sm truncate max-w-xs">
                                        {tx.to}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-400 text-sm">Amount:</p>
                                    <p className="text-gray-200">{tx.amount} ETH</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Hash:</p>
                                <a 
                                    href={`https://sepolia.starkscan.co/tx/${tx.hash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300 font-mono text-sm break-all"
                                >
                                    {tx.hash}
                                </a>
                            </div>
                            <p className="text-gray-400 text-sm mt-2">
                                {new Date(tx.timestamp).toLocaleString()}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}