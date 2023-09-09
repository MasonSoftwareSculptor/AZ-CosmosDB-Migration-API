const azCosmosClient = require('../db/az-cosmosdb-client')

const createContainer = async (req, res) => {
  try {
    const { dbName, containers } = req.body

    const bulkInsertContainer = containers.map(container => azCosmosClient.createContainer(dbName, container.name, container.partitionKey))
    const results = await Promise.allSettled(bulkInsertContainer)

    res.status(201).json({
      message: 'Create container success!',
      data: {
        dbName,
        successContainers: results.filter(data => data.status === 'fulfilled').map(data => data.value),
        failedContainers: results.filter(data => data.status === 'rejected').map(data => data.reason),
      }
    })
  } catch (err) {
    res.status(500).json({
      message: 'Create container failed!',
      error: err
    })
  }
}

module.exports = {
  createContainer,
}
