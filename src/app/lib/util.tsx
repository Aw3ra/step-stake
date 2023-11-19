import { AnchorProvider, Program, web3, BN, useWallet } from '@project-serum/anchor'
import { TOKEN_PROGRAM_ID, Token, MintLayout, getOrCreateAssociatedTokenAccoun, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from '@solana/spl-token';
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';

const stepTokenMint = "StepAscQoEioFxxWGnh2sLBDFp9d8rvKz2Yp39iDpyT";
const xstepTokenMint = "xStpgUCss9piqeFUk2iLVcvJEGhAdJxJQuwLkXP555G";

const tokenMint = new PublicKey("StepAscQoEioFxxWGnh2sLBDFp9d8rvKz2Yp39iDpyT")
const xTokenMint = new PublicKey("xStpgUCss9piqeFUk2iLVcvJEGhAdJxJQuwLkXP555G")
const programId = new PublicKey('Stk5NCWomVN3itaFjLu382u9ibb5jMSHEsh6CuhaGjB')

const heliusKey = "7113a622-60ab-4f5d-9afc-020d04c5318b";

export async function getWalletTokenAccounts(walletAddress:string, tokenMintAddress:string, connection:Connection) {
  const walletPublicKey = new PublicKey(walletAddress);
  const tokenMintPublicKey = new PublicKey(tokenMintAddress);

  // Fetch the associated token accounts for the wallet and the token mint
  const { value } = await connection.getParsedTokenAccountsByOwner(
    walletPublicKey,
    { mint: tokenMintPublicKey },
    'confirmed'
  );
    // If a pubkey exists, return it. Else return false
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
    // Go through all the data and find the one with the mint of the step token
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
    // Create a string out of the token price after doing calcs
    const xstepPrice = data[1].onChainAccountInfo.accountInfo.lamports / 1000000000;

    return { stepPrice, xstepPrice };
}

export async function stakeStep(program:Program, amount:Number, wallet: useWallet, connection:Connection){
    const [tokenVaultPda, nonce] = await PublicKey.findProgramAddress(
        [tokenMint.toBuffer()],
        programId
      );
    const x_account = await getWalletTokenAccounts(wallet.publicKey, xstepTokenMint, connection);
    console.log(x_account)
    if(!x_account){
        console.log("initialize xstep account")
        await initializeStep(program, wallet, connection)
        if( !await getWalletTokenAccounts(wallet.publicKey, xstepTokenMint, connection)){
            console.log("failed to initialize xstep account")
            return false
        }
    }
    console.log(await getWalletTokenAccounts(wallet.publicKey, xstepTokenMint, connection))

    const stepAmount = new BN(amount * Math.pow(10, 9))
    try{
        const sig = await program.methods
        .stake(new BN(nonce), stepAmount)
        .accounts({
            tokenMint,
            xTokenMint,
            tokenFrom: await getWalletTokenAccounts(wallet.publicKey, stepTokenMint, connection),
            tokenFromAuthority: wallet.publicKey,
            tokenVault:new PublicKey(tokenVaultPda),
            xTokenTo: await getWalletTokenAccounts(wallet.publicKey, xstepTokenMint, connection),
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

export async function unStakeStep(program:Program, amount:Number, wallet: useWallet, connection:Connection){
    const [tokenVaultPda, nonce] = await PublicKey.findProgramAddress(
        [tokenMint.toBuffer()],
        programId
      );
    const stepAmount = new BN(amount * Math.pow(10, 9))
    try{
        const sig = await program.methods
        .unstake(new BN(nonce), stepAmount)
        .accounts({
            tokenMint,
            xTokenMint,
            xTokenFrom: await getWalletTokenAccounts(wallet.publicKey, xstepTokenMint, connection),
            xTokenFromAuthority: wallet.publicKey,
            tokenVault:new PublicKey(tokenVaultPda),
            tokenTo: await getWalletTokenAccounts(wallet.publicKey, stepTokenMint, connection),
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

export async function initializeStep(program:Program, wallet: useWallet, connection:Connection){
    try{
        const [tokenVaultPda, nonce] = await PublicKey.findProgramAddress(
            [tokenMint.toBuffer()],
            program.programId
            );
        const initializer = wallet.publicKey
        const systemProgram = web3.SystemProgram.programId
        const tokenProgram = TOKEN_PROGRAM_ID
        const rent = web3.SYSVAR_RENT_PUBKEY
// ...log other parameters similarly

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
        catch (error) {
            console.error('Initialise failed: ', error);
        }     
}

async function createMint(
    mintAccount: PublicKey,
    program: Program,
    wallet: useWallet
) {
    console.log("Creating mint account....")
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
            wallet.publicKey, // Payer of the transaction fees
            associatedTokenAddress, // Associated token account address to create
            wallet.publicKey, // Owner of the new account
            mintPublicKey // Mint for the new account
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
