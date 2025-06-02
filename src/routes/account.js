const router = require('express').Router();
const { authenticationMiddleware } = require('../middlewares/authentication');
const accountController = require('../controllers/account-controller');

// TO DO: add additional auth middleware the checks for admin (call monday api?)

router.post('/api/store-account-code', authenticationMiddleware, accountController.storeCode);
router.post('/api/verify-account-code', authenticationMiddleware, accountController.verifyCode);
router.post('/api/delete-account-values', authenticationMiddleware, accountController.deleteAccountValues);




module.exports = router;