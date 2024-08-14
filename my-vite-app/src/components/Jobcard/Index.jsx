import React from 'react';
import dayjs from 'dayjs';

function Jobcard({ title, company, postedOn, skills, job_link, type, experience, location }) {
    const currentDate = dayjs(); // Get the current date
    const targetDate = dayjs(postedOn); // Parse the posted date
    const diffInDays = currentDate.diff(targetDate, 'day'); // Calculate the difference

    return (
        <div className='mx-4 mb-4 sm:mx-10 pt-8'> {/* Padding from the top */}
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-4 bg-zinc-200 rounded-md border border-black shadow-lg hover:border-blue-500 hover:translate-y-1 hover:scale-103'>
                <div className='flex flex-col items-start gap-3'>
                    <h1 className='text-lg font-semibold'>{title} - {company}</h1>
                    <p>{type} &#x2022; {experience} &#x2022; {location}</p>
                    <div className='flex flex-wrap items-center gap-2'>
                        {skills.map((skill) => (
                            <p key={skill} className='text-gray-500 py-1 px-2 rounded-md border border-black'>{skill}</p>
                        ))}
                    </div>
                </div>
                <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4 sm:mt-0'>
                    <p className='text-gray-500'>Posted {diffInDays > 1 ? `${diffInDays} days` : `${diffInDays} day`} ago</p>
                    <a href={job_link} target="_blank" rel="noopener noreferrer">
                        <button className='text-blue-500 border border-blue-500 px-4 py-2 rounded-md'>Apply</button>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Jobcard;
