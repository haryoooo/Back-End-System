const jwt = require("jsonwebtoken");
require("dotenv").config();

function authentication(req, res, next) {
  try {
    const token = req.body.token;

    if (!token) {
      res.status(404).send({ message: "Token Not Found" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, dataToken) => {
      if (err) {
        throw err
      }
      req.dataToken = dataToken
      next()
    });
  } catch (err) {
    res.status(500).send(err);
  }
}

module.exports = authentication;
