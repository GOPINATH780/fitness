import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ExerciseList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('ExerciseList mounted');
    console.log('Initial state:', { searchTerm, exercises, loading, error });
  }, []);

  const searchExercises = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching exercises for:', searchTerm);
      const response = await axios.get(
        `https://exercisedb.p.rapidapi.com/exercises/name/${searchTerm}`,
        {
          headers: {
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
            'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY
          }
        }
      );
      
      console.log('API Response:', response.data);
      
      if (!response.data) {
        throw new Error('No data received from the API');
      }
      
      const exerciseData = Array.isArray(response.data) ? response.data : [];
      setExercises(exerciseData);
      
      if (exerciseData.length === 0) {
        setError('No exercises found. Try a different search term.');
      }
    } catch (err) {
      console.error('Error details:', err);
      setError('Failed to fetch exercises. Please try again later.');
      setExercises([]); 
    }
    setLoading(false);
  };

  return (
    <div className="exercise-list min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <motion.button
        onClick={() => navigate('/')}
        className="mb-6 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Home
      </motion.button>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Discover Your Perfect Workout
        </h1>

        <div className="flex justify-center mb-12">
          <div className="relative w-full max-w-xl">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchExercises()}
              placeholder="Search exercises (e.g., 'push up', 'squat')"
              className="w-full px-6 py-4 rounded-full bg-gray-800 border-2 border-purple-500 focus:border-pink-500 outline-none text-white placeholder-gray-400 transition-all duration-300"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={searchExercises}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
            >
              Search
            </motion.button>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
            />
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-center mb-8"
          >
            {error}
          </motion.div>
        )}

        {exercises.length > 0 && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {exercises.map((exercise, index) => (
              <motion.div
                key={exercise.id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/exercise/${exercise.id}`)}
              >
                <img 
                  src={exercise.gifUrl} 
                  alt={exercise.name}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <motion.h3 
                    className="text-xl font-semibold text-white mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    {exercise.name}
                  </motion.h3>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    <span className="inline-block bg-purple-600 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2">
                      {exercise.bodyPart}
                    </span>
                    <span className="inline-block bg-purple-600 rounded-full px-3 py-1 text-sm font-semibold text-white">
                      {exercise.target}
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ExerciseList;
