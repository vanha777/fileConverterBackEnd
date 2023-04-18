const getUser = (dataBase) => (req, res) => {
    const { id } = req.params;
    dataBase('users').where("id", id).select('*')
        .then(userInfo => res.json(userInfo))
        .catch(err => res.status(400).json(err))
}


module.exports = {
    getUser
}