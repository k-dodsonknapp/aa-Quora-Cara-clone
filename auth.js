const { User } = require('./db/models')

const loginUser = async (req, res, user) => {
  req.session.auth = {
    userId: user.id,
  },
    await req.session.save()
}

const logoutUser = async (req, res) => {
  delete req.session.auth;
  await req.session.save()
  res.clearCookie('connect.sid')
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
    csrfToken: req.csrfToken()
  });
}
const restoreUser = async (req, res, next) => {

  if (req.session.auth) {
    const { userId } = req.session.auth;

    try {
      const user = await User.findByPk(userId);
      if (user) {
        res.json({ authenticated: true, user: { id: user.id, email: user.email, username: user.username }, });
      } else {
        res.json({ authenticated: false });
      }
    } catch (err) {
      next(err);
    }
  } else {
    res.locals.authenticated = false;
    next();
  }
};

const requireAuth = (req, res, next) => {
  if (!res.locals.authenticated) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return next();
};


module.exports = { loginUser, restoreUser, logoutUser, requireAuth }
