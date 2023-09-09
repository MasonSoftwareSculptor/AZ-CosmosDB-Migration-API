const azCosmosClient = require('../db/az-cosmosdb-client')

const createDatabase = async (req, res) => {
  try {
    const { dbName } = req.body
    const database = await azCosmosClient.createDatabase(dbName)
    res.status(201).json({
      message: 'Create databse success!',
      data: {
        dbName: database
      }
    })
  } catch (err) {
    res.status(500).json({
      message: 'Create database failed!',
      error: err
    })
  }
}

module.exports = {
  createDatabase
}
