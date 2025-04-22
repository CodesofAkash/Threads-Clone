import express from 'express'
import { sendMessage, getConversations, getMessages } from '../controllers/messageController.js'
import { userAuth } from '../middlewares/userAuthMiddleware.js'

const router = express.Router();

router.post('/', userAuth, sendMessage);
router.get('/conversations', userAuth, getConversations);
router.get('/:otherUserId', userAuth, getMessages);

export default router;