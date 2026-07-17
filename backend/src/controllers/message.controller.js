import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { dbOperationDuration, messagesSent, activeChatRooms, activeConversationIds } from "../lib/metrics.js";
import logger from "../lib/logger.js";

export const getUsersForSidebar = async (req, res) => {
  const start = Date.now();
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    dbOperationDuration.observe({ operation: "getUsersForSidebar" }, (Date.now() - start) / 1000);
    res.status(200).json(filteredUsers);
  } catch (error) {
    logger.error("Error in getUsersForSidebar", {
      event: "get_users_for_sidebar_error",
      status: "error",
      userId: req.user?._id,
      error: error.message,
      stack: error.stack,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  const start = Date.now();
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    dbOperationDuration.observe({ operation: "getMessages" }, (Date.now() - start) / 1000);
    res.status(200).json(messages);
  } catch (error) {
    logger.error("Error in getMessages controller", {
      event: "get_messages_error",
      status: "error",
      userId: req.user?._id,
      userToChatId: req.params.id,
      error: error.message,
      stack: error.stack,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  const start = Date.now();
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    messagesSent.inc();
    dbOperationDuration.observe({ operation: "sendMessage" }, (Date.now() - start) / 1000);

    const conversationId = [senderId, receiverId].sort().join("-");
    if (!activeConversationIds.has(conversationId)) {
      activeConversationIds.add(conversationId);
      activeChatRooms.set(activeConversationIds.size);
    }

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);

      logger.info("Message sent", {
        event: "message_sent",
        status: "success",
        senderId,
        senderFullName: req.user?.fullName,
        senderEmail: req.user?.email,
        receiverId,
        messageId: newMessage._id,
        hasImage: Boolean(imageUrl),
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });
    }

    res.status(201).json(newMessage);
  } catch (error) {
    logger.error("Error in sendMessage controller", {
      event: "send_message_error",
      status: "error",
      senderId: req.user?._id,
      receiverId: req.params.id,
      error: error.message,
      stack: error.stack,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(500).json({ error: "Internal server error" });
  }
};
