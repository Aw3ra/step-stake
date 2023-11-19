// Define the structure of your data (if using TypeScript)
export interface Item {
    name: string;
    description: string;
    href: string;
  }

export interface information {
    apyHeading: string;
    hook: string;
    apy: string;
    description: string;
    image: string;
}
  
  // Define and export the data
export const footerItems: Item[] = [
    {
        name: 'Staking',
        description: 'Learn how to stake with step at the IDL layer!',
        href: 'https://github.com/step-finance/step-staking',
    },
    {
        name: 'Wallet',
        description: 'This is the wallet adaptor I\'ll need.',
        href: 'https://github.com/solana-labs/wallet-adapter',
    },
    {
        name: 'Step site',
        description: 'Copy this sites design.',
        href: 'https://app.step.finance/en/stake',
    },
    {
        name: 'Task PDF',
        description: 'This is the task PDF with all the details',
        href: '/task',
    }
];

export const stakingInformation: information = {
    apyHeading: "xSTEP staking APY",
    apy: "14.48%",
    hook: "Where is my staking reward?",
    description: "xSTEP is a yield bearing asset. This means it is automatically worth more STEP over time. You don't need to claim any rewards, or do anything other than hold your xSTEP to benefit from this. Later, when you unstake your xSTEP you will receive more STEP than you initially deposited.",
    image: "/xstep.svg"
}

export const step_program_id = "Stk5NCWomVN3itaFjLu382u9ibb5jMSHEsh6CuhaGjB"
