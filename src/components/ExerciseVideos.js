import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ExerciseVideos = ({ exerciseName }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExerciseVideos = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${exerciseName} exercise&type=video&maxResults=6&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
        );
        const data = await response.json();
        
        if (data.items) {
          setVideos(data.items);
        }
      } catch (error) {
        console.error('Error fetching exercise videos:', error);
      } finally {
        setLoading(false);
      }
    };

    if (exerciseName) {
      fetchExerciseVideos();
    }
  }, [exerciseName]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 rounded-xl p-8 border border-purple-500/20"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Related Exercise Videos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <motion.div
            key={video.id.videoId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800/80 rounded-xl overflow-hidden border border-purple-500/10"
          >
            <div className="aspect-video relative">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${video.id.videoId}`}
                title={video.snippet.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white line-clamp-2">
                {video.snippet.title}
              </h3>
              <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                {video.snippet.description}
              </p>
              <p className="text-purple-400 text-sm mt-2">
                {video.snippet.channelTitle}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ExerciseVideos;
