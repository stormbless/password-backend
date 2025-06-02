const router = require('express').Router();
const itemRoutes = require('./item');
const accountRoutes = require('./account');


router.use(itemRoutes);
router.use(accountRoutes);

router.get('/', function (req, res) {
  res.json(getHealth());
});

router.get('/health', function (req, res) {
  res.json(getHealth());
  res.end();
});

function getHealth() {
  return {
    ok: true,
    message: 'Healthy',
  };
}

module.exports = router;
