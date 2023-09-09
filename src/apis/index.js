const express = require('express')
const router = express.Router()

const { createDatabase } = require('../controllers/database.controller')
const { createContainer } = require('../controllers/container.controller')

router.post('/databases', createDatabase)
router.post('/containers', createContainer)

module.exports = router
