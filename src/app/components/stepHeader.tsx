import React from 'react';
import Image from 'next/image';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

interface HeaderProps {
    company: string;
    logo: string;
    description: string;
}

const StepHeader: React.FC<HeaderProps> = ({ company, logo, description }) => {
  return(        
    <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex">
        <div className="fixed bottom-0 left-0 flex w-full items-end justify-center lg:static lg:h-auto lg:w-auto bg-black">
        <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://app.step.finance"
            target="_blank"
            rel="noopener noreferrer"
        >
            Created for {' '}
            <Image
            src={logo}
            alt={company + " Logo"}
            width={100}
            height={24}
            priority
            />
        </a>
        </div>
        <WalletMultiButton />
    </div>
    );
};

export default StepHeader;
