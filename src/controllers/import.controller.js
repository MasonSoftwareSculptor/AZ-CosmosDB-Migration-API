const fs = require('fs')
const path = require('path')
const azCosmosClient = require('../db/az-cosmosdb-client')

const insertDocuments = async (req, res) => {
  try {
    const { dbName, containers } = req.body

    containers.forEach(container => {
      const sourcePath = path.resolve(__dirname, '..', '..', 'dump', 'containers', `${container}.json`)
      const readableStream = fs.createReadStream(sourcePath, 'utf8')
      readableStream.on('error', function (error) {
        console.log(`container ${container} error: ${error.message}`)
      })

      readableStream.on('data', (chunk) => {
        console.log(chunk, typeof chunk)
        const items = JSON.parse(chunk)
        const operations = items.map(item => {
          const operation = {
            operationType: 'Create',
            resourceBody: item
          }
          if (item._partitionKey) {
            operation.partitionKey = item._partitionKey
          }
          return operation
        })
        azCosmosClient.bulk(dbName, container, operations)
      })
    })

    res.status(201).json({
      message: 'Insert documents successed!',
      data: {}
    })
  } catch (err) {
    res.status(500).json({
      message: 'Insert documents failed!',
      error: err
    })
  }
}

module.exports = {
  insertDocuments,
}
