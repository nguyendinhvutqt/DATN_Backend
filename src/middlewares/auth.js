const jwt = require("jsonwebtoken");
require("dotenv").config();

const generalAccessToken = async (payload) => {
  const accessToken = jwt.sign(
    {
      ...payload,
    },
    process.env.ACCESS_TOKEN,
    { expiresIn: "1h" },
    { algorithm: "RS256" }
  );

  return accessToken;
};

const generalRefreshToken = async (payload) => {
  const refreshToken = jwt.sign(
    {
      ...payload,
    },
    process.env.ACCESS_TOKEN,
    { expiresIn: "7d" },
    { algorithm: "RS256" }
  );

  return refreshToken;
};

module.exports = {
  generalAccessToken,
  generalRefreshToken,
};
