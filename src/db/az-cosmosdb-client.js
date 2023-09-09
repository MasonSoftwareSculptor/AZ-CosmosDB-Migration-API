const { CosmosClient } = require('@azure/cosmos')

const key = process.env.COSMOS_KEY
const endpoint = process.env.COSMOS_ENDPOINT

const cosmosClient = new CosmosClient({ endpoint, key })

const createDatabase = async (databaseName) => {
  try {
    const { database } = await cosmosClient.databases.createIfNotExists({
      id: databaseName,
    })
    console.log(`${database.id} database ready`)
    return database.id
  } catch (err) {
    console.log('Create database error: ', err)
    throw err
  }
}

const createContainer = async (databaseName, containerName, partitionKey) => {
  try {
    const { container } = await cosmosClient.database(databaseName).containers.createIfNotExists({
      id: containerName,
      partitionKey: `/${partitionKey}`
    })
    console.log(`${container.id} container ready`)
    return container.id
  } catch (err) {
    console.log('Create container error: ', err)
    throw containerName
  }
}

module.exports = {
  createDatabase,
  createContainer,
}
