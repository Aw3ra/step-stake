import { Program, web3, BN} from '@project-serum/anchor'
import { WalletContextState } from '@solana/wallet-adapter-react'
import { 
    TOKEN_PROGRAM_ID, 
    getAssociatedTokenAddress, 
    createAssociatedTokenAccountInstruction 
} from '@solana/spl-token';
import { Connection, PublicKey} from '@solana/web3.js';

const stepTokenMint = "StepAscQoEioFxxWGnh2sLBDFp9d8rvKz2Yp39iDpyT";
const xstepTokenMint = "xStpgUCss9piqeFUk2iLVcvJEGhAdJxJQuwLkXP555G";
const tokenMint = new PublicKey("StepAscQoEioFxxWGnh2sLBDFp9d8rvKz2Yp39iDpyT")
const xTokenMint = new PublicKey("xStpgUCss9piqeFUk2iLVcvJEGhAdJxJQuwLkXP555G")
const programId = new PublicKey('Stk5NCWomVN3itaFjLu382u9ibb5jMSHEsh6CuhaGjB')

const heliusKey = process.env.NEXT_PUBLIC_HELIUS_KEY;
console.log(heliusKey)

export async function getWalletTokenAccounts(walletAddress:string, tokenMintAddress:string, connection:Connection) {
  const walletPublicKey = new PublicKey(walletAddress);
  const tokenMintPublicKey = new PublicKey(tokenMintAddress);
  const { value } = await connection.getParsedTokenAccountsByOwner(
    walletPublicKey,
    { mint: tokenMintPublicKey },
    'confirmed'
  );
    if (value.length === 0) {
        return false;
    }
  return value[0].pubkey;
};

export async function find_tokens(pubkey: string) {
    const url = `https://api.helius.xyz/v0/addresses/${pubkey}/balances?api-key=${heliusKey}`;
    const response = await fetch(url);
    const accountData = await response.json();
    const token_list = accountData.tokens;
    let stepTokenAmount = 0;
    let xstepTokenAmount = 0;
    for (let token of token_list) {
        if (token.mint == stepTokenMint) {
            stepTokenAmount = token.amount;
        }
        if (token.mint == xstepTokenMint) {
            xstepTokenAmount = token.amount;
        }
    }
    const stepTokensRounded = (stepTokenAmount / 1000000000);
    const xstepTokensRounded = (xstepTokenAmount / 1000000000);
    return { stepTokensRounded, xstepTokensRounded};
}

export async function get_token_price(){
    const url = `https://api.helius.xyz/v0/token-metadata?api-key=${heliusKey}`;
    const tokenAddresses = [
        stepTokenMint,
        xstepTokenMint,
        ]; 
    const response = await fetch(url, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        mintAccounts: tokenAddresses,
        includeOffChain: true,
        disableCache: false,
        }),
    });

    const data = await response.json();
    const stepPrice = data[0].onChainAccountInfo.accountInfo.lamports / 1000000000;
    const xstepPrice = data[1].onChainAccountInfo.accountInfo.lamports / 1000000000;
    return { stepPrice, xstepPrice };
}

export async function stakeStep(program:Program, amount:number, wallet: WalletContextState, connection:Connection){
    if (wallet.publicKey) {
        const publicKeyString = wallet.publicKey.toBase58();
        const [tokenVaultPda, nonce] = await PublicKey.findProgramAddress(
            [tokenMint.toBuffer()],
            programId
        );
        const x_account = await getWalletTokenAccounts(publicKeyString, xstepTokenMint, connection);
        console.log(x_account)
        if(!x_account){
            console.log("initialize xstep account")
            await initializeStep(program, wallet)
            if( !await getWalletTokenAccounts(publicKeyString, xstepTokenMint, connection)){
                console.log("failed to initialize xstep account")
                return false
            }
        }
        console.log(await getWalletTokenAccounts(publicKeyString, xstepTokenMint, connection))
        const tokenFromAccount = await getWalletTokenAccounts(publicKeyString, stepTokenMint, connection);
        const xTokenToAccount = await getWalletTokenAccounts(publicKeyString, xstepTokenMint, connection);
        if (!tokenFromAccount || !xTokenToAccount) {
            console.log("no account")
            return false;
        }

        const stepAmount = new BN(amount * Math.pow(10, 9))
        try{
            const sig = await program.methods
            .stake(new BN(nonce), stepAmount)
            .accounts({
                tokenMint,
                xTokenMint,
                tokenFrom: tokenFromAccount,
                tokenFromAuthority: publicKeyString,
                tokenVault:new PublicKey(tokenVaultPda),
                xTokenTo: xTokenToAccount,
                tokenProgram: TOKEN_PROGRAM_ID,
            })
            .rpc();
            return sig;
        }
        catch(err){
            console.log(err)
            return false
        }
    }
}

export async function unStakeStep(program:Program, amount:number, wallet: WalletContextState, connection:Connection){
    if (wallet.publicKey) {
        const [tokenVaultPda, nonce] = await PublicKey.findProgramAddress(
            [tokenMint.toBuffer()],
            programId
        );
        const publicKeyString = wallet.publicKey.toBase58();
        const stepAmount = new BN(amount * Math.pow(10, 9))
        const tokenFromAccount = await getWalletTokenAccounts(publicKeyString, stepTokenMint, connection);
        const xTokenToAccount = await getWalletTokenAccounts(publicKeyString, xstepTokenMint, connection);
        if (!tokenFromAccount || !xTokenToAccount) {
            console.log("no account")
            return false;
        }
        try{
            const sig = await program.methods
            .unstake(new BN(nonce), stepAmount)
            .accounts({
                tokenMint,
                xTokenMint,
                xTokenFrom: xTokenToAccount,
                xTokenFromAuthority: publicKeyString,
                tokenVault:new PublicKey(tokenVaultPda),
                tokenTo: tokenFromAccount,
                tokenProgram: TOKEN_PROGRAM_ID,
            })
            .rpc();
            return sig;
        }
        catch(err){
            console.log(err)
            return false
        }
    }
}

export async function initializeStep(program:Program, wallet: WalletContextState){
    try{
        if(wallet.publicKey){
            const [tokenVaultPda, nonce] = await PublicKey.findProgramAddress(
                [tokenMint.toBuffer()],
                program.programId
                );
            const initializer = wallet.publicKey.toBase58()
            if (!initializer) {
                console.log("no account")
                return false;
            }
            const systemProgram = web3.SystemProgram.programId
            const tokenProgram = TOKEN_PROGRAM_ID
            const rent = web3.SYSVAR_RENT_PUBKEY
            const sig = await program.methods
            .initialize(nonce)
            .accounts({
                tokenMint:tokenMint,
                xTokenMint:(await createMint(xTokenMint, program, wallet)),
                tokenVault:tokenVaultPda,
                initializer,
                systemProgram,
                tokenProgram,
                rent,
            })
            .rpc()
            console.log('Initialise successful', sig);
        }
      }
        catch (error) {
            console.error('Initialise failed: ', error);
        }     
}

export async function getxStepRatio(program:Program){
    const [tokenVaultPda, nonce] = await PublicKey.findProgramAddress(
        [tokenMint.toBuffer()],
        program.programId
    );
    const ratio = await program.methods
    .emitPrice()
    .accounts({
        tokenMint,
        xTokenMint,
        tokenVault:tokenVaultPda,
    })
    .rpc()

    return ratio
}

async function createMint(
    mintAccount: PublicKey,
    program: Program,
    wallet: WalletContextState
) {
    if(wallet.publicKey){
        console.log("Creating mint account....")
        const walletString = wallet.publicKey.toBase58()
        const connection = program.provider.connection
        const mintPublicKey = mintAccount
        const associatedTokenAddress = await getAssociatedTokenAddress(
            mintPublicKey,
            wallet.publicKey,
        )
        const accountInfo = await connection.getAccountInfo(associatedTokenAddress)
        if (accountInfo !== null) {
            console.log("Mint account already exists")
        }

        const transaction = new web3.Transaction().add(
            createAssociatedTokenAccountInstruction(
                wallet.publicKey, 
                associatedTokenAddress, 
                wallet.publicKey, 
                mintPublicKey 
            )
        );
        try {
            const signature = await wallet.sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, 'processed');
            return associatedTokenAddress.toBase58();
        } catch (error) {
            console.error('Error creating token account:', error);
        }
        }
}
