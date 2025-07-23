import React from 'react';

const InfoComponent = () => {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="max-w-4xl w-full">
        {/* Main Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium mb-8 shadow-lg">
            <span className="text-lg">🎓</span>
            YTGuide
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            Helping{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-orange-400 to-yellow-500 text-transparent bg-clip-text">
                self-learners
              </span>
              <svg
                className="absolute -bottom-2 left-0 w-full h-3"
                viewBox="0 0 300 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 6C50 2 100 10 150 6C200 2 250 10 298 6"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#eab308" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            {' '}make smarter{' '}
            <span className="relative">
              YouTube choices
              <svg
                className="absolute -bottom-1 left-0 w-full h-2"
                viewBox="0 0 200 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 4C40 2 80 6 120 4C160 2 180 6 198 4"
                  stroke="#06b6d4"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            <span className="font-bold text-gray-900">YTGuide</span> is an{' '}
            <span className="relative bg-purple-100 px-2 py-1 rounded-md">
              AI-powered SaaS platform
            </span>
            {' '}that helps{' '}
            <span className="font-bold text-gray-900">self-learners evaluate and choose</span>
            {' '}the{' '}
            <span className="relative">
              best YouTube course
              <svg
                className="absolute -bottom-1 left-0 w-full h-2"
                viewBox="0 0 160 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 4C30 2 60 6 90 4C120 2 140 6 158 4"
                  stroke="#14b8a6"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            {' '}for any topic.
          </p>
        </div>


      </div>
    </div>
  );
};

export default InfoComponent;