import React from 'react';
import Image from 'next/image';
import { footerItems, stakingInformation } from '../data';
import StakingHeading from './sub-components/stakingHeading';
import StakingInformation from './sub-components/stakingInformation';
import Stake from './sub-components/stake';


interface HeaderProps {
    company: string;
    logo: string;
    description: string;
}

const StepStaking: React.FC<HeaderProps> = ({ company, logo, description }) => {
  return(
    <div className="flex flex-col gap-4 w-2/3 max-w-2xl">
        <StakingHeading title="Stake STEP" description="Stake STEP to receive xSTEP" image="/stake.svg" />
        <StakingInformation {...stakingInformation} />
        <Stake {...footerItems} />
    </div>
    );
};

export default StepStaking;
