const courseRoute = require("./course.route");

const routes = (app) => {
  app.use("/api/course", courseRoute);
};

module.exports = routes;
