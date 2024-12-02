import { Groq } from 'groq-sdk';
import { useWallet } from '../hooks/useWallet';
import { provider, WALLET_ADDRESS, WALLET_PRIVATE_KEY, ETH_CONTRACT } from '../services/starknet';
import { Account, uint256 } from 'starknet';
// require('dotenv').config();
// import { Send } from './send';
// import { getToken } from '../lib/starknet/voyager'
// import { useStarknet } from '@/lib/hooks/use-starknet'
// import { SendTokenArgs, sendToken } from '../lib/starknet/send'
// import { useDynamicContext } from '@dynamic-labs/sdk-react-core'

interface ChainIdResponse {
    jsonrpc: string;
    id: number;
    result: string | { block_hash: string, block_number: string, calldata: string, max_fee: string, nonce: string, sender_address: string, signature: string, transaction_hash: string, type: string, version: string, actual_fee: string, events: string, execution_resources: string, execution_status: string, finality_status: string, messages_sent: string};
}

//const apiKeyGroq = process.env.GROQ_API_KEY;
const apiKeyGroq = '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';

const client = new Groq({ apiKey: apiKeyGroq, dangerouslyAllowBrowser: true });
const MODEL = 'llama3-groq-70b-8192-tool-use-preview';


function calculate(args: { expression: string }): any {
    try {
        const result = eval(args.expression);
        return JSON.stringify({ result });
    } catch {
        return JSON.stringify({ error: "Invalid prompt" });
    }
}

async function transferToken(args: { tokenName: string, recipient: string, amount: string, transactionHash: string }): Promise<string> {
    try {
        console.log("called");

        // Prepare transaction
        const account = new Account(provider, WALLET_ADDRESS, WALLET_PRIVATE_KEY);
        const amountUint256 = uint256.bnToUint256(args.amount);
        const tx = await account.execute({
            contractAddress: ETH_CONTRACT,
            entrypoint: "transfer",
            calldata: [
                args.recipient,
                amountUint256.low,
                amountUint256.high
            ]
        });

        // Wait for transaction to be confirmed
        await provider.waitForTransaction(tx.transaction_hash);

        // const { sendTransaction } = useWallet();
        // const amountInt = parseInt(args.amount);
        // const amountBigint = BigInt(amountInt * 10 ** 18);
        // console.log(amountBigint);
        // const result = await sendTransaction(args.recipient, amountBigint.toString());
        // console.log(result);
        return `Transfered ${args.amount} ${args.tokenName} to ${args.recipient} with transaction Hash: ${tx.transaction_hash}`;
        // let myMap = new Map<string, string>([
        //     ["STRKBOT", "0x05ab9c6b81f1d1a7aac290940584a9d26c49ac1014097ef3bf11710445ebf285"]
        // ]);
        // const amountInt = parseInt(args.amount);
        // const amountBigint = BigInt(amountInt * 10 ** 18);
        // const tokenAddress = myMap.get(args.tokenName);
        // if (!tokenAddress) {
        //     return `Could not find token ${args.tokenName}`
        // }
        // await sendToken({ tokenAddress: tokenAddress, recipient: args.recipient, amount: amountBigint});

        // return `Transfered ${args.amount} ${args.tokenName} to ${args.recipient}`;  
    } catch {
        console.log("error");
        return JSON.stringify({ error: "Invalid prompt" });
    }
}

async function getblockNumber(args: { tokenName: string, recipient: string, amount: string, transactionHash: string }): Promise<string> {
    try {
        if (args.tokenName !== 'STRK' && args.tokenName !== 'STARKNET') {
            return `Sorry for now we only support starknet token`;
        }
        const response = await fetch('https://starknet-mainnet.blastapi.io/9eb9cf35-50ae-493c-84cf-247ac77524d5', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              jsonrpc: '2.0',
              id: 0,
              method: 'starknet_blockNumber'
            })
          });
    
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
    
          const data: ChainIdResponse = await response.json(); 
          return `Current Block number of ${args.tokenName} is ${data.result}`;
    } catch {
        console.log("error");
        return JSON.stringify({ error: "Invalid prompt" });
    }
}

async function getChainID(args: { tokenName: string, recipient: string, amount: string, transactionHash: string }): Promise<string> {
    try {
        if (args.tokenName !== 'STRK' && args.tokenName !== 'STARKNET') {
            return `Sorry for now we only support starknet token`;
        }
        const response = await fetch('https://starknet-mainnet.blastapi.io/9eb9cf35-50ae-493c-84cf-247ac77524d5', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              jsonrpc: '2.0',
              id: 0,
              method: 'starknet_chainId'
            })
          });
    
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
    
          const data: ChainIdResponse = await response.json(); 
          return `Chain ID of ${args.tokenName} is ${data.result}`;
    } catch {
        console.log("error");
        return JSON.stringify({ error: "Invalid prompt" });
    }
}

async function getblockHashAndNumber(args: { tokenName: string, recipient: string, amount: string, transactionHash: string }): Promise<string> {
    try {
        if (args.tokenName !== 'STRK' && args.tokenName !== 'STARKNET') {
            return `Sorry for now we only support starknet token`;
        }
        const response = await fetch('https://starknet-mainnet.blastapi.io/9eb9cf35-50ae-493c-84cf-247ac77524d5', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              jsonrpc: '2.0',
              id: 0,
              method: 'starknet_blockHashAndNumber'
            })
          });
    
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
    
          const data: ChainIdResponse = await response.json(); 
          if (typeof data.result === 'object' && 'block_hash' in data.result && 'block_number' in data.result) {
              return `Block hash of ${args.tokenName} is ${data.result.block_hash} and block number is ${data.result.block_number}`;
          } else {
              throw new Error("Invalid response format");
          }
    } catch {
        console.log("error");
        return JSON.stringify({ error: "Invalid prompt" });
    }
}

async function getTransactionByHash(args: { tokenName: string, recipient: string, amount: string, transactionHash: string }): Promise<string> {
    try {
        // if (args.tokenName !== 'STRK' && args.tokenName !== 'STARKNET') {
        //     return `Sorry for now we only support starknet token`;
        // }
        console.log(args.transactionHash);
        const response = await fetch('https://starknet-mainnet.blastapi.io/9eb9cf35-50ae-493c-84cf-247ac77524d5', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              jsonrpc: '2.0',
              id: 0,
              method: 'starknet_getTransactionByHash',
              params: [args.transactionHash]
            })
          });
    
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
    
          const data: ChainIdResponse = await response.json(); 
          if (typeof data.result === 'object' && 'calldata' in data.result && 'max_fee' in data.result && 'nonce' in data.result && 'sender_address' in data.result && 'signature' in data.result && 'transaction_hash' in data.result && 'type' in data.result && 'version' in data.result) {
              return `Details of Transaction with hash ${args.transactionHash} are the following: Calldata = ${data.result.calldata}, Max Fee = ${data.result.nonce}, Nonce = ${data.result.nonce}, Sender Address = ${data.result.sender_address}, Signature = ${data.result.signature}, Transaction Hash = ${data.result.transaction_hash}, Type = ${data.result.type}, Version = ${data.result.version}`;
          } else {
              throw new Error("Invalid response format");
          }
    } catch {
        console.log("error");
        return JSON.stringify({ error: "Invalid prompt" });
    }
}

async function getTransactionReceipt(args: { tokenName: string, recipient: string, amount: string, transactionHash: string }): Promise<string> {
    try {
        // if (args.tokenName !== 'STRK' && args.tokenName !== 'STARKNET') {
        //     return `Sorry for now we only support starknet token`;
        // }
        const response = await fetch('https://starknet-mainnet.blastapi.io/9eb9cf35-50ae-493c-84cf-247ac77524d5', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              jsonrpc: '2.0',
              id: 0,
              method: 'starknet_getTransactionReceipt',
              params: [args.transactionHash]
            })
          });
    
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
    
          const data: ChainIdResponse = await response.json(); 
          if (typeof data.result === 'object' && 'actual_fee' in data.result&& 'events' in data.result&& 'execution_resources' in data.result&& 'execution_status' in data.result&& 'finality_status' in data.result && 'messages_sent' in data.result &&'transaction_hash' in data.result && 'type' in data.result) {
              return `Reciept of Transaction with hash ${args.transactionHash} contains the following details: Actual Fee = ${data.result.actual_fee}, Block Hash = ${data.result.block_hash}, Block Number = ${data.result.block_number}, Events = ${data.result.events}, Execution Resources = ${data.result.execution_resources}, Execution Status = ${data.result.execution_status}, Finality Status = ${data.result.finality_status}, Messages Sent = ${data.result.messages_sent}, Transaction Hash = ${data.result.transaction_hash}, Type = ${data.result.type}`;
          } else {
              throw new Error("Invalid response format");
          }
    } catch {
        console.log("error");
        return JSON.stringify({ error: "Invalid prompt" });
    }
}

export async function runConversation(prompt: string): Promise<string> {
    const messages = [
        {
            role: "system",
            content: "You are a DeFi bot on Starknet and you can help users with activities like transferring tokens to others, fetching the chainID of a token, fetching the block number of a token, fetching the details of a transaction, fetching the reciept of a transaction, checking their balance of a token, fetching both block hash and block number of a token, transferring tokens to others, swapping tokens on DEXes, and understanding past transactions by simulating them. If the user requests to send some token X to recipient Y for amount Z, call transferToken function to transfer token to another address. If the user requests to fetch/get the block number of a token X, call getBlockNumber function. If the user requests to fetch/get the details of a transaction with its hash X, call getTransactionByHash function. If the user requests to fetch/get the reciept of a transaction with its hash X, call getTransactionReceipt function. If the user requests to fetch/get both block number and block hash of a token X, call getblockHashAndNumber function. If the user requests to fetch/get the chainID of a token X, call getChainID function. If the user requests to swap some token X for token Y and the amount of X to swap, call swapTokens function to swap token to another token.If the user requests to check the balance of a token in a wallet, call balanceOf function to check the balance of a token in a wallet.Besides that, you can also chat with users and do some calculations if needed."
        },
        {
            role: "user",
            content: prompt,
        }
    ];

    const tools = [
        {
            type: "function",
            function: {
                name: "transferToken",
                description: "Transfer token X to recipient Y for amount Z. Use this if the user wants to transfer some token to another address.",
                parameters: {
                    type: "object",
                    properties: {
                        tokenName: {
                            type: "string",
                            description: "The name of the token that will be sent to other address. e.g. STRKBOT/USDC/STRK/ETH/STARKNET.",
                        },
                        recipient: {
                            type: "string",
                            description: "The address of the recipient starting with 0x.",
                        },
                        amount: {
                            type: "string",
                            description: "The amount of token to transfer.",
                        },
                        transactionHash: {
                            type: "string",
                            description: "The value is always 0x.",
                        }
                    },
                    required: ["tokenName", "recipient", "amount"],
                },
            },
        },
        {
            type: "function",
            function: {
                name: "getChainID",
                description: "Get the chainID of token X. Use this if the user wants to fetch the chainID of a token.",
                parameters: {
                    type: "object",
                    properties: {
                        tokenName: {
                            type: "string",
                            description: "We need the chainID of this token. e.g. STRKBOT/USDC/STRK/ETH/STARKNET.",
                        },
                        recipient: {
                            type: "string",
                            description: "Its value will be always 0x.",
                        },
                        amount: {
                            type: "string",
                            description: "Its value will be always 0.",
                        },
                        transactionHash: {
                            type: "string",
                            description: "The value is always 0x.",
                        }
                    },
                    required: ["tokenName"],
                },
            },
        },
        {
            type: "function",
            function: {
                name: "getblockNumber",
                description: "Get the block number of token X. Use this if the user wants to fetch the block number of a token.",
                parameters: {
                    type: "object",
                    properties: {
                        tokenName: {
                            type: "string",
                            description: "We need the block number of this token. e.g. STRKBOT/USDC/STRK/ETH/STARKNET.",
                        },
                        recipient: {
                            type: "string",
                            description: "Its value will be always 0x.",
                        },
                        amount: {
                            type: "string",
                            description: "Its value will be always 0.",
                        },
                        transactionHash: {
                            type: "string",
                            description: "The value is always 0x.",
                        }
                    },
                    required: ["tokenName"],
                },
            },
        },
        {
            type: "function",
            function: {
                name: "getblockHashAndNumber",
                description: "Get both block number and block hash of token X. Use this if the user wants to fetch the block number and block hash of a token.",
                parameters: {
                    type: "object",
                    properties: {
                        tokenName: {
                            type: "string",
                            description: "We need the block number of this token. e.g. STRKBOT/USDC/STRK/ETH/STARKNET.",
                        },
                        recipient: {
                            type: "string",
                            description: "Its value will be always 0x.",
                        },
                        amount: {
                            type: "string",
                            description: "Its value will be always 0.",
                        },
                        transactionHash: {
                            type: "string",
                            description: "The value is always 0x.",
                        }
                    },
                    required: ["tokenName"],
                },
            },
        },
        {
            type: "function",
            function: {
                name: "getblockHashAndNumber",
                description: "Get both block number and block hash of token X. Use this if the user wants to fetch the block number and block hash of a token.",
                parameters: {
                    type: "object",
                    properties: {
                        tokenName: {
                            type: "string",
                            description: "We need the block number of this token. e.g. STRKBOT/USDC/STRK/ETH/STARKNET.",
                        },
                        recipient: {
                            type: "string",
                            description: "Its value will be always 0x.",
                        },
                        amount: {
                            type: "string",
                            description: "Its value will be always 0.",
                        },
                        transactionHash: {
                            type: "string",
                            description: "The value is always 0x.",
                        }
                    },
                    required: ["tokenName"],
                },
            },
        },
        {
            type: "function",
            function: {
                name: "getTransactionByHash",
                description: "Get the details of a transaction by its hash. Use this if the user wants to fetch the details like calldata, Max Fee, Nonce, Sender Address, Signature, Transaction Hash, Type, Version of a transaction by its hash.",
                parameters: {
                    type: "object",
                    properties: {
                        tokenName: {
                            type: "string",
                            description: "The value is always STARKNET.",
                        },
                        recipient: {
                            type: "string",
                            description: "Its value will be always 0x.",
                        },
                        amount: {
                            type: "string",
                            description: "Its value will be always 0.",
                        },
                        transactionHash: {
                            type: "string",
                            description: "The value starts with 0x.",
                        }
                    },
                    required: ["transactionHash"],
                },
            },
        },
        {
            type: "function",
            function: {
                name: "getTransactionReceipt",
                description: "Get the reciept of a transaction by its hash. Use this if the user wants to fetch the reciept of a transaction by its hash. Recipt contains details like Actual Fee, Block Hash, Block Number, Events, Execution Resources, Execution Status, Finality Status, Messages Sent, Transaction Hash, Type.",
                parameters: {
                    type: "object",
                    properties: {
                        tokenName: {
                            type: "string",
                            description: "The value is always STARKNET.",
                        },
                        recipient: {
                            type: "string",
                            description: "Its value will be always 0x.",
                        },
                        amount: {
                            type: "string",
                            description: "Its value will be always 0.",
                        },
                        transactionHash: {
                            type: "string",
                            description: "The value starts with 0x.",
                        }
                    },
                    required: ["transactionHash"],
                },
            },
        }                     
    ];

    const response = await client.chat.completions.create({
        model: MODEL,
        messages: messages,
        stream: false,
        tools: tools,
        tool_choice: "auto",
        max_tokens: 4096
    });

    const responseMessage = response.choices[0].message;
    const toolCalls = responseMessage.tool_calls;

    console.log(toolCalls);

    if (toolCalls) {
        interface AvailableFunction {
            [key: string]: (args: { tokenName: string, recipient: string, amount: string, transactionHash: string}) => any;
        }

        interface Message {
            tool_call_id?: string;
            role: string;
            name: string;
            content: string;
        }

        const availableFunctions: AvailableFunction = {
            transferToken: transferToken,
            getChainID: getChainID,
            getblockNumber: getblockNumber,
            getblockHashAndNumber: getblockHashAndNumber,
            getTransactionByHash: getTransactionByHash,
            getTransactionReceipt: getTransactionReceipt,
        };

        
        messages.push(responseMessage);
        

        for (const toolCall of toolCalls) {
            const functionName = toolCall.function.name;
            const functionToCall = availableFunctions[functionName];
            const functionArgs = JSON.parse(toolCall.function.arguments);
            console.log(functionArgs);
            const functionResponse = await functionToCall({tokenName:functionArgs.tokenName, recipient:functionArgs.recipient, amount:functionArgs.amount, transactionHash:functionArgs.transactionHash});

            // Ensure the content is always a string
            const contentString = typeof functionResponse === 'string' ? functionResponse : JSON.stringify(functionResponse);
            messages.push({
                tool_call_id: toolCall.id,
                role: "tool",
                name: functionName,
                content: contentString,
            }as Message);
        }

        const secondResponse = await client.chat.completions.create({
            model: MODEL,
            messages: messages
        });

        return secondResponse.choices[0].message.content ?? '';
    }

    return responseMessage.content ?? '';
}