import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="relative w-full pt-16 pb-32 overflow-hidden">
       {/* Background Pattern */}
       <div className="absolute inset-0 z-0 bg-beaver-red">
          {/* Pattern removed, keeping just the color and subtle gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-beaver-dark/60"></div>
       </div>

      <div className="relative z-10 w-full max-w-[800px] mx-auto px-4 flex flex-col items-center text-center text-white">
        
        {/* Powered By Badge */}
        <a 
          href="https://www.beaverbitcoin.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-8 shadow-sm hover:bg-white/15 transition-colors"
        >
           <img 
             src="https://i.postimg.cc/cL5QPs3T/Untitled-Linked-In-Post-removebg-preview.png" 
             alt="Beaver Bitcoin" 
             className="w-5 h-5 object-contain"
           />
           <span className="text-xs font-bold tracking-widest uppercase text-white">Powered by Beaver Bitcoin</span>
        </a>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 drop-shadow-md">
          Bitcoin DCA Calculator
        </h1>
        
        <p className="text-lg md:text-xl text-white/90 max-w-2xl font-medium leading-relaxed">
          See how your monthly DCA strategy grows your bitcoin over time.
        </p>
      </div>
    </div>
  );
};

export default Header;