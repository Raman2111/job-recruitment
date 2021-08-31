import axios from 'axios';

const setBaseUrl = () => {
  // axios.defaults.baseURL = 'https://recruiter.ifotechservice.com';
  axios.defaults.baseURL = 'http://localhost:5000';
};

export default setBaseUrl;
