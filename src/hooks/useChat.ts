"use client";

import { useEffect, useState, useCallback } from "react";
import { useSocket } from "@/contexts/SocketContext";

export interface Message {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  content: string;
  messageType: "TEXT" | "IMAGE" | "FILE" | "VIDEO" | "AUDIO";
  attachmentUrl?: string;
  attachmentName?: string;
  replyToId?: string;
  threadId?: string;
  mentions: string[];
  isEdited: boolean;
  isDeleted: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  reactions?: MessageReaction[];
  readReceipts?: ReadReceipt[];
}

export interface MessageReaction {
  id: string;
  messageId: string;
  userId: string;
  emoji: string;
  createdAt: string;
}

export interface ReadReceipt {
  id: string;
  messageId: string;
  userId: string;
  readAt: string;
}

export interface TypingUser {
  userId: string;
  email: string;
}

export function useChat(channelId: string | null) {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Send a message
  const sendMessage = useCallback(
    (
      content: string,
      messageType: "TEXT" | "IMAGE" | "FILE" | "VIDEO" | "AUDIO" = "TEXT",
      attachmentUrl?: string,
      attachmentName?: string,
      mentions?: string[],
      replyToId?: string,
      threadId?: string,
    ) => {
      if (!socket || !channelId) return;

      socket.emit("message:send", {
        channelId,
        content,
        messageType,
        attachmentUrl,
        attachmentName,
        replyToId,
        threadId,
        mentions,
      });
    },
    [socket, channelId],
  );

  // Start typing indicator
  const startTyping = useCallback(() => {
    if (!socket || !channelId) return;
    socket.emit("user:typing", { channelId });
  }, [socket, channelId]);

  // Stop typing indicator
  const stopTyping = useCallback(() => {
    if (!socket || !channelId) return;
    socket.emit("user:stopTyping", { channelId });
  }, [socket, channelId]);

  // Add reaction
  const addReaction = useCallback(
    (messageId: string, emoji: string) => {
      if (!socket || !channelId) return;
      socket.emit("message:react", { messageId, emoji, channelId });
    },
    [socket, channelId],
  );

  // Remove reaction
  const removeReaction = useCallback(
    (messageId: string, emoji: string) => {
      if (!socket || !channelId) return;
      socket.emit("message:unreact", { messageId, emoji, channelId });
    },
    [socket, channelId],
  );

  // Edit message
  const editMessage = useCallback(
    (messageId: string, content: string) => {
      if (!socket || !channelId) return;
      socket.emit("message:edit", { messageId, content, channelId });
    },
    [socket, channelId],
  );

  // Delete message
  const deleteMessage = useCallback(
    (messageId: string) => {
      if (!socket || !channelId) return;
      socket.emit("message:delete", { messageId, channelId });
    },
    [socket, channelId],
  );

  // Mark channel as read
  const markAsRead = useCallback(() => {
    if (!socket || !channelId) return;
    socket.emit("channel:markRead", { channelId });
  }, [socket, channelId]);

  // Load messages from API
  const loadMessages = useCallback(async () => {
    if (!channelId) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:8089/api/v1/chat/channels/${channelId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setMessages(data.data || []);
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setIsLoading(false);
    }
  }, [channelId]);

  // Socket event listeners
  useEffect(() => {
    if (!socket || !channelId) return;

    // Join the channel
    socket.emit("channel:join", channelId);

    // Listen for new messages
    const handleNewMessage = (data: {
      channelId: string;
      message: Message;
    }) => {
      if (data.channelId === channelId) {
        setMessages((prev) => [...prev, data.message]);
      }
    };

    // Listen for edited messages
    const handleEditedMessage = (data: {
      channelId: string;
      message: Message;
    }) => {
      if (data.channelId === channelId) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === data.message.id ? data.message : msg)),
        );
      }
    };

    // Listen for deleted messages
    const handleDeletedMessage = (data: {
      channelId: string;
      messageId: string;
    }) => {
      if (data.channelId === channelId) {
        setMessages((prev) => prev.filter((msg) => msg.id !== data.messageId));
      }
    };

    // Listen for typing indicators
    const handleUserTyping = (data: {
      channelId: string;
      userId: string;
      email: string;
    }) => {
      if (data.channelId === channelId) {
        setTypingUsers((prev) => {
          const exists = prev.some((u) => u.userId === data.userId);
          if (!exists) {
            return [...prev, { userId: data.userId, email: data.email }];
          }
          return prev;
        });
      }
    };

    const handleUserStopTyping = (data: {
      channelId: string;
      userId: string;
    }) => {
      if (data.channelId === channelId) {
        setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId));
      }
    };

    // Listen for reactions
    const handleReaction = (data: {
      messageId: string;
      reaction: MessageReaction;
    }) => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === data.messageId) {
            return {
              ...msg,
              reactions: [...(msg.reactions || []), data.reaction],
            };
          }
          return msg;
        }),
      );
    };

    socket.on("message:new", handleNewMessage);
    socket.on("message:edited", handleEditedMessage);
    socket.on("message:deleted", handleDeletedMessage);
    socket.on("user:typing", handleUserTyping);
    socket.on("user:stopTyping", handleUserStopTyping);
    socket.on("message:reaction", handleReaction);

    // Load initial messages
    loadMessages();

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("message:edited", handleEditedMessage);
      socket.off("message:deleted", handleDeletedMessage);
      socket.off("user:typing", handleUserTyping);
      socket.off("user:stopTyping", handleUserStopTyping);
      socket.off("message:reaction", handleReaction);
      socket.emit("channel:leave", channelId);
    };
  }, [socket, channelId, loadMessages]);

  return {
    messages,
    typingUsers,
    isLoading,
    isConnected,
    sendMessage,
    startTyping,
    stopTyping,
    addReaction,
    removeReaction,
    editMessage,
    deleteMessage,
    markAsRead,
    loadMessages,
  };
}
