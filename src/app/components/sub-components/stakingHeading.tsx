import React from 'react';
import Image from 'next/image';

interface description {
    title: string;
    description: string;
    image: string;
}

const StepFooter: React.FC<description> = ({ title, description, image }) => {
  return(        
    <div className="text-center flex flex-col gap-10 pb-8">
        <div className="flex justify-center gap-4">
            <Image
            src={image}
            alt={title}
            width={36}
            height={16}
            priority
            />
            <h1 className="text-4xl font-bold tex-center">{title}</h1>
        </div>
        <p className="text-gray-400">{description}</p>
    </div>  
    );
};

export default StepFooter;
