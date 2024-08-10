import React, { useEffect, useState } from 'react';
import Header from './components/Header/Index';
import Jobcard from './components/Jobcard/Index';
import Navbar from './components/Navbar/Index';
import SearchBar from './components/SearchBar/Index';
import { collection, query, orderBy, getDocs, where } from "firebase/firestore";
import { db } from "./firebase.config";

// Function to fetch jobs from Firestore based on criteria
const fetchJobsFromFirestore = async (criteria = {}) => {
  try {
    const jobsRef = collection(db, "jobs");
    const filters = [];

    // Adding filters based on the provided criteria
    if (criteria.type) filters.push(where("type", "==", criteria.type));
    if (criteria.title) filters.push(where("title", "==", criteria.title));
    if (criteria.experience) filters.push(where("experience", "==", criteria.experience));
    if (criteria.location) filters.push(where("location", "==", criteria.location));

    // Create the query with filters and ordering
    const q = query(
      jobsRef,
      ...filters,
      orderBy("postedOn", "desc")
    );

    console.log("Firestore Query:", q); // Debugging query

    // Execute the query
    const querySnapshot = await getDocs(q);

    // Map the results to an array of job objects
    const jobs = querySnapshot.docs.map((job) => ({
      ...job.data(),
      id: job.id,
      postedOn: job.data().postedOn.toDate() // Convert Firestore timestamp to JavaScript Date
    }));

    console.log("Fetched Jobs:", jobs); // Debugging fetched jobs

    return jobs;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
};

// Main App component
function App() {
  const [jobs, setJobs] = useState([]); // State to store jobs
  const [loading, setLoading] = useState(true); // State to handle loading

  // Function to handle search operation
  const handleSearch = async (jobCriteria) => {
    setLoading(true);
    console.log("Search Criteria:", jobCriteria); // Debugging search criteria
    const jobData = await fetchJobsFromFirestore(jobCriteria);
    setJobs(jobData); // Update state with fetched jobs
    setLoading(false);
  };

  // Load jobs initially when the component mounts
  useEffect(() => {
    const loadJobs = async () => {
      const jobData = await fetchJobsFromFirestore();
      setJobs(jobData);
      setLoading(false);
    };
    loadJobs();
  }, []);

  return (
    <div>
      <Navbar />
      <Header />
      <SearchBar fetchJobsCustom={handleSearch} />
      {loading ? (
        <div>Loading...</div> // Display loading message
      ) : (
        jobs.length > 0 ? (
          jobs.map((job) => <Jobcard key={job.id} {...job} />) // Display job cards
        ) : (
          <div>No jobs found.</div> // Display message when no jobs are found
        )
      )}
    </div>
  );
}

export default App;
