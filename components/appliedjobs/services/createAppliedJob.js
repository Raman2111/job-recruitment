const { createAppliedJobDTO } = require('../dtos');
const { Mail } = require('../../../utils/mailer');
module.exports = function makeCreateAppliedJob({ AppliedJob, Job, User }) {
  return async function createAppliedJob({ httpRequest: { body, user } }) {
    let isJobApplied = await AppliedJob.findOne({ job: body.jobId, user: user.id });
    if (isJobApplied?.user) {
      throw { error: 'You have already applied for this Job' };
    }

    const currentUser = await User.findOne({ _id: user.id });
    if (currentUser.credit < 0) {
      throw { error: 'You have not enough credit left to apply this job.' };
    }
    User.findByIdAndUpdate({
      id: currentUser._id,
      updateUser: { ...currentUser, credit: currentUser.credit - 1 },
    });

    const newAppliedJob = {
      user: user.id,
      job: body.jobId,
    };
    let createdAppliedJob = await AppliedJob.create(newAppliedJob);
    let job = await Job.findOne({ _id: body.jobId });
    let upjob = await Job.findByIdAndUpdate({
      id: body.jobId,
      updateJob: { total_applicants: parseInt(job.total_applicants) + 1 },
    });

    Mail({
      to: job.company.email,
      subject: 'New Job Application',
      text: 'You have received a new job application for ' + job.title,
    });
    return createAppliedJobDTO({ appliedjob: createdAppliedJob });
  };
};
