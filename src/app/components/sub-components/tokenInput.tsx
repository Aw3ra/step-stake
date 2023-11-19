import Image from 'next/image';

interface TokenInputProps {
    tokenData: {
      name: string;
      image: string;
    };
    enteredAmount: string;
    onAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    price: number;
  }
  
export const TokenInput: React.FC<TokenInputProps> = ({
    tokenData,
    enteredAmount,
    onAmountChange,
    price
    }) => {
    return (
        <div className="flex items-center justify-between p-6 bg-black rounded-lg">
        <div className="flex items-center gap-4">
            <Image
            src={tokenData.image}
            alt={`${tokenData.name} image`}
            width={24}
            height={16}
            priority
            />
            <h1 className="font-bold">{tokenData.name}</h1>
        </div>
        <div className="flex flex-col text-right gap-1 h-10">
            <input
            type="text"
            placeholder="0.00"
            value={enteredAmount}
            onChange={onAmountChange}
            className="pt-2 text-white text-right placeholder-gray-400 bg-black outline-none"
            />
            {enteredAmount && (
            <h1 className="text-gray-400 text-xs">
                {price ? (parseFloat(enteredAmount) * price).toFixed(6) : ''}
            </h1>
            )}
        </div>
        </div>
    );
};
  