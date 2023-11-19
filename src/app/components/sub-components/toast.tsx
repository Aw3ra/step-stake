import React, { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WalletNotifications: React.FC = () => {
  const { connected, publicKey } = useWallet();

  useEffect(() => {
    if (connected && publicKey) {
      toast(
        <div className="bg-slate-600 flex items-center text-white text-bold text-sm px-4 py-3 rounded shadow-md w-56">
            <p>Connected Wallet</p>
        </div>
        );
    } else {
      toast(        
        <div className="bg-slate-600 flex items-center text-white text-bold text-sm px-4 py-3 rounded shadow-md w-56">
            <p>Disconnected Wallet</p>
        </div>
        );
    }
  }, [connected, publicKey]);

  return <ToastContainer
      position="top-left"
      autoClose={4000}
      hideProgressBar={true}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      style={{ width: "auto" }}
      toastClassName="!p-0 !min-h-0 !bg-transparent"
    />;
};

export default WalletNotifications;
