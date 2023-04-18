const handleSignin = (bcrypt,dataBase) =>(req,res) => {

    const checkEmail = (inputEmail) => {
        return new Promise((resolve, reject) => {
            dataBase('login').where("email", inputEmail).select('*')
                .then(result => {
                    if (result.length == 0) {
                        reject("Email invalid");
                    } else if (result.length > 0) {
                        resolve(dataBase('login').where("email", inputEmail).select('*'));
                    }
                })
                .catch(err => {
                    reject("Cannot Check Email");
                })
        })
    }

    const checkPass = (dataPass, inputPass) => {
        return new Promise((resolve, reject) => {
            bcrypt.compare(inputPass, dataPass, function (err, result) {
                if (err) {
                    reject("Cannot Check Password");
                } else if (result) {
                    dataBase('users').where({ email: req.body.email }).select('*')
                        .then(result => {
                            resolve(result[0])
                        })
                } else {
                    reject("Password Invalid");
                }
            })
        })
    }


    checkEmail(req.body.email).then(result => checkPass(result[0].password, req.body.password))
        .then(result => res.status(200).send(result))
        .catch(err => res.status(400).json(err))

}

module.exports = {
    handleSignin
}