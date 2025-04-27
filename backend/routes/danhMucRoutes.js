const express = require('express');
const danhMucController = require('../controllers/danhMucController');

const router = express.Router();

router.get('/', danhMucController.getAllDanhMucs);
router.get('/:id', danhMucController.getDanhMucById);
router.post('/', danhMucController.createDanhMuc);
router.put('/:id', danhMucController.updateDanhMuc);
router.delete('/:id', danhMucController.deleteDanhMuc);

module.exports = router;