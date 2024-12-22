const { User } = require('./db/models')

const loginUser = (req, res, user) => {
  req.session.auth = {
    userId: user.id,
  },
    req.session.save(() => {
      res.json({ success: true, user: { id: user.id, email: user.email } })
    })
}

const logoutUser = (req, res) => {
  delete req.session.auth;
  req.session.save(() => res.json({ success: true }))
}
const restoreUser = async (req, res, next) => {

  if (req.session.auth) {
    const { userId } = req.session.auth;

    try {
      const user = await User.findByPk(userId);
      if (user) {
        res.json({ authenticated: true, user });
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
