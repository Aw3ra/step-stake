'use client'

import StepFooter from './components/stepFooter'
import StepHeader from './components/stepHeader'
import StepStaking from './components/stepStaking'
import { footerItems } from './data'
import Toast from './components/sub-components/toast'

import React, { FC, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

require('@solana/wallet-adapter-react-ui/styles.css');


export default function Home() {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const rpcUrl = "https://aili-ig4znn-fast-mainnet.helius-rpc.com/"

  const wallets = useMemo(() => [new UnsafeBurnerWalletAdapter()], []);
  return (
    <ConnectionProvider endpoint={rpcUrl}>
    <WalletProvider wallets={wallets} autoConnect>
    <Toast />
        <WalletModalProvider>
              <main className="flex min-h-screen flex-col items-center justify-top gap-24 py-8 bg-black text-white">

                <StepHeader company="Step" logo="/stepLogo.svg" description="Wallet Connect" />
                <StepStaking company="Step" logo="/stake.svg" description="Wallet Connect" />
                <StepFooter items={footerItems} />
              </main>
        </WalletModalProvider>
      </WalletProvider>
  </ConnectionProvider>
  )
}
