const router = require('express').Router();
const { authenticationMiddleware } = require('../middlewares/authentication');
const accountController = require('../controllers/item-controller');

router.post('/api/delete-account-values', authenticationMiddleware, accountController.deleteAccountValues);



module.exports = router;