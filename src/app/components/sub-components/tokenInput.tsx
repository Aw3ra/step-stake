import Image from 'next/image';
import { stringify } from 'querystring';

interface TokenInputProps {
    tokenData: {
      name: string;
      image: string;
    };
    enteredAmount: string;
    onAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    amount: number;
  }
  
export const TokenInput: React.FC<TokenInputProps> = ({
    tokenData,
    enteredAmount,
    onAmountChange,
    amount,
    }) => {

    function max_button() {
        onAmountChange({
            target: {
            value: (amount).toFixed(5).toString()
            }
        } as React.ChangeEvent<HTMLInputElement>);
    }
          
    function half_button() {
        onAmountChange({
            target: {
            value: (amount / 2).toFixed(5).toString()
            }
        } as React.ChangeEvent<HTMLInputElement>);
    }
    return (
        <div className="flex items-center justify-between p-6 bg-black rounded-lg">
        <div className="flex items-center gap-4 flex-col md:flex-row">
            <Image
            src={tokenData.image}
            alt={`${tokenData.name} image`}
            width={24}
            height={16}
            priority
            />
            <h1 className="font-bold text-sm md:text-lg">{tokenData.name}</h1>
        </div>
        <div className="flex flex-col text-right gap-1 h-10">
            <input
            type="text"
            placeholder="0.00"
            value={enteredAmount}
            onChange={onAmountChange}
            className="pt-2 text-white text-right placeholder-gray-400 bg-black outline-none"
            />
            <div className="text-gray-400 text-xs flex justify-end gap-2 items-center">
                <button onClick={max_button} className="hover:text-gray-200">MAX</button>
                <button onClick={half_button}className="hover:text-gray-200">HALF</button>
            </div>
        </div>
        </div>
    );
};
  