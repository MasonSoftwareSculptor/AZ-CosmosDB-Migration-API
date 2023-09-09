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
    const { container } = await cosmosClient
      .database(databaseName)
      .containers.createIfNotExists({
        id: containerName,
        partitionKey: `/${partitionKey}`,
      })
    console.log(`${container.id} container ready`)
    return container.id
  } catch (err) {
    console.log('Create container error: ', err)
    throw containerName
  }
}

const bulkDocuments = async (databaseName, containerName, operations) => {
  try {
    await cosmosClient
      .database(databaseName)
      .container(containerName)
      .items.bulk(operations)
    return containerName
  } catch (err) {
    console.log(`Insert document for container ${containerName} error: `, err)
    throw containerName
  }
}

const readAllDocuments = async (databaseName, containerName) => {
  try {
    const querySpec = {
      query: 'SELECT * FROM c ORDER BY c._ts DESC OFFSET 0 LIMIT 200',
    }
    const { resources } = await cosmosClient
      .database(databaseName)
      .container(containerName)
      .items.query(querySpec)
      .fetchAll()
    return resources
  } catch (err) {
    console.log('Get container ${containerName} items failed! ', err.message)
    throw err
  }
}

const importUserDefineFunction = async (databaseName, containerName, udf) => {
  try {
    await cosmosClient
      .database(databaseName)
      .container(containerName)
      .scripts.userDefinedFunctions.create(udf)
    return containerName
  } catch (err) {
    console.log(`Insert document for container ${containerName} error: `, err)
    throw containerName
  }
}

const exportUserDefineFunction = async (databaseName, containerName) => {
  const { resources } = await cosmosClient
    .database(databaseName)
    .container(containerName)
    .scripts.userDefinedFunctions.readAll()
    .fetchAll()
  return resources.map((resource) => ({
    id: resource.id,
    body: resource.body,
  }))
}

const readAllContainers = async (databaseName) => {
  try {
    const { resources } = await cosmosClient
      .database(databaseName)
      .containers.readAll()
      .fetchAll()
    return resources.map((resource) => resource.id)
  } catch (err) {
    console.log('Read all container error: ', err)
    throw err
  }
}

module.exports = {
  createDatabase,
  createContainer,
  bulkDocuments,
  importUserDefineFunction,
  exportUserDefineFunction,
  readAllDocuments,
  readAllContainers,
}
