import React from 'react';

interface Item {
    name: string;
    description: string;
    href: string;
}

interface FooterProps { items: Item[]; }

const StepFooter: React.FC<FooterProps> = ({ items }) => {
    return(        
      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left gap-2">
          {items.map(({ name, description, href }, index) => (
                  <a
                      key={href}
                      href={href}
                      className="group rounded-2xl border border-transparent px-5 py-4 transition-colors hover:border-gray-900 hover:bg-gray-600"
                      target="_blank"
                      rel="noopener noreferrer"
                      >
                      <h2 className={`mb-3 text-2xl font-semibold`}>
                          {name}{' '}
                          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                          -&gt;
                          </span>
                      </h2>
                      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                          {description}
                      </p>
                  </a>
          ))}
      </div>
      );
  };
  

export default StepFooter;
