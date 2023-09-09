const azCosmosClient = require('../db/az-cosmosdb-client')

const importUserDefinedFunction = async (req, res) => {
  try {
    const { dbName, containerName } = req.body

    await azCosmosClient.importUserDefineFunction(dbName, containerName)

    res.status(201).json({
      message: 'Import UDFs successed!',
      data: {}
    })
  } catch (err) {
    res.status(500).json({
      message: 'Import UDFs failed!',
      error: err
    })
  }
}

const exportUserDefinedFunction = async (req, res) => {
  try {
    const { dbName, containerName } = req.body

    await azCosmosClient.exportUserDefineFunction(dbName, containerName)

    res.status(201).json({
      message: 'Export UDFs successed!',
      data: {}
    })
  } catch (err) {
    res.status(500).json({
      message: 'Export UDFs failed!',
      error: err
    })
  }
}

module.exports = {
  importUserDefinedFunction,
  exportUserDefinedFunction
}
