import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Lottie from 'lottie-react';
import homeBackground from './assets/home.jpg';
import ExerciseList from './components/ExerciseList';
import CategoryExercises from './components/CategoryExercises';
import ExerciseDetail from './components/ExerciseDetail';

// Import all exercise images
import ezBarbell from './assets/Ez barbell.jpg';
import hammer from './assets/Hammer.jpg';
import lowerArm from './assets/Lower arm.jpg';
import olympicBarbell from './assets/Olympic barbel.jpg';
import resistanceBand from './assets/Resistance band.jpg';
import rope from './assets/Rope.jpg';
import skiergMachine from './assets/Skierg machine.jpg';
import stabilityBall from './assets/Stability ball.jpg';
import upperArm from './assets/Upper arm.jpg';
import upperLeg from './assets/Upper leg.jpg';
import arms from './assets/arms.jpg';
import assisted from './assets/assisted.jpg';
import back from './assets/back.jpg';
import band from './assets/band.jpg';
import barbell from './assets/barbell.jpg';
import bodyweight from './assets/bodyweight.jpg';
import bosuBall from './assets/bosu ball.jpg';
import cardio from './assets/cardio.jpg';
import chest from './assets/chest.jpg';
import dumbell from './assets/dumbell.jpg';
import kettlebell from './assets/kettlebell.jpg';
import leverageMachine from './assets/leverage machine.jpg';
import neck from './assets/neck.jpg';

// Function to get Lottie animation based on muscle group or equipment
const useLottieAnimation = (name) => {
  const [animationData, setAnimationData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;

    const fetchAnimation = async () => {
      const animationMappings = {
        'chest': 'https://assets5.lottiefiles.com/packages/lf20_x1gjdldd.json',
        'dumbbells': 'https://assets5.lottiefiles.com/packages/lf20_ck6mwxc8.json',
        'body weight': 'https://assets5.lottiefiles.com/packages/lf20_qm8eqkqm.json',
        'default': 'https://assets5.lottiefiles.com/packages/lf20_tqsxjo2e.json'
      };

      try {
        const searchKey = (name || '').toLowerCase();
        const key = searchKey.split(' ')[0];
        const url = animationMappings[searchKey] || animationMappings[key] || animationMappings.default;
        
        const response = await fetch(url);
        const data = await response.json();
        if (isMounted) {
          setAnimationData(data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading animation:', error);
        try {
          const response = await fetch(animationMappings.default);
          const data = await response.json();
          if (isMounted) {
            setAnimationData(data);
            setLoading(false);
          }
        } catch (err) {
          console.error('Error loading default animation:', err);
          if (isMounted) {
            setLoading(false);
          }
        }
      }
    };

    fetchAnimation();
    return () => {
      isMounted = false;
    };
  }, [name]);

  return { animationData, loading };
};

// Function to get static image based on muscle group or equipment
const getExerciseImage = (name) => {
  // Temporarily returning null for all images
  return null;
};

// Category Card Component for Search Page
const CategoryCard = React.memo(({ item, isSelected, onClick }) => {
  if (!item) return null;

  return (
    <div
      onClick={onClick}
      className={`bg-gray-800/50 hover:bg-gray-700/50 rounded-lg overflow-hidden
        cursor-pointer transition-all duration-200 transform hover:scale-105 aspect-[3/5]
        ${isSelected ? 'ring-2 ring-teal-500' : ''}`}
    >
      <div className="relative h-full w-full">
        <img 
          src={getExerciseImage(item.name)}
          alt={item.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h3 className="text-white text-lg font-semibold text-center px-4">
            {item.name}
          </h3>
        </div>
      </div>
    </div>
  );
});

// Exercise Animation Component for Exercise List
const ExerciseAnimation = React.memo(({ exercise }) => {
  const { animationData, loading } = useLottieAnimation(exercise?.muscle || exercise?.equipment);
  
  if (!exercise) return null;

  return (
    <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden bg-gray-900/50">
      {!loading && animationData && (
        <Lottie
          animationData={animationData}
          loop={true}
          className="w-full h-full"
        />
      )}
      {loading && (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500" />
        </div>
      )}
    </div>
  );
});

// Exercise Card Component for Exercise List
const ExerciseCard = React.memo(({ exercise, showAnimation = false }) => {
  if (!exercise) return null;

  return (
    <div className="bg-gray-800/50 p-4 rounded-lg hover:bg-gray-700/50 
      transition-all duration-200 aspect-[3/5]">
      {showAnimation ? (
        <ExerciseAnimation exercise={exercise} />
      ) : (
        <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
          <img 
            src={exercise.gifUrl}
            alt={exercise.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <h3 className="text-xl font-bold text-teal-300 mb-2">
        {exercise.name}
      </h3>
      <div className="text-gray-300 space-y-2 text-sm">
        <p><span className="font-semibold">Target:</span> {exercise.target}</p>
        <p><span className="font-semibold">Equipment:</span> {exercise.equipment}</p>
        <p><span className="font-semibold">Body Part:</span> {exercise.bodyPart}</p>
      </div>
    </div>
  );
});

// Exercise Card Component
const ExerciseCardComponent = React.memo(({ exercise }) => {
  const { animationData, loading } = useLottieAnimation(exercise?.muscle || exercise?.equipment);
  
  if (!exercise) return null;

  return (
    <div className="bg-gray-800/50 p-4 rounded-lg hover:bg-gray-700/50 
      transition-all duration-200 aspect-[3/5]">
      <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden bg-gray-900/50">
        {!loading && animationData && (
          <Lottie
            animationData={animationData}
            loop={true}
            className="w-full h-full"
          />
        )}
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500" />
          </div>
        )}
      </div>
      <h3 className="text-xl font-bold text-teal-300 mb-2">
        {exercise.name}
      </h3>
      <div className="text-gray-300 space-y-2 text-sm">
        <p><span className="font-semibold">Type:</span> {exercise.type}</p>
        <p><span className="font-semibold">Equipment:</span> {exercise.equipment}</p>
        <p><span className="font-semibold">Difficulty:</span> {exercise.difficulty}</p>
        <p className="text-xs line-clamp-4">{exercise.instructions}</p>
      </div>
    </div>
  );
});

const Home = () => (
  <div className="relative h-screen">
    <div 
      className="absolute inset-0 z-0"
      style={{
        backgroundImage: `url(${require('./assets/home.jpg')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    />
    <div className="relative z-10 flex flex-col items-center justify-center h-full bg-black/50 text-white p-4 sm:p-8 text-center">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
        Welcome to FitFlex – Your Personal Fitness Companion!
      </h1>
      <p className="text-lg sm:text-xl max-w-3xl mb-2 sm:mb-4">
        Transform Your Fitness Journey Today
      </p>
      <p className="text-base sm:text-lg max-w-2xl mb-6 sm:mb-8">
        Get personalized workout plans, expert fitness advice, and easy-to-follow exercises designed for all fitness levels.
      </p>
      <button 
        className="bg-teal-500 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg text-base sm:text-lg font-semibold 
          hover:bg-teal-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
      >
        Start Now
      </button>
    </div>
  </div>
);

const About = () => (
  <div className="min-h-screen relative flex-1">
    {/* Background Image */}
    <div 
      className="absolute inset-0"
      style={{
        backgroundImage: `url(${require('./assets/about.jpg')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        filter: 'brightness(0.8)'
      }}
    />
    {/* Content */}
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-3xl text-center text-white mt-16 bg-black/30 p-8 rounded-xl backdrop-blur-sm">
        <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-teal-300 drop-shadow-lg">
          About FitFlex
        </h1>
        <p className="text-lg sm:text-xl leading-relaxed mb-8 drop-shadow">
          FitFlex is your ultimate fitness companion, designed to help you achieve your health goals with ease. 
          Explore a vast collection of exercises categorized by body parts and equipment, get expert workout guidance, 
          and track your favorites effortlessly.
        </p>
        <p className="text-lg sm:text-xl leading-relaxed drop-shadow">
          Whether you're a beginner or an athlete, our app ensures a seamless, engaging, and effective fitness journey. 
          Stay fit, stay strong! 💪🔥
        </p>
      </div>
    </div>
  </div>
);

const Search = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('bodyParts');
  const [bodyParts, setBodyParts] = React.useState([]);
  const [equipment, setEquipment] = React.useState([]);
  const [exercises, setExercises] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [selectedCategory, setSelectedCategory] = React.useState(null);

  // API Ninjas key
  const API_KEY = 'NQBvlaqTDZNLg2WYGwxV5g==cY4tBGUWZtL15fP8';

  const bodyPartsList = [
    { id: 0, name: 'back' },
    { id: 1, name: 'cardio' },
    { id: 2, name: 'chest' },
    { id: 3, name: 'lower arms' },
    { id: 4, name: 'lower legs' },
    { id: 5, name: 'neck' },
    { id: 6, name: 'shoulders' },
    { id: 7, name: 'upper arms' },
    { id: 8, name: 'upper legs' },
    { id: 9, name: 'waist' }
  ];

  const equipmentList = [
    { id: 0, name: 'assisted' },
    { id: 1, name: 'band' },
    { id: 2, name: 'barbell' },
    { id: 3, name: 'body weight' },
    { id: 4, name: 'bosu ball' },
    { id: 5, name: 'cable' },
    { id: 6, name: 'dumbbell' },
    { id: 7, name: 'elliptical machine' },
    { id: 8, name: 'ez barbell' },
    { id: 9, name: 'hammer' },
    { id: 10, name: 'kettlebell' },
    { id: 11, name: 'leverage machine' },
    { id: 12, name: 'medicine ball' },
    { id: 13, name: 'olympic barbell' },
    { id: 14, name: 'resistance band' },
    { id: 15, name: 'roller' },
    { id: 16, name: 'rope' },
    { id: 17, name: 'skierg machine' },
    { id: 18, name: 'sled machine' },
    { id: 19, name: 'smith machine' },
    { id: 20, name: 'stability ball' },
    { id: 21, name: 'stationary bike' },
    { id: 22, name: 'stepmill machine' },
    { id: 23, name: 'tire' },
    { id: 24, name: 'trap bar' },
    { id: 25, name: 'upper body ergometer' },
    { id: 26, name: 'weighted' },
    { id: 27, name: 'wheel roller' }
  ];

  React.useEffect(() => {
    if (activeTab === 'bodyParts') {
      fetchBodyParts();
    } else if (activeTab === 'equipment') {
      fetchEquipment();
    }
  }, [activeTab]);

  const fetchBodyParts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://wger.de/api/v2/muscle/');
      const data = await response.json();
      setBodyParts(data.results);
    } catch (err) {
      setError('Failed to fetch body parts. Please try again later.');
      console.error('Error fetching body parts:', err);
    }
    setLoading(false);
  };

  const fetchEquipment = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://wger.de/api/v2/equipment/');
      const data = await response.json();
      setEquipment(data.results);
    } catch (err) {
      setError('Failed to fetch equipment. Please try again later.');
      console.error('Error fetching equipment:', err);
    }
    setLoading(false);
  };

  const handleCategoryClick = (item) => {
    const type = activeTab === 'bodyParts' ? 'bodyPart' : 'equipment';
    navigate(`/category/${type}/${item.name.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen relative flex-1">
      {/* Background Image */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${require('./assets/home.jpg')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(0.8)'
        }}
      />
      {/* Content */}
      <div className="absolute inset-0 bg-black/50 flex flex-col items-center p-4 sm:p-8">
        <div className="w-full max-w-7xl mt-16 flex flex-col h-[calc(100vh-8rem)]">
          {/* Toggle Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveTab('bodyParts')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'bodyParts'
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Body Parts
            </button>
            <button
              onClick={() => setActiveTab('equipment')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'equipment'
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Equipment
            </button>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-fr gap-4 pb-4">
              {(activeTab === 'bodyParts' ? bodyPartsList : equipmentList).map((item) => (
                <CategoryCard
                  key={item.id}
                  item={item}
                  isSelected={selectedCategory === item.name}
                  onClick={() => handleCategoryClick(item)}
                />
              ))}
            </div>

            {/* Exercise Results */}
            {loading ? (
              <div className="mt-8 text-center">
                <div className="inline-block text-teal-500">
                  <svg className="animate-spin h-8 w-8" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
                <p className="text-white mt-2">Loading exercises...</p>
              </div>
            ) : error ? (
              <div className="mt-8 text-red-400 text-center py-8 bg-red-900/20 rounded-lg">
                <p>{error}</p>
              </div>
            ) : exercises.length > 0 ? (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-teal-300">
                    {selectedCategory} Exercises ({exercises.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-4">
                  {exercises.map((exercise, index) => (
                    <ExerciseCard key={index} exercise={exercise} showAnimation={false} />
                  ))}
                </div>
              </div>
            ) : selectedCategory ? (
              <div className="mt-8 text-white text-center py-8 bg-gray-800/30 rounded-lg">
                <p>No exercises found for {selectedCategory}. Try selecting a different category.</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const location = useLocation();
  const isExerciseDetail = location.pathname.includes('/exercise/');
  
  return (
    <nav className={`fixed top-0 left-0 right-0 ${isExerciseDetail ? 'bg-black' : 'bg-black/30'} backdrop-blur-sm z-50`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-teal-500">FitFlex</Link>
          <div className="flex space-x-4">
            <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 transition-colors">Home</Link>
            <Link to="/about" className="text-gray-300 hover:text-white px-3 py-2 transition-colors">About</Link>
            <Link to="/search" className="text-gray-300 hover:text-white px-3 py-2 transition-colors">Search</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/search" element={<Search />} />
          <Route path="/category/:type/:category" element={<CategoryExercises />} />
          <Route path="/exercise/:id" element={<ExerciseDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;