import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import idl from "../../lib/step_staking.json"
import { TokenInput } from './tokenInput';
import { AnchorProvider, setProvider, Idl, Program, getProvider, web3, BN} from '@project-serum/anchor'
import { TOKEN_PROGRAM_ID, Token, MintLayout } from '@solana/spl-token';
import { useWallet, useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { find_tokens, get_token_price, getWalletTokenAccounts, stakeStep, unStakeStep, getPriceFromEvent} from '../../lib/util';
import { PublicKey} from '@solana/web3.js';
import { publicKey } from '../../../../node_modules/@project-serum/anchor/dist/cjs/utils/index';
import { toast } from 'react-toastify';

interface provider {
    provider: AnchorProvider;
}
interface Price {
    stepPerXstepE9: number;
    stepPerXstep: string;
  }

const Stake: React.FC<provider> = ({ provider }) => {
    const [tokenState, setTokenState] = useState({
        stake: true,
        stepTokens: 0,
        xstepTokens: 0,
        enteredStepAmount: '',
        enteredXStepAmount: '',
        stepPrice: 0,
        xstepPrice: 0,
      });
    const [program, setProgram] = useState<Program>();
    const stepData = { name: 'STEP', balance: tokenState.stepTokens, image: '/stepCoin.png' };
    const xstepData = { name: 'xSTEP', balance: tokenState.xstepTokens, image: '/xstep.svg' };

    const { connection } = useConnection()
    const wallet = useAnchorWallet()
    const pubWallet = useWallet()
    
    const newProvider = new AnchorProvider(connection, wallet, {})
    setProvider(newProvider)

    const programId = new PublicKey('Stk5NCWomVN3itaFjLu382u9ibb5jMSHEsh6CuhaGjB')

    

    useEffect(() => {
        if (pubWallet.publicKey) {
            loadTokens();
            const newProvider = getProvider();
            const program = new Program(idl as Idl, programId, newProvider);
            setProgram(program);
        }
      }, [pubWallet.publicKey]); // Dependency array
    
        function handleClick() {
            setTokenState(prevState => ({
                ...prevState,
                stake: !prevState.stake,
            }));
        }


    async function stake() {
        if (!pubWallet.connected) {
            toast.error('Wallet not connected!');
            return;
        }
            try{
                if(tokenState.stake){
                    toast(
                        <div className="bg-violet-300 flex items-center text-black text-bold text-sm px-4 py-3 rounded shadow-md w-56">
                            <p>Click <strong>CONFIRM</strong> to stake!</p>
                        </div>
                        );
                    const stake_tx = await stakeStep(program, parseFloat(tokenState.enteredStepAmount), pubWallet,connection,)
                    if (stake_tx)
                    {
                        toast(
                            <a href={"https://xray.helius.xyz/tx/"+stake_tx } target="_blank"  rel="noopener noreferrer" className="bg-emerald-600 flex items-center text-white text-bold text-sm px-4 py-3 rounded shadow-md w-56">
                                <p>Staked! Click for details.</p>
                            </a>);
                    }
                    else{
                        toast(
                            <a className="bg-red-600 flex items-center text-white text-bold text-sm px-4 py-3 rounded shadow-md w-56">
                                <p>Error staking.</p>
                            </a>);
                    }
                }
                else{
                    toast(
                        <div className="bg-violet-300 flex items-center text-black text-bold text-sm px-4 py-3 rounded shadow-md w-56">
                            <p>Click <strong>CONFIRM</strong> to unstake!</p>
                        </div>);
                    const unstake_tx = await unStakeStep(program, parseFloat(tokenState.enteredXStepAmount),pubWallet,connection,)
                    if(unstake_tx)
                    {
                        loadTokens();
                        toast(<a href={"https://xray.helius.xyz/tx/"+unstake_tx } target="_blank" rel="noopener noreferrer" className="bg-emerald-600 flex items-center text-white text-bold text-sm px-4 py-3 rounded shadow-md w-56">
                                <p>Unstaked! Click for details.</p>
                            </a>);
                    }
                    else{
                        toast(<a className="bg-red-600 flex items-center text-white text-bold text-sm px-4 py-3 rounded shadow-md w-56">
                                <p>Error unstaking.</p>
                            </a>);
                    }

                }
                // Reload the wallet balances
                loadTokens();
            }catch (error) {
                toast.error(`Transaction failed! ${error}`);
            }   
        }

    // Update the state when the input value changes
    const handleStepAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setTokenState(prevState => ({
            ...prevState,
            enteredStepAmount: value,
            enteredXStepAmount: value ? (parseFloat(value) * 0.80469).toFixed(5) : '',
        }));
    };

    const handleXStepAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setTokenState(prevState => ({
            ...prevState,
            enteredXStepAmount: value,
            enteredStepAmount: value ? (parseFloat(value) / 0.80469 ).toFixed(5) : '',
        }));
    };
    async function loadTokens() {
        const { stepPrice, xstepPrice } = await get_token_price();
        const { stepTokensRounded, xstepTokensRounded } = await find_tokens(pubWallet.publicKey);
        setTokenState(prevState => ({
            ...prevState,
            stepPrice: stepPrice,
            xstepPrice: xstepPrice,
            stepTokens: parseFloat(stepTokensRounded),
            xstepTokens: parseFloat(xstepTokensRounded),
        }));
    }


    const hasEnteredAmount = tokenState.stake
    ? tokenState.enteredStepAmount.trim() !== ''
    : tokenState.enteredXStepAmount.trim() !== '';

    const insufficientFunds = tokenState.stake
        ? parseFloat(tokenState.enteredStepAmount || '0') > stepData.balance
        : parseFloat(tokenState.enteredXStepAmount || '0') > xstepData.balance;

    const buttonClass = !hasEnteredAmount
        ? 'bg-neutral-400'
        : insufficientFunds
        ? 'bg-red-500 hover:bg-red-600'
        : 'bg-emerald-600 hover:bg-emerald-700';

    const buttonText = !hasEnteredAmount
        ? 'Enter an Amount'
        : insufficientFunds
        ? 'Insufficient Funds'
        : 'Confirm Stake';

    function handleConfirm(){
        stake();
    }
    return( 
        <div>
            <div className="flex items-center justify-left">
                <button
                    onClick={handleClick}
                    className=
                        {`  ${tokenState.stake ? `bg-neutral-900 text-emerald-300` : `bg-neutral-950 text-gray-600`} 
                            p-3
                            rounded-tl-lg 
                            rounded-tr-lg 
                            w-1/3
                            hover:text-emerald-300
                            transition ease-in-out delay-50 duration-300
                        `}>
                    <h1 className="font-bold">Stake</h1>
                </button>
                <button 
                    onClick={handleClick}              
                    className=
                        {`  ${!tokenState.stake ? `bg-neutral-900 text-emerald-300` : `bg-neutral-950 text-gray-600`} 
                            p-3
                            rounded-tl-lg 
                            rounded-tr-lg 
                            w-1/3
                            hover:text-emerald-300
                            transition ease-in-out delay-50 duration-300
                        `}>
                    <h1 className="font-bold">Unstake</h1>
                </button>
            </div>
            <div className="bg-neutral-900 text-white p-8 rounded-bl-lg rounded-br-lg shadow-md w-full flex flex-col">
                <div className="flex items-center justify-between py-4">
                    <h1>Your stake</h1>
                    <h1 className="text-gray-400">Balance: {tokenState.stake ? stepData.balance : xstepData.balance}</h1>
                </div>
                <TokenInput 
                    tokenData={tokenState.stake ? stepData : xstepData}
                    enteredAmount={tokenState.stake ? tokenState.enteredStepAmount : tokenState.enteredXStepAmount}
                    onAmountChange={tokenState.stake ? handleStepAmountChange : handleXStepAmountChange}
                    price={tokenState.stake ? tokenState.stepPrice : tokenState.xstepPrice}
                />
                <div className="mx-auto py-6">
                    <Image
                        src={"/arrow.svg"}
                        alt="image"
                        width={58}
                        height={16}
                        priority
                    />
                </div>
                <div className="flex items-center justify-between pb-4">
                    <h1>You receive</h1>
                    <h1 className="text-gray-400">Balance: {!tokenState.stake ? stepData.balance : xstepData.balance}</h1>
                </div>
                <TokenInput
                    tokenData={!tokenState.stake ? stepData : xstepData}
                    enteredAmount={!tokenState.stake ? tokenState.enteredStepAmount : tokenState.enteredXStepAmount}
                    onAmountChange={!tokenState.stake ? handleStepAmountChange : handleXStepAmountChange}
                    price={!tokenState.stake ? tokenState.stepPrice : tokenState.xstepPrice}
                />
            </div>
            <button
        disabled={!hasEnteredAmount || insufficientFunds}
        onClick={handleConfirm}
        className={`my-6 text-white p-6 rounded-lg shadow-md w-full flex flex-col items-center ${buttonClass}`}
      >
        {buttonText}
      </button>
        </div>      
    );
};

export default Stake;
