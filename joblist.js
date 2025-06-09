import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JobList = ({ token }) => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/jobs/search?q=${search}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(res.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };
    fetchJobs();
  }, [search, token]);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search jobs..."
        className="w-full p-2 mb-4 border rounded"
      />
      <div>
        {jobs.map((job) => (
          <div key={job._id} className="p-4 mb-4 bg-white rounded-lg shadow">
            <h3 className="text-xl font-bold">{job.title}</h3>
            <p>{job.company} - {job.location}</p>
            <p>{job.description}</p>
            <p>Salary: ${job.salary}</p>
           Caintainer: JobList
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobList;
