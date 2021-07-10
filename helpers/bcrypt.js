const bcrypt = require('bcrypt')
var salt = bcrypt.genSaltSync(10)

function hashPassword(password){
    return bcrypt.hashSync(password, salt)
}

function checkPassword(password, passwordHashed){
    return bcrypt.compareSync(password, passwordHashed)
}

module.exports = {checkPassword, hashPassword}