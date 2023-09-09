const express = require('express')
const router = express.Router()

const { createDatabase } = require('../controllers/database.controller')
const { createContainer } = require('../controllers/container.controller')
const { insertDocuments } = require('../controllers/import.controller')

router.post('/databases', createDatabase)
router.post('/containers', createContainer)
router.post('/import', insertDocuments)

module.exports = router
