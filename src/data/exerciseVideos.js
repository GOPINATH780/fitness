// Curated list of exercise tutorial videos
const exerciseVideos = {
  // Chest exercises
  "bench press": {
    videoId: "rT7DgCr-3pg",
    title: "How To: Bench Press (PROPER FORM)",
    channel: "THENX"
  },
  "push-ups": {
    videoId: "IODxDxX7oi4",
    title: "Perfect Push Up Form Guide",
    channel: "THENX"
  },
  
  // Back exercises
  "pull-up": {
    videoId: "eGo4IYlbE5g",
    title: "Perfect Pull Up Form Guide",
    channel: "THENX"
  },
  "bent over row": {
    videoId: "FWJR5Ve8bnQ",
    title: "How To: Barbell Row (PROPER FORM)",
    channel: "THENX"
  },

  // Leg exercises
  "squat": {
    videoId: "gsNoPYwWXeM",
    title: "How To: Squat (PROPER FORM)",
    channel: "THENX"
  },
  "deadlift": {
    videoId: "r4MzxtBKyNE",
    title: "How To: Deadlift (PROPER FORM)",
    channel: "THENX"
  },

  // Default video for exercises not in the list
  "default": {
    videoId: "5ioVZcC5xvU",
    title: "Basic Exercise Tutorial",
    channel: "FitnessBlender"
  }
};

// Function to get video data for an exercise
export const getExerciseVideo = (exerciseName) => {
  const normalizedName = exerciseName.toLowerCase();
  
  // Try to find an exact match
  if (exerciseVideos[normalizedName]) {
    return exerciseVideos[normalizedName];
  }

  // If no exact match, try to find a partial match
  const partialMatch = Object.keys(exerciseVideos).find(key => 
    normalizedName.includes(key) || key.includes(normalizedName)
  );

  if (partialMatch) {
    return exerciseVideos[partialMatch];
  }

  // Return default video if no match found
  return exerciseVideos.default;
};

export default exerciseVideos;
