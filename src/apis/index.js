const express = require('express')
const router = express.Router()
const archiver = require('archiver')

const { createDatabase } = require('../controllers/database.controller')
const { createContainer } = require('../controllers/container.controller')
const {
  insertDocuments,
  exportDocumentsToJson,
} = require('../controllers/document.controller')
const {
  importUserDefinedFunction,
  exportUserDefinedFunction,
} = require('../controllers/udf.controller')

router.post('/databases', createDatabase)
router.post('/containers', createContainer)
router.post('/documents/import', insertDocuments)
router.get('/documents/export', exportDocumentsToJson)
router.post('/export-udf', exportUserDefinedFunction)
router.post('/import-udf', importUserDefinedFunction)

module.exports = router
