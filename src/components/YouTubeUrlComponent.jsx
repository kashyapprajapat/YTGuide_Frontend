'use client'
import React, { useState, useEffect } from 'react';

const YouTubeUrlComponent = () => {
  const [goal, setGoal] = useState('');
  const [urls, setUrls] = useState({
    url1: '',
    url2: '',
    url3: ''
  });
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Function to validate YouTube URL
  const isValidYouTubeUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
  };

  // Check if button should be enabled
  useEffect(() => {
    const validUrls = Object.values(urls).filter(url => url.trim() !== '' && isValidYouTubeUrl(url.trim()));
    const hasGoal = goal.trim() !== '';
    setIsButtonEnabled(validUrls.length >= 2 && hasGoal);
  }, [urls, goal]);

  // Handle input change
  const handleInputChange = (field, value) => {
    setUrls(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle goal change
  const handleGoalChange = (value) => {
    setGoal(value);
  };

  // Handle API call
  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const validUrls = Object.values(urls).filter(url => url.trim() !== '' && isValidYouTubeUrl(url.trim()));
      
      const requestData = {
        url1: validUrls[0] || '',
        url2: validUrls[1] || '',
        url3: validUrls[2] || '',
        goal: goal.trim()
      };

      const response = await fetch('https://ytguide.onrender.com/api/v1/youtube-urls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Parse the gemini recommendation
  const parseRecommendation = (recommendation) => {
    if (!recommendation) return { personalRec: '', rankings: '' };
    
    const parts = recommendation.split('📊 **Video Rankings**:');
    return {
      personalRec: parts[0]?.replace('✅ **Personal Recommendation**:', '').trim() || '',
      rankings: parts[1]?.trim() || ''
    };
  };

  const resetForm = () => {
    setResult(null);
    setError(null);
  };

  // If we have results, show them
  if (result) {
    const { personalRec, rankings } = parseRecommendation(result.geminiRecommendation);
    
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-white/30">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Analysis Complete! 🎉
            </h2>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
              <span className="text-green-600 font-semibold">Goal:</span>
              <span className="text-green-800">{result.goal}</span>
            </div>
          </div>

          {/* Personal Recommendation */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200">
              <div className="flex items-start gap-3 mb-4">
                <span className="text-2xl">✅</span>
                <h3 className="text-xl font-bold text-gray-900">Personal Recommendation</h3>
              </div>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {personalRec.replace(/"/g, '')}
                </p>
              </div>
            </div>
          </div>

          {/* Video Rankings */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-start gap-3 mb-4">
                <span className="text-2xl">📊</span>
                <h3 className="text-xl font-bold text-gray-900">Video Rankings</h3>
              </div>
              <div className="space-y-4">
                {rankings.split('\n').filter(line => line.trim()).map((ranking, index) => {
                  const match = ranking.match(/(\d+)\.\s*(.+)/);
                  if (!match) return null;
                  
                  const [, rank, description] = match;
                  const colors = ['bg-yellow-100 border-yellow-300', 'bg-gray-100 border-gray-300', 'bg-orange-100 border-orange-300'];
                  const medals = ['🥇', '🥈', '🥉'];
                  
                  return (
                    <div key={index} className={`p-4 rounded-xl border-2 ${colors[parseInt(rank) - 1]}`}>
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{medals[parseInt(rank) - 1]}</span>
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">Rank #{rank}</div>
                          <p className="text-gray-700 text-sm">{description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            <button
              onClick={resetForm}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 transform hover:shadow-xl hover:-translate-y-1"
            >
              🔍 Analyze More Courses
            </button>
            <p className="text-sm text-gray-500">
              Want to compare different courses? Click above to start a new analysis!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-white/30">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Compare YouTube{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-red-500 to-red-600 text-transparent bg-clip-text">
                Courses
              </span>
              <svg
                className="absolute -bottom-1 left-0 w-full h-2"
                viewBox="0 0 120 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 4C20 2 40 6 60 4C80 2 100 6 118 4"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            Tell us your learning goal and add 2-3 YouTube course URLs to get AI-powered comparison and recommendations
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6">
            <div className="border-2 border-red-200 bg-red-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-red-500 text-xl">⚠️</span>
                <div className="text-red-700">
                  <strong>Error:</strong> {error}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Learning Goal Input */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            What do you want to learn? *
          </label>
          <div className="relative">
            <textarea
              value={goal}
              onChange={(e) => handleGoalChange(e.target.value)}
              placeholder="I want to learn about AI Agents"
              rows={3}
              className="w-full px-4 py-4 pr-12 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors text-gray-800 bg-white/90 resize-none"
              disabled={isLoading}
            />
            <div className="absolute right-4 top-4">
              <span className="text-indigo-500 text-xl">🎯</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Be specific about your learning goals, experience level, and what you want to achieve
          </p>
        </div>

        {/* Input Fields */}
        <div className="space-y-6 mb-8">
          {/* First URL Input */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Course URL #1 *
            </label>
            <div className="relative">
              <input
                type="url"
                value={urls.url1}
                onChange={(e) => handleInputChange('url1', e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-4 py-4 pr-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-800 bg-white/90"
                disabled={isLoading}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <span className="text-red-500 text-xl">📺</span>
              </div>
              {urls.url1 && !isValidYouTubeUrl(urls.url1) && (
                <p className="text-red-500 text-sm mt-1">Please enter a valid YouTube URL</p>
              )}
            </div>
          </div>

          {/* Second URL Input */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Course URL #2 *
            </label>
            <div className="relative">
              <input
                type="url"
                value={urls.url2}
                onChange={(e) => handleInputChange('url2', e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-4 py-4 pr-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-800 bg-white/90"
                disabled={isLoading}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <span className="text-blue-500 text-xl">📺</span>
              </div>
              {urls.url2 && !isValidYouTubeUrl(urls.url2) && (
                <p className="text-red-500 text-sm mt-1">Please enter a valid YouTube URL</p>
              )}
            </div>
          </div>

          {/* Third URL Input */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Course URL #3 (Optional)
            </label>
            <div className="relative">
              <input
                type="url"
                value={urls.url3}
                onChange={(e) => handleInputChange('url3', e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-4 py-4 pr-12 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors text-gray-800 bg-white/90"
                disabled={isLoading}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <span className="text-green-500 text-xl">📺</span>
              </div>
              {urls.url3 && !isValidYouTubeUrl(urls.url3) && (
                <p className="text-red-500 text-sm mt-1">Please enter a valid YouTube URL</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            onClick={handleAnalyze}
            disabled={!isButtonEnabled || isLoading}
            className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform ${
              isButtonEnabled && !isLoading
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                🤖 AI is analyzing your courses...
              </div>
            ) : isButtonEnabled ? (
              '🔍 Analyze Courses'
            ) : (
              '⏳ Complete all required fields'
            )}
          </button>
          <p className="text-sm text-gray-500 mt-3">
            {isLoading
              ? 'This may take a few moments as our AI analyzes the course content...'
              : isButtonEnabled 
              ? 'Ready to find the perfect course for your learning goal!' 
              : 'Please provide your learning goal and at least 2 valid YouTube URLs'
            }
          </p>
        </div>

        {/* Info Section */}
        <div className="mt-8 p-4 bg-blue-50/80 rounded-xl border border-blue-200/50">
          <div className="flex items-start gap-3">
            <span className="text-blue-500 text-xl mt-1">💡</span>
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">How it works:</h4>
              <p className="text-blue-700 text-sm">
                Our AI analyzes your learning goal alongside course content, instructor quality, curriculum depth, 
                and student engagement to recommend the best YouTube course tailored to your specific needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubeUrlComponent;