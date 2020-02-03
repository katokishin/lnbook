exports.getIndexPage = (req, res, next) => {
  res.render('index', {
    title: 'Express',
    session: req.session.passport
  });
}

exports.getLoginPage = (req, res, next) => {
  res.render('login', {
    title: 'Log in',
    session: req.session.passport
  });
}

exports.getFeaturesPage = (req, res, next) => {
  res.render('features', {
    title: 'Features',
    session: req.session.passport
  });
}

exports.getAboutPage = (req, res, next) => {
  res.render('about', {
    title: 'About',
    session: req.session.passport
  });
}

