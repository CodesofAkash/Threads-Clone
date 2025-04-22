import Message from '../models/messageModel.js'
import Conversation from '../models/ConversationModel.js'

export const sendMessage = async (req, res) => {
    try {
        const { message, recipientId } = req.body;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: {$all: [senderId, recipientId]}
        });

        if(!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, recipientId],
                lastMessage: {
                    text: message,
                    sender: senderId
                }
            })
        }

        const newMessage = await Message.create({
            conversationId: conversation._id,
            sender: senderId,
            text: message
        });

        conversation = await Conversation.findByIdAndUpdate(conversation._id, {lastMessage: {text: message, sender: senderId} }, {new: true});

        if(!newMessage) {
            return res.status(500).json({error: 'Message '})
        }

        res.status(201).json({message: "Message sent successfully", newMessage, conversation});

    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const getConversations = async (req, res) => {
    try {
        const userId = req.user._id;
        const conversations = await Conversation.find({participants: userId}).populate({
            path: "participants",
            select: "username profilePic"
        }).sort({ updatedAt: -1 });
        if(!conversations) {
            return res.status(500).json({error: "User has no conversations."});
        }

        res.status(200).json({message: "conversations found successfully", conversations});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const getMessages = async (req, res) => {
    const { otherUserId } = req.params;
    const userId = req.user._id;

    try {
        const conversation = await Conversation.findOne({participants: {$all: [otherUserId, userId]}});
        if(!conversation) {
            return res.staus(404).json({error: "Conversation not found"});
        }

        const messages = await Message.find({conversationId: conversation._id}).sort({createdAt: 1});
        if(!messages) {
            return res.staus(500).json({error: "Users have no messages"});
        }

        res.status(200).json({message: "Messages Found", messages});

    } catch (error) {
        res.status(500).json({error: error.message});
    }
}