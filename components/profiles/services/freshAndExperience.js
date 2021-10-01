module.exports = function makeFreshAndExperience({ Profile }) {
  return async function freshAndExperience({ httpRequest: { query } }) {
    let users = await Profile.findFreshAndExperience({ query });
    return users;
  };
};
