import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage/Index';
import Jobcard from './components/Jobcard/Index';
import SearchBar from './components/SearchBar/Index';
import AuthPage from './components/AuthPage/Index';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { db, auth } from './firebase.config';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const fetchJobsFromFirestore = async (criteria = {}) => {
  try {
    const jobsRef = collection(db, 'jobs');
    const filters = [];

    if (criteria.type) filters.push(where('type', '==', criteria.type));
    if (criteria.title) filters.push(where('title', '==', criteria.title));
    if (criteria.experience) filters.push(where('experience', '==', criteria.experience));
    if (criteria.location) filters.push(where('location', '==', criteria.location));

    const q = query(jobsRef, ...filters, orderBy('postedOn', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((job) => ({
      ...job.data(),
      id: job.id,
      postedOn: job.data().postedOn.toDate()
    }));
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw new Error('Failed to fetch jobs.');
  }
};

function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadJobs = async () => {
      if (!user) return; // Avoid fetching jobs if user is not authenticated

      setLoading(true);
      setError(null);
      try {
        const jobData = await fetchJobsFromFirestore();
        setJobs(jobData);
      } catch (error) {
        console.error('Error loading jobs:', error);
        setError('Failed to load jobs.');
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [user]);

  const handleSearch = async (jobCriteria) => {
    setLoading(true);
    setError(null);
    try {
      const jobData = await fetchJobsFromFirestore(jobCriteria);
      setJobs(jobData);
    } catch (error) {
      console.error('Error searching jobs:', error);
      setError('Failed to search jobs.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return <div className='text-center py-4'>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/auth' element={<AuthPage />} />
        <Route
          path='/portal'
          element={
            user ? (
              <div>
                {/* Header Section */}
                <header className="bg-gray-800 text-white p-4">
                  <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Job Portal</h1>
                    <button
                      onClick={handleSignOut}
                      className="px-4 py-2 bg-red-600 text-white font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Sign Out
                    </button>
                  </div>
                </header>

                {/* Main Content */}
                <main className='container mx-auto px-4 py-6'>
                  <p className='text-center text-white mb-4'>Find your ideal job by selecting the criteria below:</p>
                  <SearchBar fetchJobsCustom={handleSearch} />
                  <div className='mt-6'>
                    {error && <div className='text-red-500 mb-4'>{error}</div>}
                    {jobs.length > 0 ? (
                      jobs.map((job) => <Jobcard key={job.id} {...job} />)
                    ) : (
                      <div>No jobs found.</div>
                    )}
                  </div>
                </main>
              </div>
            ) : (
              <Navigate to='/auth' replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
