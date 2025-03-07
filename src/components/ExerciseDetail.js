import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import ExerciseVideos from './ExerciseVideos';
import exercisedBg from '../assets/exercised.jpg';

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center gap-4">
    <motion.div
      className="w-20 h-20 border-4 border-purple-500 rounded-full border-t-transparent"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-purple-400 font-medium"
    >
      Loading exercise details...
    </motion.p>
  </div>
);

const ExerciseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExerciseData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Check if data exists in cache and is less than 24 hours old
        const cachedData = localStorage.getItem(`exercise_${id}`);
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          const isExpired = Date.now() - timestamp > 24 * 60 * 60 * 1000; // 24 hours
          
          if (!isExpired) {
            setExercise(data);
            setLoading(false);
            return;
          }
        }

        const exerciseResponse = await axios.get(
          `https://exercisedb.p.rapidapi.com/exercises/exercise/${id}`,
          {
            headers: {
              'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
              'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY
            }
          }
        );
        
        if (!exerciseResponse.data) {
          throw new Error('No exercise data received');
        }
        
        // Store in cache with timestamp
        localStorage.setItem(`exercise_${id}`, JSON.stringify({
          data: exerciseResponse.data,
          timestamp: Date.now()
        }));
        
        setExercise(exerciseResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        const errorMessage = err.response?.status === 401 || err.response?.status === 403
          ? 'API key error: Please check your RapidAPI subscription'
          : err.response?.status === 429
          ? 'API rate limit exceeded. Please try again later'
          : 'Failed to fetch data. Please try again later.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center pt-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8 pt-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-red-500/10 p-8 rounded-xl border border-red-500/20"
        >
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-red-300">{error}</p>
        </motion.div>
      </div>
    );
  }

  if (!exercise) return null;

  return (
    <div className="exercise-detail min-h-screen p-8 pt-24 relative">
      <div className="absolute inset-0 z-0">
        <img
          src={exercisedBg}
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.button
          onClick={() => navigate(-1)}
          className="mb-6 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </motion.button>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-xl overflow-hidden shadow-xl bg-gray-800/50 border border-purple-500/20 flex items-center justify-center"
          >
            <div className="w-full aspect-square relative">
              <img
                src={exercise.gifUrl}
                alt={exercise.name}
                className="absolute inset-0 w-full h-full object-contain p-4"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h1 className="text-3xl font-bold text-white capitalize">{exercise.name}</h1>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-purple-600 rounded-full text-sm text-white">{exercise.bodyPart}</span>
                <span className="px-3 py-1 bg-purple-600 rounded-full text-sm text-white">{exercise.target}</span>
                <span className="px-3 py-1 bg-purple-600 rounded-full text-sm text-white">{exercise.equipment}</span>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-purple-500/20">
              <h2 className="text-xl font-semibold text-white mb-4">Exercise Instructions</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-300">
                {exercise.instructions?.map((instruction, index) => (
                  <li key={index} className="leading-relaxed">
                    {instruction}
                  </li>
                )) || (
                  <li className="text-gray-400">Instructions not available for this exercise.</li>
                )}
              </ol>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-purple-500/20">
              <h2 className="text-xl font-semibold text-white mb-4">Exercise Details</h2>
              <div className="space-y-3 text-gray-300">
                <p><span className="font-medium text-purple-400">Body Part:</span> {exercise.bodyPart}</p>
                <p><span className="font-medium text-purple-400">Target Muscle:</span> {exercise.target}</p>
                <p><span className="font-medium text-purple-400">Equipment:</span> {exercise.equipment}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 relative z-10">
        <ExerciseVideos exerciseName={exercise.name} />
      </div>
    </div>
  );
};

export default ExerciseDetail;
