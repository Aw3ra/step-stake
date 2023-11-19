import React from 'react';
import { stakingInformation } from '../data';
import StakingHeading from './sub-components/stakingHeading';
import StakingInformation from './sub-components/stakingInformation';
import Stake from './sub-components/stake';

const StepStaking: React.FC = () => {
  return(
    <div className="flex flex-col gap-4 2xl:w-2/3 max-w-2xl mx-10">
        <StakingHeading title="Stake STEP" description="Stake STEP to receive xSTEP" image="/stake.svg" />
        <StakingInformation {...stakingInformation} />
        <Stake />
    </div>
    );
};

export default StepStaking;
