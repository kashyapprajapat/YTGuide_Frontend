'use client'
import React, { useState, useEffect } from 'react';

const YouTubeUrlComponent = () => {
  const [goal, setGoal] = useState('');
  const [urls, setUrls] = useState({
    url1: '',
    url2: '',
    url3: ''
  });
  const [selectedVersion, setSelectedVersion] = useState('v1');
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
    const hasGoal = goal.trim() !== '';
    const hasUrl1 = urls.url1.trim() !== '' && isValidYouTubeUrl(urls.url1.trim());
    const hasUrl2 = urls.url2.trim() !== '' && isValidYouTubeUrl(urls.url2.trim());
    const hasUrl3 = urls.url3.trim() !== '' && isValidYouTubeUrl(urls.url3.trim());
    
    // Require all 3 URLs and goal for the API
    setIsButtonEnabled(hasUrl1 && hasUrl2 && hasUrl3 && hasGoal);
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

  // Handle version change
  const handleVersionChange = (version) => {
    setSelectedVersion(version);
    // Reset results when changing versions
    setResult(null);
    setError(null);
  };

  // Handle API call
  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Validate that we have all required URLs
      if (!urls.url1.trim() || !isValidYouTubeUrl(urls.url1.trim())) {
        throw new Error('Please provide a valid URL for Course #1');
      }
      if (!urls.url2.trim() || !isValidYouTubeUrl(urls.url2.trim())) {
        throw new Error('Please provide a valid URL for Course #2');
      }
      if (!urls.url3.trim() || !isValidYouTubeUrl(urls.url3.trim())) {
        throw new Error('Please provide a valid URL for Course #3');
      }
      if (!goal.trim()) {
        throw new Error('Please provide your learning goal');
      }
      
      const requestData = {
        url1: urls.url1.trim(),
        url2: urls.url2.trim(),
        url3: urls.url3.trim(),
        goal: goal.trim()
      };

      // Log the request data for debugging
      console.log('Sending request to API:', {
        endpoint: `https://ytguide.onrender.com/api/${selectedVersion}/youtube-urls`,
        data: requestData
      });

      // Use the correct API endpoint based on version
      const apiUrl = `https://ytguide.onrender.com/api/${selectedVersion}/youtube-urls`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      // Get response text for better error debugging
      const responseText = await response.text();
      console.log('Response status:', response.status);
      console.log('Response text:', responseText);

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        // Try to parse error details if response has JSON
        try {
          const errorData = JSON.parse(responseText);
          if (errorData.message || errorData.error) {
            errorMessage += ` - ${errorData.message || errorData.error}`;
          }
        } catch (e) {
          // If not JSON, use the raw text
          if (responseText) {
            errorMessage += ` - ${responseText}`;
          }
        }
        
        throw new Error(errorMessage);
      }

      // Parse the successful response
      const data = JSON.parse(responseText);
      setResult({ ...data, version: selectedVersion });
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Parse the recommendation based on API version
  const parseRecommendation = (result) => {
    if (!result) return { personalRec: '', rankings: '' };
    
    let recommendation = '';
    
    // Handle different response formats based on API version
    if (result.version === 'v1' && result.geminiRecommendation) {
      recommendation = result.geminiRecommendation;
    } else if (result.version === 'v2' && result.groqRecommendation) {
      recommendation = result.groqRecommendation;
    }
    
    if (!recommendation) return { personalRec: '', rankings: '' };
    
    // For v1 API (geminiRecommendation)
    if (result.version === 'v1') {
      const parts = recommendation.split('📊 **Video Rankings**:');
      return {
        personalRec: parts[0]?.replace('✅ **Personal Recommendation**:', '').trim() || '',
        rankings: parts[1]?.trim() || ''
      };
    }
    
    // For v2 API (groqRecommendation)
    if (result.version === 'v2') {
      const personalRecMatch = recommendation.match(/\*\*Personal Recommendation\*\*:\s*"([^"]+)"/);
      const rankingsMatch = recommendation.match(/\*\*Video Rankings\*\*:([\s\S]*)/);
      
      return {
        personalRec: personalRecMatch ? personalRecMatch[1] : recommendation.split('**Personal Recommendation**:')[1]?.split('**Video Rankings**:')[0]?.replace(/"/g, '').trim() || '',
        rankings: rankingsMatch ? rankingsMatch[1].trim() : recommendation.split('**Video Rankings**:')[1]?.trim() || ''
      };
    }
    
    return { personalRec: '', rankings: '' };
  };

  const resetForm = () => {
    setResult(null);
    setError(null);
  };

  // If we have results, show them
  if (result) {
    const { personalRec, rankings } = parseRecommendation(result);
    
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-white/30">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Analysis Complete! 🎉
            </h2>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
                <span className="text-green-600 font-semibold">Goal:</span>
                <span className="text-green-800">{result.goal}</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full">
                <span className="text-blue-600 text-sm font-medium">API {result.version?.toUpperCase()}</span>
              </div>
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
                  {personalRec}
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
                {rankings && rankings.split('\n').filter(line => line.trim()).map((ranking, index) => {
                  // Handle both v1 and v2 ranking formats
                  const match = ranking.match(/(\d+)\.\s*(.+)/) || ranking.match(/\*\*.*?(\d+).*?\*\*\s*(.+)/);
                  if (!match) {
                    // If no number match, still display the line if it has content
                    if (ranking.trim().length > 0) {
                      return (
                        <div key={index} className="p-4 rounded-xl border-2 bg-gray-50 border-gray-200">
                          <p className="text-gray-700 text-sm">{ranking.trim()}</p>
                        </div>
                      );
                    }
                    return null;
                  }
                  
                  const [, rank, description] = match;
                  const rankNum = parseInt(rank);
                  const colors = ['bg-yellow-100 border-yellow-300', 'bg-gray-100 border-gray-300', 'bg-orange-100 border-orange-300'];
                  const medals = ['🥇', '🥈', '🥉'];
                  
                  return (
                    <div key={index} className={`p-4 rounded-xl border-2 ${colors[rankNum - 1] || 'bg-gray-100 border-gray-300'}`}>
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{medals[rankNum - 1] || '📍'}</span>
                        <div>
                          <div className="font-semibold text-gray-900 mb-1">Rank #{rank}</div>
                          <p className="text-gray-700 text-sm">{description.replace(/\*\*/g, '').trim()}</p>
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
            Tell us your learning goal and add 3 YouTube course URLs to get AI-powered comparison and recommendations
          </p>
        </div>

        {/* Version Selector */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Analysis Version
          </label>
          <div className="flex gap-4 p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => handleVersionChange('v1')}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                selectedVersion === 'v1'
                  ? 'bg-white text-purple-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              disabled={isLoading}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">🔍</span>
                <span>Standard Analysis</span>
              </div>
              <p className="text-xs mt-1 opacity-75">Comprehensive course comparison</p>
            </button>
            <button
              onClick={() => handleVersionChange('v2')}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                selectedVersion === 'v2'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              disabled={isLoading}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">⚡</span>
                <span>Enhanced Analysis</span>
              </div>
              <p className="text-xs mt-1 opacity-75">Advanced AI recommendations</p>
            </button>
          </div>
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
              placeholder="I want to learn Next.js quickly"
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
                placeholder="https://youtube.com/watch?v=... or https://youtu.be/..."
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
                placeholder="https://youtube.com/watch?v=... or https://youtu.be/..."
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
              Course URL #3 *
            </label>
            <div className="relative">
              <input
                type="url"
                value={urls.url3}
                onChange={(e) => handleInputChange('url3', e.target.value)}
                placeholder="https://youtube.com/watch?v=... or https://youtu.be/..."
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
                🤖 AI is analyzing your courses ({selectedVersion.toUpperCase()})...
              </div>
            ) : isButtonEnabled ? (
              `🔍 Analyze Courses (${selectedVersion.toUpperCase()})`
            ) : (
              '⏳ Complete all required fields'
            )}
          </button>
          <p className="text-sm text-gray-500 mt-3">
            {isLoading
              ? `Using ${selectedVersion.toUpperCase()} API - This may take a few moments as our AI analyzes the course content...`
              : isButtonEnabled 
              ? `Ready to find the perfect course using ${selectedVersion.toUpperCase()} analysis!` 
              : 'Please provide your learning goal and 3 valid YouTube URLs'
            }
          </p>
        </div>

        {/* Info Section */}
        <div className="mt-8 p-4 bg-blue-50/80 rounded-xl border border-blue-200/50">
          <div className="flex items-start gap-3">
            <span className="text-blue-500 text-xl mt-1">💡</span>
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">How it works:</h4>
              <p className="text-blue-700 text-sm mb-2">
                Our AI analyzes your learning goal alongside course content, instructor quality, curriculum depth, 
                and student engagement to recommend the best YouTube course tailored to your specific needs.
              </p>
              <div className="text-xs text-blue-600">
                <strong>Standard Analysis (V1):</strong> Uses Gemini AI for comprehensive course comparison with detailed recommendations.<br/>
                <strong>Enhanced Analysis (V2):</strong> Uses Groq AI for advanced processing with improved accuracy and insights.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubeUrlComponent;