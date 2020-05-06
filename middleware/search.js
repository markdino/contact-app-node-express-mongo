module.exports = (result, req, res, options) => {
  const searched = result.filter(person => {
    const personLC = person.name.toLowerCase();
    const searchLC = req.body.search.toLowerCase();
    return personLC.includes(searchLC);
  });
  if (req.body.search === "") {
    return res.redirect(options.emptyRedirect);
  } else {
    return res.render(options.render, {
      data: searched,
      user: req.user,
      status: options.status
    });
  }
};
