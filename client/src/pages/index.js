import React, { useState, useEffect } from 'react';
import {} from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import Slider from 'react-slick';

import { slickSettings } from '../utils/slick.settings';
import { getDecoded, getLoginState, getToken } from '../auth/auth.states';
import JobCard from '../components/jobs/Card';
import HomeLayouts from '../layouts/home.layouts';
import axios from 'axios';

function HomePage() {
  const history = useHistory();
  const [recentJobs, setRecentJobs] = useState([]);
  const [recommendedJobs, setRecommended] = useState(null);
  const [credit, setCredit] = useState(0);

  useEffect(() => {
    if (!getLoginState()) {
      history.push('/login');
      return;
    }
    if (getLoginState() && getDecoded()?.role === 'company') {
      history.push(`/profile/company/${getDecoded()?.id}`);
      return;
    }

    axios
      .get('/api/recommendations', { headers: { Authorization: getToken() } })
      .then((res) => {
        console.log(res);
        setRecommended(res.data);
      })
      .catch((err) => {
        console.log(err);
        console.log(err.response);
      });

    axios
      .get('/api/users/profile', { headers: { Authorization: getToken() } })
      .then((res) => {
        console.log(res);
        setCredit(res?.data?.credit);
      })
      .catch((err) => {});

    const asyncFunc = async () => {
      try {
        const rcjobs = await axios.get('/api/jobs', { headers: { authorization: getToken() } });
        console.log(rcjobs);
        setRecentJobs(rcjobs.data);
      } catch (err) {
        console.log(err);
        console.log(err.response);
      }
    };

    asyncFunc();

    return () => {};
  }, [history]);

  return (
    <HomeLayouts page='home' credit={credit}>
      {!!recommendedJobs && (
        <>
          <h2 className='text-left'>Recommended Jobs</h2>
          <Slider {...slickSettings} className='px-4 mx-4'>
            {recommendedJobs
              .filter((rec) => rec.job.status === 'Published')
              .map((item, index) => (
                <div key={item?.id ?? index}>
                  <JobCard credit={credit} job={item?.job} />
                </div>
              ))}
          </Slider>

          <hr />
        </>
      )}

      <h2 className='text-left'>Recent Jobs</h2>
      <div className='d-flex flex-wrap justify-content-start'>
        {recentJobs.map((job) => {
          return (
            <div className='mx-2' key={job.id}>
              <JobCard credit={credit} job={job} />
            </div>
          );
        })}
      </div>
    </HomeLayouts>
  );
}

export default HomePage;
