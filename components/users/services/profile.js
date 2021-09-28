const { profileDTO } = require('../dtos');
module.exports = function makeProfile({ User }) {
  return async function profile({ httpRequest: { AuthUser } }) {
    let user = await User.findOneProfile({ _id: AuthUser.id });
    return profileDTO(user);
  };
};
