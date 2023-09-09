const fs = require('fs')
const path = require('path')
const azCosmosClient = require('../db/az-cosmosdb-client')
const archiver = require('archiver')

const insertDocuments = async (req, res) => {
  try {
    const { dbName, containers } = req.body

    for (const container of containers) {
      console.log(`------ START import documents for container ${container}`)
      const sourcePath = path.resolve(
        __dirname,
        '..',
        '..',
        'dump',
        'containers',
        `${container}.json`
      )

      const documentsJson = fs.readFileSync(sourcePath, 'utf8')
      const items = JSON.parse(documentsJson)
      const bulkDocumentsPromise = []
      while (items.length) {
        const operations = items.splice(0, 100).map((item) => {
          const operation = {
            operationType: 'Create',
            resourceBody: item,
          }
          if (item._partitionKey) {
            operation.partitionKey = item._partitionKey
          }
          return operation
        })
        await azCosmosClient.bulkDocuments(dbName, container, operations)
      }

      await Promise.all(bulkDocumentsPromise)
    }

    res.status(201).json({
      message: 'Insert documents successed!',
      data: {},
    })
  } catch (err) {
    res.status(500).json({
      message: 'Insert documents failed!',
      error: err.message,
    })
  }
}

const exportDocumentsToJson = async (req, res) => {
  try {
    const { dbName } = req.query
    const archive = archiver('zip')
    res.attachment('dump_export.zip')
    archive.pipe(res)

    const containers = await azCosmosClient.readAllContainers(dbName)
    for (const container of containers) {
      const documents = await azCosmosClient.readAllDocuments(dbName, container)
      archive.append(JSON.stringify(documents, null, 4), {
        name: `${container}.json`,
      })
    }

    // Finalize the archive
    archive.finalize()
  } catch (err) {
    res.status(500).json({
      message: 'Export documents failed!',
      error: err,
    })
  }
}

module.exports = {
  insertDocuments,
  exportDocumentsToJson,
}
