import React from 'react';
import { Link } from 'react-router-dom';

const NewsBanner = () => {
  return (
    <section className="py-3 bg-white">
      <div className="container mx-auto px-4">
        <Link to="/produtos" className="block relative overflow-hidden rounded-xl group">
          {/* Imagem de novidades em formato paisagem - apenas a imagem */}
          <div className="relative w-full aspect-[16/10] md:aspect-[21/11] overflow-hidden bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            <img
              src="https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=1920&h=400&fit=crop&q=80"
              alt="Novidades"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        </Link>
      </div>
    </section>
  );
};

export default NewsBanner;
