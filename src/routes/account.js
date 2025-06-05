const router = require('express').Router();
const { authenticationMiddleware } = require('../middlewares/authentication');
const accountController = require('../controllers/account-controller');

router.post('/api/store-account-code', authenticationMiddleware, accountController.storeCode);
router.post('/api/verify-account-code', authenticationMiddleware, accountController.verifyCode);
router.post('/api/delete-account-values', authenticationMiddleware, accountController.deleteAccountValues);




module.exports = router;