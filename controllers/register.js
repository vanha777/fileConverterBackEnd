const handleRegister = (bcrypt, dataBase) => (req, res) => {
    const fetchLogin = (req) => {
        bcrypt.hash(req.body.password, null, null, function (err, hash) {
            return new Promise((resolve, reject) => {
                resolve(dataBase('login').insert({
                    email: req.body.email,
                    password: hash
                }))

            });
        });
    };


    const fetchUsers = (req) => {
        return Promise.resolve(dataBase('users').returning("*").insert({
            name: req.body.name,
            email: req.body.email,
            joined: new Date()
        })
        )
    }

    Promise.allSettled([fetchLogin(req), fetchUsers(req)])
        .then(result => {
            res.status(200).send(result)
        })
        .catch(err => {
            res.status(400).json(err)
        });

}

module.exports = {
    handleRegister
}