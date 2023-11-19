import React from 'react';
import Image from 'next/image';
import { information } from '../../data';


const StepFooter: React.FC<information> = (information) => {
  return( 
    <div className="bg-neutral-900 text-white p-8 rounded-lg shadow-md w-full">
        <div className="flex items-center justify-between pb-8">
            <div className="flex items-center gap-4">
                <Image
                    src={"/xstep.svg"}
                    alt="xstep image"
                    className="dark:invert"
                    width={36}
                    height={16}
                    priority
                />
                <h1 className="font-bold">{information.apyHeading}</h1>
            </div>
            <h1 className="font-bold">{information.apy}</h1>
        </div>
        <h1 className="font-bold text-left py-2">{information.hook}</h1>
        <h1 className="text-left py-2 text-gray-400">{information.description}</h1>    
    </div>       
    );
};

export default StepFooter;
