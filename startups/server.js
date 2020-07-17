require("dotenv").config();

module.exports.start = (app) => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Hey! ${process.env.USERNAME}`);
    console.log(`Server is Listening on Port ${port}...`);
  });
};
