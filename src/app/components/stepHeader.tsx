import React from 'react';
import Image from 'next/image';
import {
    WalletDisconnectButton,
    WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';


interface HeaderProps {
    company: string;
    logo: string;
    description: string;
}

const StepHeader: React.FC<HeaderProps> = ({ company, logo, description }) => {
  return(        
    <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed bottom-0 left-0 flex w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
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
            className="dark:invert"
            width={100}
            height={24}
            priority
            />
        </a>
        </div>
        {/* Hide these in a modal */}
        <WalletMultiButton />
    </div>
    );
};

export default StepHeader;
