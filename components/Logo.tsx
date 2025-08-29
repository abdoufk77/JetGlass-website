'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Logo = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <Link href="/" className="flex items-center space-x-3">
        <div className="relative h-12 w-12">
          <Image 
            src="/logoo.png" 
            alt="JetGlass Industry Logo" 
            fill
            className="object-contain"
            sizes="(max-width: 768px) 3rem, 3rem"
            priority
          />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold">
            <span className="text-black">Jet</span>
            <span className="bg-gradient-to-r from-[#007bff] to-[#00c3ff] bg-clip-text text-transparent">
              Glass
            </span>
          </span>
          <span className="text-xs font-medium text-gray-700 tracking-widest">
            INDUSTRY
          </span>
        </div>
      </Link>
    </div>
  );
};

export default Logo;
