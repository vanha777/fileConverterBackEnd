const imagesCount = (dataBase) => (req, res) => {
    const { id } = req.body;
    dataBase('users').where("id", "=", id).increment({ entries: 1 }).returning('entries')
        .then(entries => res.json(entries))
        .catch(err => res.status(400).json(err))
}


module.exports = {
    imagesCount
}