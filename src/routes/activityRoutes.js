const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const authMiddleware = require('../middlewares/auth');


router.post('/add', authMiddleware, activityController.addActivity);

router.get('/report', authMiddleware, activityController.getActivities);
router.post('/sync-steps', authMiddleware, activityController.syncSteps);

module.exports = router;