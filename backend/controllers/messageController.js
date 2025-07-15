import Message from '../models/messageModel.js'
import Conversation from '../models/ConversationModel.js'
import { getRecipientSocketId, io } from '../socket/socket.js';
import {v2 as cloudinary} from 'cloudinary'

export const sendMessage = async (req, res) => {
    try {
        const { message, recipientId } = req.body;
        let { img } = req.body;
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

        if(img) {
              const uploadedResponse = await cloudinary.uploader.upload(img);
              img = uploadedResponse.secure_url;
        }

        const newMessage = await Message.create({
            conversationId: conversation._id,
            sender: senderId,
            text: message || "",
            img: img || ""
        });

        await Conversation.findByIdAndUpdate(conversation._id, {lastMessage: {text: message, sender: senderId} });

        if(!newMessage) {
            return res.status(500).json({error: 'Message creation failed'})
        }

        const recipientSocketId = getRecipientSocketId(recipientId);
        if(recipientSocketId) {
            io.to(recipientSocketId).emit("newMessage", newMessage);
        }

        return res.status(201).json({message: "Message sent successfully", newMessage});

    } catch (error) {
        return res.status(500).json({error: error.message});
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

        conversations.forEach(conversation => {
            conversation.participants = conversation.participants.filter(participant => participant._id.toString() !== userId.toString());
        });

        return res.status(200).json({message: "conversations found successfully", conversations});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

export const getMessages = async (req, res) => {
    const { otherUserId } = req.params;
    const userId = req.user._id;

    try {
        const conversation = await Conversation.findOne({participants: {$all: [otherUserId, userId]}});
        if(!conversation) {
            return res.status(404).json({error: "Conversation not found"});
        }

        const messages = await Message.find({conversationId: conversation._id}).sort({createdAt: 1});

        return res.status(200).json({message: "Messages Found", messages});

    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}