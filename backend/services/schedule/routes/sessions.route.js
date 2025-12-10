const express = require('express');
const controller = require('../controllers/sessions.controller');
const { validate } = require('../../shared/validate');
const { createSessionSchema, updateSessionSchema } = require('../validators/session.schema');

const router = express.Router();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', validate(createSessionSchema), controller.create);
router.put('/:id', validate(updateSessionSchema), controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
