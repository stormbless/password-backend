const router = require('express').Router();
const { authenticationMiddleware } = require('../middlewares/authentication');
const mondayController = require('../controllers/monday-controller');

router.post('/api/store-password', authenticationMiddleware, mondayController.storePassword);
router.get('/api/get-password', authenticationMiddleware, mondayController.getPassword);
router.get('/api/get-change-history', authenticationMiddleware, mondayController.getChangeHistory);
router.post('/api/delete-account-values', authenticationMiddleware, mondayController.deleteAccountValues);



module.exports = router;