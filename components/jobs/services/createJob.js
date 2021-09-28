const { validateJob } = require('../validators');
const { createJobDTO } = require('../dtos');
const qs = require('qs');
module.exports = function makeCreateJob({ Job, ElasticAddJob, axios, Recommendation, Profile, User }) {
  return async function createJob({ httpRequest: { body, user } }) {
    const { errors, isValid, data } = validateJob(body);
    if (!isValid) {
      throw { ...errors };
    }
    const newJob = {
      company: user.id,
      title: data.gettitle(),
      location: data.getlocation(),
      total_applicants: data.gettotal_applicants(),
      skills: data.getskills(),
      seniority_level: data.getseniority_level(),
      industry: data.getindustry(),
      job_function: data.getjob_function(),
      salary: data.getsalary(),
      emp_type: data.getemp_type(),
      status: data.getstatus(),
      description: data.getdescription(),
      endDate: data.getendDate(),
      date: data.getdate(),
    };

    const currentUser = await User.findOne({ _id: user.id });
    if (currentUser.credit < 0) {
      throw { error: 'You have not enough credit left to create new job.' };
    }
    User.findByIdAndUpdate({
      id: currentUser._id,
      updateUser: { ...currentUser, credit: currentUser.credit - 1 },
    });

    let createdJob = await Job.create(newJob);

    let dataAI = '';
    // fetch for recommendation list
    createdJob.skills.forEach((skill) => {
      dataAI += skill.name + ' ';
    });
    axios({
      method: 'POST',
      url: 'https://flask-job-recommendation.herokuapp.com/recommend-job',
      data: qs.stringify({
        job_skills: dataAI,
      }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((e) => {});
    let toRecommend = [];
    const profiles = await Profile.find();
    profiles.map((profile) => {
      if (profile.skills.length > 1) {
        for (let i = 0; i < createdJob.skills.length; i++) {
          if (profile.skills.includes(createdJob.skills[i]._id)) {
            toRecommend.push(profile.user);
            break;
          }
        }
      }
    });
    const recommendationObj = {
      job: createdJob.id,
      users: toRecommend,
    };
    Recommendation.create(recommendationObj);

    return createJobDTO({ job: createdJob });
  };
};
