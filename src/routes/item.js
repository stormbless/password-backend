const router = require('express').Router();
const { authenticationMiddleware } = require('../middlewares/authentication');
const itemController = require('../controllers/item-controller');

router.post('/api/store-password', authenticationMiddleware, itemController.storePassword);
router.get('/api/get-password', authenticationMiddleware, itemController.getPassword);
router.get('/api/get-change-history', authenticationMiddleware, itemController.getChangeHistory);

router.post('/api/delete-account-values', authenticationMiddleware, accountController.deleteAccountValues);




module.exports = router;