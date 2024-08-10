import React, { useState } from 'react';

function SearchBar(props) {
    const [jobCriteria, setJobCriteria] = useState({
        title: "",
        location: "",
        experience: "",
        type: ""
    });

    const handleChange = (e) => {
        setJobCriteria((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const search = async () => {
        await props.fetchJobsCustom(jobCriteria);
    };

    const clearFilters = () => {
        setJobCriteria({
            title: "",
            location: "",
            experience: "",
            type: ""
        });
        props.fetchJobsCustom({}); // Fetch jobs without criteria to show all
    };

    return (
        <div className='flex flex-wrap gap-4 my-10 justify-center px-4 sm:px-10'>
            <select onChange={handleChange} name="title" value={jobCriteria.title} className='w-full sm:w-64 py-3 pl-4 bg-zinc-200 font-semibold rounded-md'>
                <option value="" disabled hidden>Job Role</option>
                <option value="iOS Developer">iOS Developer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Android Developer">Android Developer</option>
                <option value="Developer Advocate">Developer Advocate</option>
            </select>
            <select onChange={handleChange} name="type" value={jobCriteria.type} className='w-full sm:w-64 py-3 pl-4 bg-zinc-200 font-semibold rounded-md'>
                <option value="" disabled hidden>Job Type</option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Contract">Contract</option>
            </select>
            <select onChange={handleChange} name="location" value={jobCriteria.location} className='w-full sm:w-64 py-3 pl-4 bg-zinc-200 font-semibold rounded-md'>
                <option value="" disabled hidden>Location</option>
                <option value="Remote">Remote</option>
                <option value="In-Office">In-Office</option>
                <option value="Hybrid">Hybrid</option>
            </select>
            <select onChange={handleChange} name="experience" value={jobCriteria.experience} className='w-full sm:w-64 py-3 pl-4 bg-zinc-200 font-semibold rounded-md'>
                <option value="" disabled hidden>Experience</option>
                <option value="Fresher">Fresher</option>
                <option value="Junior Level">Junior Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
            </select>
            <button onClick={search} className='w-full sm:w-64 bg-blue-500 text-white font-bold py-3 rounded-md'>Search</button>
            <button onClick={clearFilters} className='w-full sm:w-64 bg-red-500 text-white font-bold py-3 rounded-md mt-4'>Clear Filters</button>
        </div>
    );
}

export default SearchBar;
