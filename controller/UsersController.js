const { checkPassword, hashPassword } = require("../helpers/bcrypt");
const validation = require("../middleware/validation");
const jwt = require("jsonwebtoken");
const db = require("../database/index");
require("dotenv").config();

class UserController {
  static userRegister(req, res) {
    const uid = Date.now();
    const { username, email, password } = req.body;
    const hashedPassword = hashPassword(password);
    const queryInsert = `INSERT INTO users (uid, username,email,password) value ('${uid}','${username}', '${email}', '${hashedPassword}')`;
    const queryShow = `SELECT * FROM users where email= '${email}' or username='${username}' `;
    const showAll = `SELECT * FROM users`;

    if (validation(username, email, password)) {
      db.query(showAll, (error, results) => {
        const datas = results[0];

        if (error) {
          res.status(500).send(error);
          return;
        }

        if (username === datas.username || email === datas.email) {
          res.status(404).send({
            message:
              "Your email or username that you want is already on database",
          });
          return;
        }

        db.query(queryInsert, (error, results) => {
          if (error) {
            res.status(500).send(error);
            return;
          }
        });

        db.query(queryShow, (error, results) => {
          const data = results[0];

          if (error) {
            res.status(500).send(error);
            return;
          }

          const token = jwt.sign(
            {
              uid: data.uid,
              role: data.role,
            },
            process.env.JWT_SECRET
          );
          // console.log(token)
          res.status(200).send({ ...data, token });
        });
      });
    } else {
      res
        .status(404)
        .send({ message: "username or password is not matched requirements" });
    }
  }

  static userLogin(req, res) {
    const token = req.headers.token
    const { username, email, password } = req.body;
    const queryShow = `SELECT * FROM users where email= '${email}' or username='${username}' `;

    db.query(queryShow, (error, results) => {

      if (error) {
        res.status(500).send(error);
        return;
      }

      const data = results[0];

      if (data.status === 2) {
        res
          .status(500)
          .send({ message: "You have to activate your account first" });
        return;
      }

      if (data.status === 3) {
        res.status(500).send({
          message: "Your account is already closed",
        });
        return;
      }

      if(checkPassword(password,data.password)){
        res.status(200).send({ ...data, token });
        return
      }

      res.status(404).send({ message: "Wrong Password" });

    });
  }

  static userDeactive(req, res) {
    const { token } = req.body;

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      const decodedUID = decoded.uid;
      const updateUser = `UPDATE users SET status=${2} WHERE uid=${decodedUID}`;
      const queryShow = `SELECT * FROM users where uid= ${decodedUID}`;
      const joinStatusNotActive = `SELECT
          users.uid,
          status.status
              FROM users
              INNER JOIN status
                ON users.status = status.id
                  WHERE users.uid=${decodedUID}`;

      if (err) {
        res.status(500).send(err);
        return;
      }

      db.query(queryShow, (error, results) => {
        const data = results[0];

        if(error){
            res.status(500).send(error)
            return
        }

        if (data.status === 3) {
          res.status(500).send({ message: "Your account is already closed" });
          return;
        }

        db.query(updateUser, (error, results) => {
          db.query(joinStatusNotActive, (error, results) => {
            if (error) {
              res.status(500).send(error);
              return;
            }

            res.status(200).send(results);
          });
        });
      });
    });
  }

  static userActivate(req, res) {
    const { token } = req.body;

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      const decodedUID = decoded.uid;
      const updateUser = `UPDATE users SET status=${1} WHERE uid=${decodedUID}`;
      const queryShow = `SELECT * FROM users where uid= ${decodedUID}`;
      const joinStatusActive = `SELECT
        users.uid,
        status.status
            FROM users
            INNER JOIN status
              ON users.status = status.id
                WHERE users.uid=${decodedUID}`;

      db.query(queryShow, (error, results) => {
        if(error){
          res.status(500).send(error)
          return
        }

        const data = results[0];

        if (data.status === 3) {
          res.status(500).send({ message: "Your account is already closed" });
          return;
        }

        db.query(updateUser, (error, results) => {
          if(error){
            res.status(500).send(error)
            return
          }

          db.query(joinStatusActive, (error, results) => {
            if (error) {
              res.status(500).send(error);
              return;
            }

            res.status(200).send(results);
          });
        });
      });
    });
  }

  static userClosed(req, res) {
    const { token } = req.body;

    if (!token) {
      res.status(404).send({ message: "Token Not found" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      const decodedUID = decoded.uid;
      const updateUser = `UPDATE users SET status=${3} WHERE uid=${decodedUID}`;
      const joinStatusClose = `SELECT
              users.uid,
              status.status
                  FROM users
                  INNER JOIN status
                    ON users.status = status.id
                      WHERE users.uid=${decodedUID}`;

      if (err) {
        res.status(500).send(err);
        return;
      }

      db.query(updateUser, (error, results) => {
        db.query(joinStatusClose, (error, results) => {
          if (error) {
            res.status(500).send(error);
            return;
          }
          res.status(200).send(results);
        });
      });
    });
  }
}

module.exports = UserController