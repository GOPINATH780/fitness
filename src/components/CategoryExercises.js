import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import searchBg from '../assets/search.jpg';

// Import category images
import arms from '../assets/arms.jpg';
import assisted from '../assets/assisted.jpg';
import back from '../assets/back.jpg';
import band from '../assets/band.jpg';
import barbell from '../assets/barbell.jpg';
import bodyweight from '../assets/bodyweight.jpg';
import bosuBall from '../assets/bosu ball.jpg';
import cardio from '../assets/cardio.jpg';
import chest from '../assets/chest.jpg';
import dumbell from '../assets/dumbell.jpg';
import kettlebell from '../assets/kettlebell.jpg';
import leverageMachine from '../assets/leverage machine.jpg';
import neck from '../assets/neck.jpg';

// Function to get category image
const getCategoryImage = (name) => {
  const images = {
    'arms': arms,
    'assisted': assisted,
    'back': back,
    'band': band,
    'barbell': barbell,
    'body weight': bodyweight,
    'bosu ball': bosuBall,
    'cardio': cardio,
    'chest': chest,
    'dumbbell': dumbell,
    'kettlebell': kettlebell,
    'leverage machine': leverageMachine,
    'neck': neck
  };
  return images[name.toLowerCase()] || null;
};

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
      Loading exercises...
    </motion.p>
  </div>
);

const CategoryExercises = () => {
  const { type, category } = useParams();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExercises();
  }, [type, category]);

  const fetchExercises = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        `https://exercisedb.p.rapidapi.com/exercises/${type}/${category}`,
        {
          headers: {
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
            'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY
          }
        }
      );
      
      setExercises(response.data);
    } catch (err) {
      console.error('Error fetching exercises:', err);
      setError('Failed to fetch exercises. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleExerciseClick = (exercise) => {
    navigate(`/exercise/${exercise.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src={searchBg}
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="relative z-10">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src={searchBg}
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-red-500/10 p-8 rounded-xl border border-red-500/20 relative z-10"
        >
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-red-300">{error}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 pt-24 relative">
      <div className="absolute inset-0 z-0">
        <img
          src={searchBg}
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-12"
        >
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 text-transparent bg-clip-text">
            {category.charAt(0).toUpperCase() + category.slice(1)} Exercises
          </span>
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {exercises.map((exercise, index) => (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                onClick={() => handleExerciseClick(exercise)}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden cursor-pointer border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="aspect-w-16 aspect-h-9 relative">
                  {exercise.gifUrl ? (
                    <img
                      src={exercise.gifUrl}
                      alt={exercise.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <img
                      src={getCategoryImage(type === 'equipment' ? exercise.equipment : exercise.bodyPart) || getCategoryImage(exercise.target)}
                      alt={exercise.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    {exercise.name.charAt(0).toUpperCase() + exercise.name.slice(1)}
                  </h3>
                  
                  <div className="space-y-2 text-gray-300">
                    <p className="flex items-center gap-2">
                      <span className="text-pink-400 font-medium">Target:</span>
                      <span className="text-gray-400">{exercise.target}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-pink-400 font-medium">Equipment:</span>
                      <span className="text-gray-400">{exercise.equipment}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default CategoryExercises;
