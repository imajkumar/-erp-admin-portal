"use client";

import {
  Hash,
  Lock,
  MoreVertical,
  Paperclip,
  Phone,
  Search,
  Send,
  Settings,
  Smile,
  Users,
  Video,
  X,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  PhoneOff,
  PhoneCall,
  Plus,
  Check,
  CheckCheck,
  ImageIcon,
  Film,
  Music,
  FileText,
  MessageSquare,
  Download,
  Reply,
  Copy,
  Edit,
  Trash2,
  Star,
  Pin,
  Forward,
  MoreHorizontal,
  AtSign,
  Flag,
  Clock,
  CheckCircle,
  ChevronDown,
} from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useSocket } from "@/contexts/SocketContext";
import { useChat } from "@/hooks/useChat";

interface Message {
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
  mentions?: string[];
  isEdited: boolean;
  isDeleted: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  readReceipts?: any[];
}

interface Channel {
  id: string;
  teamId?: string;
  name: string;
  description?: string;
  type: "STANDARD" | "DIRECT" | "PRIVATE" | "ANNOUNCEMENT";
  isPrivate: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  members?: any[];
  team?: any;
  messages?: Message[];
}

interface Team {
  id: string;
  name: string;
  description?: string;
  avatarUrl?: string;
  createdBy: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  members?: any[];
  channels?: Channel[];
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function MessengerPage() {
  const { socket, isConnected } = useSocket();
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const { messages, typingUsers, sendMessage, isLoading } = useChat(
    currentChannel?.id || null,
  );

  const [messageInput, setMessageInput] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File sharing state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Reply state
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Emoji picker state
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Attachment menu state
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

  // Message dropdown state
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showMessageDropdown, setShowMessageDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [editText, setEditText] = useState("");

  // Pinned messages state
  const [pinnedMessages, setPinnedMessages] = useState<Message[]>([]);
  const [showPinnedMessages, setShowPinnedMessages] = useState(false);

  // Tag functionality state
  const [showTagModal, setShowTagModal] = useState(false);
  const [taggedUsers, setTaggedUsers] = useState<User[]>([]);
  const [tagInput, setTagInput] = useState("");

  // User list state
  const [showUserList, setShowUserList] = useState(true);
  const [userLastMessages, setUserLastMessages] = useState<
    Record<string, Message>
  >({});

  // Channel creation state
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [channelDescription, setChannelDescription] = useState("");
  const [channelType, setChannelType] = useState<"STANDARD" | "PRIVATE">(
    "STANDARD",
  );
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    messages: any[];
    users: any[];
  }>({ messages: [], users: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Video call state
  const [isInCall, setIsInCall] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callType, setCallType] = useState<"video" | "audio" | null>(null);
  const [callStatus, setCallStatus] = useState<
    "idle" | "calling" | "ringing" | "connected" | "ended"
  >("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [callerId, setCallerId] = useState<string | null>(null);
  const [callerName, setCallerName] = useState<string>("");

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  // Load current user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMessageDropdown) {
        setShowMessageDropdown(false);
      }
      if (showEmojiPicker) {
        setShowEmojiPicker(false);
      }
      if (showAttachmentMenu) {
        setShowAttachmentMenu(false);
      }
      if (showUserList) {
        // Don't close user list on outside click, it should stay open
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMessageDropdown, showEmojiPicker, showAttachmentMenu, showUserList]);

  // Set user as online when socket connects
  useEffect(() => {
    if (socket && currentUser) {
      // Set current user as online
      setOnlineUsers((prev) => new Set([...prev, currentUser.email]));

      // Notify others that this user is online
      socket.emit("user:presence", {
        userId: currentUser.email,
        status: "ONLINE",
      });
    }
  }, [socket, currentUser]);

  // Load teams and channels
  const loadTeamsAndChannels = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      // Load teams
      const teamsResponse = await fetch(
        "http://localhost:8089/api/v1/chat/teams",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (teamsResponse.ok) {
        const teamsData = await teamsResponse.json();
        setTeams(teamsData.data || []);
      }

      // Load channels (including direct messages)
      const channelsResponse = await fetch(
        "http://localhost:8089/api/v1/chat/channels",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (channelsResponse.ok) {
        const channelsData = await channelsResponse.json();
        setChannels(channelsData.data || []);
      }
    } catch (error) {
      console.error("Failed to load teams/channels:", error);
    }
  }, []);

  useEffect(() => {
    loadTeamsAndChannels();
  }, [loadTeamsAndChannels]);

  // Listen for user presence updates
  useEffect(() => {
    if (!socket) return;

    const handleUserPresence = (data: { userId: string; status: string }) => {
      setOnlineUsers((prev) => {
        const newSet = new Set(prev);
        if (data.status === "ONLINE") {
          newSet.add(data.userId);
        } else {
          newSet.delete(data.userId);
        }
        return newSet;
      });
    };

    socket.on("user:presence", handleUserPresence);

    return () => {
      socket.off("user:presence", handleUserPresence);
    };
  }, [socket]);

  // Load users for channel creation
  const loadUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const response = await fetch("http://localhost:8060/api/v1/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setAvailableUsers(data.data || []);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [messageInput]);

  // Handle typing indicator
  useEffect(() => {
    if (!socket || !currentChannel) return;

    let typingTimeout: NodeJS.Timeout;

    const handleTyping = () => {
      socket.emit("user:typing", { channelId: currentChannel.id });

      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        socket.emit("user:stopTyping", { channelId: currentChannel.id });
      }, 3000);
    };

    if (messageInput) {
      handleTyping();
    }

    return () => {
      clearTimeout(typingTimeout);
    };
  }, [messageInput, socket, currentChannel]);

  const handleSendMessage = useCallback(async () => {
    if ((!messageInput.trim() && !selectedFile) || !currentChannel) return;

    try {
      if (selectedFile) {
        // Upload file first
        const formData = new FormData();
        formData.append("file", selectedFile);

        const token = localStorage.getItem("accessToken");
        const uploadResponse = await fetch(
          "http://localhost:8089/api/v1/chat/upload",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          },
        );

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          const fileUrl = uploadData.data.url;
          const fileName = uploadData.data.filename;

          // Determine message type based on file
          let messageType: "IMAGE" | "FILE" | "VIDEO" | "AUDIO" = "FILE";
          if (selectedFile.type.startsWith("image/")) {
            messageType = "IMAGE";
          } else if (selectedFile.type.startsWith("video/")) {
            messageType = "VIDEO";
          } else if (selectedFile.type.startsWith("audio/")) {
            messageType = "AUDIO";
          }

          sendMessage(
            messageInput.trim() || fileName,
            messageType,
            fileUrl,
            fileName,
            [],
            replyingTo?.id,
          );

          // Reset file state
          setSelectedFile(null);
          setPreviewUrl(null);
          setUploadProgress(0);
        }
      } else {
        // Send text message
        sendMessage(
          messageInput.trim(),
          "TEXT",
          undefined,
          undefined,
          [],
          replyingTo?.id,
        );
      }

      setMessageInput("");
      setReplyingTo(null);

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }, [messageInput, selectedFile, currentChannel, sendMessage, replyingTo]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Voice recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Failed to start recording:", error);
      alert(
        "Could not access microphone. Please allow microphone permissions.",
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
    setAudioBlob(null);
    setRecordingTime(0);
    audioChunksRef.current = [];
  };

  const sendVoiceMessage = async () => {
    if (!audioBlob || !currentChannel) return;

    try {
      // Create a File from the Blob
      const audioFile = new File([audioBlob], `voice-${Date.now()}.webm`, {
        type: "audio/webm",
      });

      // Upload the audio file
      const formData = new FormData();
      formData.append("file", audioFile);

      const token = localStorage.getItem("accessToken");
      const uploadResponse = await fetch(
        "http://localhost:8089/api/v1/chat/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (uploadResponse.ok) {
        const data = await uploadResponse.json();
        await sendMessage(
          "Voice message",
          "AUDIO",
          data.data.url,
          audioFile.name,
        );
        setAudioBlob(null);
        setRecordingTime(0);
      }
    } catch (error) {
      console.error("Failed to send voice message:", error);
    }
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const insertEmoji = (emoji: string) => {
    setMessageInput((prev) => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  // Render message content with mentions
  const renderMessageContent = (content: string, mentions?: string[]) => {
    if (!mentions || mentions.length === 0) {
      return <span>{content}</span>;
    }

    let parts = content;
    mentions.forEach((mention, index) => {
      const regex = new RegExp(`@${mention}`, "gi");
      parts = parts.replace(regex, `__MENTION_${index}__`);
    });

    return parts.split(/(__MENTION_\d+__)/).map((part, index) => {
      const mentionMatch = part.match(/__MENTION_(\d+)__/);
      if (mentionMatch) {
        const mentionIndex = parseInt(mentionMatch[1]);
        const mention = mentions[mentionIndex];
        return (
          <span key={index} className="text-green-500 font-medium">
            @{mention}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  // Message dropdown functions
  const handleMessageClick = (message: Message, event: React.MouseEvent) => {
    event.preventDefault();
    setSelectedMessage(message);
    setDropdownPosition({ x: event.clientX, y: event.clientY });
    setShowMessageDropdown(true);
  };

  const handleCopyMessage = (message: Message) => {
    navigator.clipboard.writeText(message.content);
    setShowMessageDropdown(false);
    // You could add a toast notification here
  };

  const handleReplyToMessage = (message: Message) => {
    setReplyingTo(message);
    setShowMessageDropdown(false);
    textareaRef.current?.focus();
  };

  const handleEditMessage = (message: Message) => {
    setEditingMessage(message);
    setEditText(message.content);
    setShowMessageDropdown(false);
  };

  const handleSaveEdit = async () => {
    if (!editingMessage || !editText.trim()) return;

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `http://localhost:8089/api/v1/chat/messages/${editingMessage.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: editText.trim() }),
        },
      );

      if (response.ok) {
        setEditingMessage(null);
        setEditText("");
        // Refresh messages or update in real-time
      }
    } catch (error) {
      console.error("Failed to edit message:", error);
    }
  };

  const handleDeleteMessage = async (message: Message) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `http://localhost:8089/api/v1/chat/messages/${message.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        setShowMessageDropdown(false);
        // Refresh messages or update in real-time
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const handleForwardMessage = (message: Message) => {
    // Implement forward functionality
    setShowMessageDropdown(false);
    // You could open a forward modal here
  };

  const handleStarMessage = (message: Message) => {
    // Implement star functionality
    setShowMessageDropdown(false);
  };

  const handlePinMessage = async (message: Message) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `http://localhost:8089/api/v1/chat/messages/${message.id}/pin`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        setPinnedMessages((prev) => [...prev, message]);
        setShowMessageDropdown(false);
      }
    } catch (error) {
      console.error("Failed to pin message:", error);
    }
  };

  const handleUnpinMessage = async (message: Message) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `http://localhost:8089/api/v1/chat/messages/${message.id}/unpin`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        setPinnedMessages((prev) => prev.filter((m) => m.id !== message.id));
      }
    } catch (error) {
      console.error("Failed to unpin message:", error);
    }
  };

  const handleTagUser = (message: Message) => {
    setSelectedMessage(message);
    setShowTagModal(true);
    setShowMessageDropdown(false);
  };

  const handleTagSubmit = async () => {
    if (!selectedMessage || taggedUsers.length === 0) return;

    try {
      const token = localStorage.getItem("accessToken");
      const mentions = taggedUsers.map((user) => user.email);

      const response = await fetch(
        `http://localhost:8089/api/v1/chat/messages/${selectedMessage.id}/tag`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mentions }),
        },
      );

      if (response.ok) {
        setShowTagModal(false);
        setTaggedUsers([]);
        setTagInput("");
      }
    } catch (error) {
      console.error("Failed to tag users:", error);
    }
  };

  const handleReportMessage = (message: Message) => {
    // Implement report functionality
    setShowMessageDropdown(false);
  };

  const handleCreateChannel = useCallback(async () => {
    if (!channelName.trim()) return;

    setIsCreating(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        "http://localhost:8089/api/v1/chat/channels",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            teamId: selectedTeam || null,
            name: channelName,
            description: channelDescription,
            type: channelType,
            isPrivate: channelType === "PRIVATE",
            members: selectedUsers,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        // Reload channels
        await loadTeamsAndChannels();
        // Reset form
        setShowCreateChannel(false);
        setChannelName("");
        setChannelDescription("");
        setChannelType("STANDARD");
        setSelectedTeam("");
        setSelectedUsers([]);
        // Select the new channel
        setCurrentChannel(data.data);
      }
    } catch (error) {
      console.error("Failed to create channel:", error);
    } finally {
      setIsCreating(false);
    }
  }, [
    channelName,
    channelDescription,
    channelType,
    selectedTeam,
    selectedUsers,
    loadTeamsAndChannels,
  ]);

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  // Load all users for display (excluding current user)
  const loadAllUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:8060/api/v1/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        // Filter out current user from results
        const filteredUsers = (data.data || []).filter(
          (user: User) => user.email !== currentUser?.email,
        );
        setAvailableUsers(data.data || []);
        setSearchResults({
          messages: [],
          users: filteredUsers,
        });
        setShowSearchResults(true);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  }, [currentUser?.email]);

  // Load users when component mounts
  useEffect(() => {
    loadAllUsers();
  }, [loadAllUsers]);

  // Function to get last message for a user
  const getLastMessageForUser = useCallback(
    (userEmail: string) => {
      // Find all direct message channels with this user
      const userChannels = channels.filter(
        (channel) =>
          channel.type === "DIRECT" &&
          channel.members?.some((member: any) => member.userId === userEmail),
      );

      if (userChannels.length === 0) return null;

      // Get all messages from these channels
      const allUserMessages = messages.filter((message) =>
        userChannels.some((channel) => channel.id === message.channelId),
      );

      if (allUserMessages.length === 0) return null;

      // Sort by creation date and get the latest
      return allUserMessages.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )[0];
    },
    [channels, messages],
  );

  // Update last messages when messages or channels change
  useEffect(() => {
    const lastMessages: Record<string, Message> = {};
    availableUsers.forEach((user) => {
      if (user.email !== currentUser?.email) {
        const lastMessage = getLastMessageForUser(user.email);
        if (lastMessage) {
          lastMessages[user.email] = lastMessage;
        }
      }
    });
    setUserLastMessages(lastMessages);
  }, [availableUsers, getLastMessageForUser, currentUser?.email]);

  // Search functionality with debounce
  const handleSearch = useCallback(
    async (query: string) => {
      setSearchQuery(query);

      // Show all users when search is focused or has minimal input
      if (!query.trim()) {
        setSearchResults({ messages: [], users: [] });
        setShowSearchResults(false);
        return;
      }

      setIsSearching(true);
      setShowSearchResults(true);

      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Debounce search
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const token = localStorage.getItem("accessToken");

          // Search messages (only if query is 2+ characters)
          let messagesData = { data: [] };
          if (query.trim().length >= 2) {
            const messagesResponse = await fetch(
              `http://localhost:8089/api/v1/chat/search/messages?q=${encodeURIComponent(query)}`,
              { headers: { Authorization: `Bearer ${token}` } },
            );
            messagesData = messagesResponse.ok
              ? await messagesResponse.json()
              : { data: [] };
          }

          // Search users (always search, even with 1 character)
          const usersResponse = await fetch(
            `http://localhost:8060/api/v1/users/search?name=${encodeURIComponent(query)}`,
            { headers: { Authorization: `Bearer ${token}` } },
          );

          const usersData = usersResponse.ok
            ? await usersResponse.json()
            : { data: [] };

          // Filter out current user from search results
          const filteredUsers = (usersData.data || []).filter(
            (user: User) => user.email !== currentUser?.email,
          );

          setSearchResults({
            messages: messagesData.data || [],
            users: filteredUsers,
          });
        } catch (error) {
          console.error("Search failed:", error);
        } finally {
          setIsSearching(false);
        }
      }, 300);
    },
    [currentUser?.email],
  );

  const handleUserClick = async (user: User) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        "http://localhost:8089/api/v1/chat/channels/direct",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.email }), // Use email as userId for chat service
        },
      );

      if (response.ok) {
        const data = await response.json();
        setCurrentChannel(data.data);
        setShowSearchResults(false);
        setSearchQuery("");
        await loadTeamsAndChannels();
      }
    } catch (error) {
      console.error("Failed to create/open DM:", error);
    }
  };

  // ============ VIDEO CALL FUNCTIONS ============

  // Initialize WebRTC peer connection
  const initializePeerConnection = useCallback(() => {
    const configuration = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    };

    const peerConnection = new RTCPeerConnection(configuration);

    // Handle incoming remote stream
    peerConnection.ontrack = (event) => {
      console.log("Received remote stream:", event.streams[0]);
      const remoteStream = event.streams[0];
      setRemoteStream(remoteStream);

      // Set srcObject immediately and also in a timeout to ensure it's set
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current
          .play()
          .catch((e) => console.error("Error playing remote video:", e));
      }
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit("call:ice-candidate", {
          candidate: event.candidate,
          targetUserId: callerId,
        });
      }
    };

    peerConnectionRef.current = peerConnection;
    return peerConnection;
  }, [socket, callerId]);

  // Start a call
  const startCall = useCallback(
    async (type: "video" | "audio") => {
      if (!currentChannel || !currentUser || !socket) {
        console.error("Missing required data for call:", {
          currentChannel,
          currentUser,
          socket,
        });
        return;
      }

      try {
        console.log("Starting call:", type);
        setCallType(type);
        setCallStatus("calling");
        setIsInCall(true);

        // Get user media
        const constraints = {
          video: type === "video" ? true : false,
          audio: true,
        };

        console.log("Requesting user media with constraints:", constraints);
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setLocalStream(stream);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Initialize peer connection
        const peerConnection = initializePeerConnection();

        // Add tracks to peer connection
        stream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, stream);
        });

        // Create offer
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        // Send call invitation
        const channelMembers =
          currentChannel.members?.filter(
            (member: any) => member.userId !== currentUser.email,
          ) || [];

        if (channelMembers.length > 0) {
          const targetUser = channelMembers[0];
          setCallerId(targetUser.userId);
          setCallerName(
            targetUser.userName ||
              targetUser.userEmail?.split("@")[0] ||
              "User",
          );

          console.log("Sending call invitation to:", targetUser.userId);
          socket.emit("call:invite", {
            targetUserId: targetUser.userId,
            channelId: currentChannel.id,
            callType: type,
            offer: offer,
            callerName: currentUser.firstName + " " + currentUser.lastName,
          });
        } else {
          console.error("No target user found for call");
          endCall();
        }
      } catch (error) {
        console.error("Error starting call:", error);
        alert(
          "Failed to start call: " +
            (error instanceof Error ? error.message : String(error)),
        );
        endCall();
      }
    },
    [currentChannel, currentUser, socket, initializePeerConnection],
  );

  // Answer a call
  const answerCall = useCallback(async () => {
    if (!callType || !localStream) return;

    try {
      setCallStatus("connected");

      const peerConnection = initializePeerConnection();

      // Add local tracks
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });

      // Set remote description from the stored offer
      const pendingOffer = (window as any).pendingOffer;
      if (pendingOffer) {
        await peerConnection.setRemoteDescription(pendingOffer);
      }

      // Create answer
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      // Send answer
      socket?.emit("call:answer", {
        targetUserId: callerId,
        answer: answer,
      });
    } catch (error) {
      console.error("Error answering call:", error);
      endCall();
    }
  }, [callType, localStream, socket, callerId, initializePeerConnection]);

  // End a call
  const endCall = useCallback(() => {
    setCallStatus("ended");
    setIsInCall(false);
    setIsCallActive(false);
    setCallType(null);
    setCallerId(null);
    setCallerName("");

    // Stop local stream
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    // Stop remote stream
    setRemoteStream(null);

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Reset video elements
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    // Notify other user
    if (callerId) {
      socket?.emit("call:end", { targetUserId: callerId });
    }

    setTimeout(() => {
      setCallStatus("idle");
    }, 1000);
  }, [localStream, callerId, socket]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  }, [localStream]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  }, [localStream]);

  // Update video elements when streams change
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current
        .play()
        .catch((e) => console.error("Error playing remote video:", e));
    }
  }, [remoteStream]);

  // Socket.IO event handlers for video calls
  useEffect(() => {
    if (!socket) return;

    // Handle incoming call invitation
    const handleCallInvite = async (data: any) => {
      console.log("Received call invitation:", data);
      setCallType(data.callType);
      setCallerId(data.fromUserId);
      setCallerName(data.callerName);
      setCallStatus("ringing");
      setIsInCall(true);

      // Get user media for incoming call
      try {
        const constraints = {
          video: data.callType === "video" ? true : false,
          audio: true,
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setLocalStream(stream);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Store the offer for when user answers
        (window as any).pendingOffer = data.offer;
        (window as any).pendingCallerId = data.fromUserId;
      } catch (error) {
        console.error("Error getting user media for incoming call:", error);
        endCall();
      }
    };

    // Handle call answer
    const handleCallAnswer = async (data: any) => {
      console.log("Call answered:", data);
      setCallStatus("connected");

      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(data.answer);
      }
    };

    // Handle call end
    const handleCallEnd = () => {
      console.log("Call ended by remote user");
      endCall();
    };

    // Handle ICE candidate
    const handleIceCandidate = async (data: any) => {
      console.log("Received ICE candidate:", data);
      if (peerConnectionRef.current && data.candidate) {
        await peerConnectionRef.current.addIceCandidate(data.candidate);
      }
    };

    socket.on("call:invite", handleCallInvite);
    socket.on("call:answer", handleCallAnswer);
    socket.on("call:end", handleCallEnd);
    socket.on("call:ice-candidate", handleIceCandidate);

    return () => {
      socket.off("call:invite", handleCallInvite);
      socket.off("call:answer", handleCallAnswer);
      socket.off("call:end", handleCallEnd);
      socket.off("call:ice-candidate", handleIceCandidate);
    };
  }, [socket, endCall]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 168) {
      // 7 days
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const getChannelDisplayName = (channel: Channel) => {
    if (channel.type === "DIRECT") {
      const otherMember = channel.members?.find(
        (m: any) => m.userId !== currentUser?.id,
      );
      return otherMember?.userEmail?.split("@")[0] || channel.name;
    }
    return channel.name;
  };

  const isUserOnline = (channel: Channel) => {
    if (channel.type === "DIRECT") {
      const otherMember = channel.members?.find(
        (m: any) => m.userId !== currentUser?.email,
      );
      return otherMember?.userId ? onlineUsers.has(otherMember.userId) : false;
    }
    return false;
  };

  const renderMessage = (message: Message, index: number) => {
    const isOwnMessage = message.senderId === currentUser?.email;
    const previousMessage = index > 0 ? messages[index - 1] : null;
    const showAvatar =
      !previousMessage || previousMessage.senderId !== message.senderId;
    const hasReadReceipt =
      message.readReceipts && message.readReceipts.length > 0;

    return (
      <div
        key={message.id}
        className={`flex items-start space-x-3 px-4 py-2 hover:bg-black/5 group ${
          isOwnMessage ? "flex-row-reverse space-x-reverse" : ""
        }`}
      >
        {/* Avatar */}
        {showAvatar ? (
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback className="bg-blue-500 text-white text-xs">
              {message.senderEmail.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="h-8 w-8 flex-shrink-0" />
        )}

        {/* Message Content */}
        <div
          className={`flex-1 ${isOwnMessage ? "items-end" : "items-start"} flex flex-col`}
        >
          {showAvatar && (
            <div
              className={`flex items-baseline space-x-2 mb-1 ${isOwnMessage ? "flex-row-reverse space-x-reverse" : ""}`}
            >
              <span className="font-semibold text-sm text-gray-900">
                {message.senderName}
              </span>
              <span className="text-xs text-gray-500">
                {formatTime(message.createdAt)}
              </span>
            </div>
          )}

          {/* Reply reference */}
          {message.replyToId && replyingTo && (
            <div className="text-xs text-gray-500 mb-1 flex items-center space-x-1">
              <Reply className="h-3 w-3" />
              <span>Replying to {replyingTo.senderName}</span>
            </div>
          )}

          <div
            className={`rounded-lg px-3 py-2 max-w-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow ${
              isOwnMessage
                ? "bg-[#d9fdd3] text-gray-900"
                : "bg-white text-gray-900"
            }`}
            onClick={(e) => handleMessageClick(message, e)}
          >
            {/* Image attachment */}
            {message.messageType === "IMAGE" && message.attachmentUrl && (
              <div className="mb-2">
                <img
                  src={message.attachmentUrl}
                  alt={message.attachmentName || "Image"}
                  className="rounded-lg max-w-full h-auto cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                  onClick={() => window.open(message.attachmentUrl, "_blank")}
                />
                {message.attachmentName && (
                  <div className="text-xs text-gray-500 mt-1 truncate">
                    {message.attachmentName}
                  </div>
                )}
              </div>
            )}

            {/* Video attachment */}
            {message.messageType === "VIDEO" && message.attachmentUrl && (
              <div className="mb-2">
                <video
                  src={message.attachmentUrl}
                  controls
                  className="rounded-lg max-w-full h-auto shadow-sm"
                  poster={message.attachmentUrl}
                />
                {message.attachmentName && (
                  <div className="text-xs text-gray-500 mt-1 truncate">
                    {message.attachmentName}
                  </div>
                )}
              </div>
            )}

            {/* Audio attachment */}
            {message.messageType === "AUDIO" && message.attachmentUrl && (
              <div className="mb-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Music className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {message.attachmentName || "Audio Message"}
                    </div>
                    <audio
                      src={message.attachmentUrl}
                      controls
                      className="w-full mt-1"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* File attachment */}
            {message.messageType === "FILE" && message.attachmentUrl && (
              <div className="mb-2 p-3 bg-gray-50 rounded-lg">
                <a
                  href={message.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-gray-900 hover:bg-gray-100 rounded p-2 -m-2"
                >
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {message.attachmentName}
                    </div>
                    <div className="text-xs text-gray-500">
                      Document • Click to download
                    </div>
                  </div>
                  <Download className="h-4 w-4 text-gray-400" />
                </a>
              </div>
            )}

            {/* Text content */}
            {editingMessage?.id === message.id ? (
              <div className="space-y-2">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm resize-none"
                  rows={3}
                  autoFocus
                />
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={handleSaveEdit}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditingMessage(null);
                      setEditText("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm whitespace-pre-wrap break-words">
                {renderMessageContent(message.content, message.mentions)}
              </p>
            )}

            {/* Read receipts for own messages */}
            {isOwnMessage && (
              <div className="flex items-center justify-end space-x-1 mt-1">
                <span className="text-xs text-gray-500">
                  {formatTime(message.createdAt)}
                </span>
                {message.readReceipts && message.readReceipts.length > 0 ? (
                  <CheckCheck className="h-3 w-3 text-blue-500" />
                ) : (
                  <Check className="h-3 w-3 text-gray-400" />
                )}
              </div>
            )}
          </div>

          {/* Hover actions */}
          <div
            className={`opacity-0 group-hover:opacity-100 transition-opacity mt-1 flex items-center space-x-1 ${
              isOwnMessage ? "flex-row-reverse space-x-reverse" : ""
            }`}
          >
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs hover:bg-gray-100"
              onClick={() => setReplyingTo(message)}
            >
              <Reply className="h-3 w-3 mr-1" />
              Reply
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs hover:bg-gray-100"
              onClick={(e) => handleMessageClick(message, e)}
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold text-gray-900">Chats</h1>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={() => {
                  setShowCreateChannel(true);
                  loadUsers();
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search messages or people..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => {
                if (searchQuery) {
                  setShowSearchResults(true);
                } else {
                  // Show all users when focused
                  loadAllUsers();
                }
              }}
            />

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                {/* Users */}
                {searchResults.users.length > 0 && (
                  <div className="p-2">
                    <div className="text-xs font-semibold text-gray-500 px-2 py-1">
                      People
                    </div>
                    {searchResults.users.map((user: User) => (
                      <button
                        key={user.id}
                        className="w-full flex items-center space-x-3 px-2 py-2 hover:bg-gray-100 rounded"
                        onClick={() => handleUserClick(user)}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-blue-500 text-white text-xs">
                            {user.firstName.charAt(0)}
                            {user.lastName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Messages */}
                {searchResults.messages.length > 0 && (
                  <div className="p-2 border-t border-gray-200">
                    <div className="text-xs font-semibold text-gray-500 px-2 py-1">
                      Messages
                    </div>
                    {searchResults.messages.map((msg: any) => (
                      <button
                        key={msg.id}
                        className="w-full flex items-start space-x-3 px-2 py-2 hover:bg-gray-100 rounded text-left"
                        onClick={() => {
                          const channel = channels.find(
                            (c) => c.id === msg.channelId,
                          );
                          if (channel) {
                            setCurrentChannel(channel);
                            setShowSearchResults(false);
                            setSearchQuery("");
                          }
                        }}
                      >
                        <MessageSquare className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-gray-500">
                            {msg.channel?.name}
                          </div>
                          <div className="text-sm truncate">{msg.content}</div>
                          <div className="text-xs text-gray-400">
                            {msg.senderName} • {formatTime(msg.createdAt)}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Show all users option when no results */}
                {searchResults.users.length === 0 &&
                  searchResults.messages.length === 0 && (
                    <div className="p-2">
                      <button
                        className="w-full flex items-center space-x-3 px-2 py-2 hover:bg-gray-100 rounded text-left"
                        onClick={loadAllUsers}
                      >
                        <Users className="h-4 w-4 text-gray-400" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-700">
                            Show all users
                          </div>
                          <div className="text-xs text-gray-500">
                            Click to see all available users
                          </div>
                        </div>
                      </button>
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>

        {/* User List - WhatsApp Style */}
        <div className="border-b border-gray-200">
          <div className="px-4 py-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">Contacts</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setShowUserList(!showUserList)}
              >
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${showUserList ? "rotate-180" : ""}`}
                />
              </Button>
            </div>
          </div>

          {showUserList && (
            <div className="max-h-60 overflow-y-auto">
              {availableUsers
                .filter((user) => user.email !== currentUser?.email)
                .map((user) => (
                  <button
                    key={user.id}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    onClick={() => handleUserClick(user)}
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-green-500 text-white text-sm">
                          {user.firstName.charAt(0)}
                          {user.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {/* Online status indicator */}
                      {onlineUsers.has(user.email) && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {userLastMessages[user.email]
                            ? formatTime(userLastMessages[user.email].createdAt)
                            : new Date().toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {userLastMessages[user.email] ? (
                          <div className="flex items-center space-x-1">
                            {userLastMessages[user.email].messageType ===
                              "IMAGE" && (
                              <ImageIcon className="h-3 w-3 flex-shrink-0" />
                            )}
                            {userLastMessages[user.email].messageType ===
                              "VIDEO" && (
                              <Film className="h-3 w-3 flex-shrink-0" />
                            )}
                            {userLastMessages[user.email].messageType ===
                              "AUDIO" && (
                              <Music className="h-3 w-3 flex-shrink-0" />
                            )}
                            {userLastMessages[user.email].messageType ===
                              "FILE" && (
                              <FileText className="h-3 w-3 flex-shrink-0" />
                            )}
                            <span className="truncate">
                              {userLastMessages[user.email].messageType ===
                                "IMAGE" && "Photo"}
                              {userLastMessages[user.email].messageType ===
                                "VIDEO" && "Video"}
                              {userLastMessages[user.email].messageType ===
                                "AUDIO" && "Audio"}
                              {userLastMessages[user.email].messageType ===
                                "FILE" &&
                                userLastMessages[user.email].attachmentName}
                              {userLastMessages[user.email].messageType ===
                                "TEXT" && userLastMessages[user.email].content}
                            </span>
                          </div>
                        ) : (
                          user.email
                        )}
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          )}
        </div>

        {/* Channel List */}
        <div className="flex-1 overflow-y-auto">
          {/* Direct Messages */}
          <div className="p-2">
            <div className="text-xs font-semibold text-gray-500 px-2 py-1">
              Direct Messages
            </div>
            {channels
              .filter((channel) => channel.type === "DIRECT")
              .map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setCurrentChannel(channel)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded hover:bg-gray-100 ${
                    currentChannel?.id === channel.id
                      ? "bg-blue-50 border-l-2 border-blue-600"
                      : ""
                  }`}
                >
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gray-500 text-white text-xs">
                        {getChannelDisplayName(channel)
                          .substring(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {isUserOnline(channel) && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">
                      {getChannelDisplayName(channel)}
                    </div>
                  </div>
                </button>
              ))}
          </div>

          {/* Teams and Channels */}
          {teams.map((team) => (
            <div key={team.id} className="p-2">
              <div className="text-xs font-semibold text-gray-500 px-2 py-1">
                {team.name}
              </div>
              {channels
                .filter((channel) => channel.teamId === team.id)
                .map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setCurrentChannel(channel)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded hover:bg-gray-100 ${
                      currentChannel?.id === channel.id
                        ? "bg-blue-50 border-l-2 border-blue-600"
                        : ""
                    }`}
                  >
                    <Hash className="h-4 w-4 text-gray-500" />
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm flex items-center space-x-1">
                        <span>{channel.name}</span>
                        {channel.isPrivate && (
                          <Lock className="h-3 w-3 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          ))}
        </div>

        {/* User Info */}
        {currentUser && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-blue-600 text-white">
                  {currentUser.firstName.charAt(0)}
                  {currentUser.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-medium text-sm">
                  {currentUser.firstName} {currentUser.lastName}
                </div>
                <div className="text-xs text-gray-500">{currentUser.email}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentChannel ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {currentChannel.type === "DIRECT" ? (
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gray-500 text-white">
                        {getChannelDisplayName(currentChannel)
                          .substring(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {isUserOnline(currentChannel) && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Hash className="h-5 w-5 text-blue-600" />
                  </div>
                )}
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {getChannelDisplayName(currentChannel)}
                  </h2>
                  {currentChannel.type === "DIRECT" &&
                  isUserOnline(currentChannel) ? (
                    <p className="text-xs text-green-600 font-medium">Online</p>
                  ) : currentChannel.description ? (
                    <p className="text-xs text-gray-500">
                      {currentChannel.description}
                    </p>
                  ) : currentChannel.type === "DIRECT" ? (
                    <p className="text-xs text-gray-500">Offline</p>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  className="h-9 w-9 p-0"
                  onClick={() => startCall("video")}
                  disabled={isInCall}
                >
                  <Video className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  className="h-9 w-9 p-0"
                  onClick={() => startCall("audio")}
                  disabled={isInCall}
                >
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" className="h-9 w-9 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Pinned Messages */}
            {pinnedMessages.length > 0 && (
              <div className="px-4 py-2 bg-yellow-50 border-b border-yellow-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Pin className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">
                      Pinned Messages ({pinnedMessages.length})
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPinnedMessages(!showPinnedMessages)}
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${showPinnedMessages ? "rotate-180" : ""}`}
                    />
                  </Button>
                </div>
                {showPinnedMessages && (
                  <div className="mt-2 space-y-2">
                    {pinnedMessages.map((message) => (
                      <div
                        key={message.id}
                        className="p-2 bg-white rounded-lg shadow-sm"
                      >
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {message.senderName.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-900">
                                {message.senderName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatTime(message.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 truncate">
                              {message.content}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUnpinMessage(message)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto bg-[#efeae2]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260' viewBox='0 0 260 260'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23d9d4cc' fill-opacity='0.15'%3E%3Cpath d='M24.37 16c.2.65.39 1.32.54 2H21.17l1.17 2.34.45.9-.24.11V28a5 5 0 0 1-2.23 8.94l-.02.06a8 8 0 0 1-7.75 6h-20a8 8 0 0 1-7.74-6l-.02-.06a5 5 0 0 1-2.24-8.94v-6.76l-.79-1.58-.44-.9.9-.44.63-.32H6a23.01 23.01 0 0 1 44.37-2zm-36.82 2a1 1 0 0 0-.44.1l-3.1 1.56.89 1.79 1.31-.66a3 3 0 0 1 2.69 0l2.2 1.1a1 1 0 0 0 .9 0l2.21-1.1a3 3 0 0 1 2.69 0l2.2 1.1a1 1 0 0 0 .9 0l2.21-1.1a3 3 0 0 1 2.69 0l2.2 1.1a1 1 0 0 0 .86.02l2.88-1.27a3 3 0 0 1 2.43 0l2.88 1.27a1 1 0 0 0 .85-.02l3.1-1.55-.89-1.79-1.42.71a3 3 0 0 1-2.56.06l-2.77-1.23a1 1 0 0 0-.4-.09h-.01a1 1 0 0 0-.4.09l-2.78 1.23a3 3 0 0 1-2.56-.06l-2.3-1.15a1 1 0 0 0-.45-.11h-.01a1 1 0 0 0-.44.1L.9 19.22a3 3 0 0 1-2.69 0l-2.2-1.1a1 1 0 0 0-.45-.11h-.01a1 1 0 0 0-.44.1l-2.21 1.11a3 3 0 0 1-2.69 0l-2.2-1.1a1 1 0 0 0-.45-.11h-.01zm0-2h-4.9a21.01 21.01 0 0 1 39.61 0h-2.09l-.06-.13-.26.13h-32.31zm30.35 7.68l1.36-.68h1.3v2h-36v-1.15l.34-.17 1.36-.68h2.59l1.36.68a3 3 0 0 0 2.69 0l1.36-.68h2.59l1.36.68a3 3 0 0 0 2.69 0L2.26 23h2.59l1.36.68a3 3 0 0 0 2.56.06l1.67-.74h3.23l1.67.74a3 3 0 0 0 2.56-.06zM-13.82 27l16.37 4.91L18.93 27h-32.75zm-.63 2h.34l16.66 5 16.67-5h.33a3 3 0 1 1 0 6h-34a3 3 0 1 1 0-6zm1.35 8a6 6 0 0 0 5.65 4h20a6 6 0 0 0 5.66-4H-13.1z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            >
              {messages.map((message, index) => renderMessage(message, index))}

              {/* Typing Indicator */}
              {typingUsers.length > 0 && (
                <div className="px-4 py-2 flex items-start space-x-3">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-gray-400 text-white text-xs">
                      {typingUsers[0].email.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 rounded-lg px-4 py-2 flex items-center space-x-1">
                    <span className="text-sm text-gray-600">
                      {typingUsers[0].email.split("@")[0]} is typing
                    </span>
                    <div className="flex space-x-1">
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Message Dropdown */}
            {showMessageDropdown && selectedMessage && (
              <div
                className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-[200px]"
                style={{
                  left: `${Math.min(dropdownPosition.x, window.innerWidth - 220)}px`,
                  top: `${Math.min(dropdownPosition.y, window.innerHeight - 300)}px`,
                }}
              >
                <button
                  onClick={() => handleReplyToMessage(selectedMessage)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
                >
                  <Reply className="h-4 w-4" />
                  <span>Reply</span>
                </button>

                <button
                  onClick={() => handleCopyMessage(selectedMessage)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </button>

                {selectedMessage.senderId === currentUser?.email && (
                  <button
                    onClick={() => handleEditMessage(selectedMessage)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                )}

                <button
                  onClick={() => handleForwardMessage(selectedMessage)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
                >
                  <Forward className="h-4 w-4" />
                  <span>Forward</span>
                </button>

                <button
                  onClick={() => handleStarMessage(selectedMessage)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
                >
                  <Star className="h-4 w-4" />
                  <span>Star</span>
                </button>

                <button
                  onClick={() =>
                    selectedMessage.isPinned
                      ? handleUnpinMessage(selectedMessage)
                      : handlePinMessage(selectedMessage)
                  }
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
                >
                  <Pin className="h-4 w-4" />
                  <span>{selectedMessage.isPinned ? "Unpin" : "Pin"}</span>
                </button>

                <button
                  onClick={() => handleTagUser(selectedMessage)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
                >
                  <AtSign className="h-4 w-4" />
                  <span>Tag User</span>
                </button>

                {selectedMessage.senderId === currentUser?.email && (
                  <button
                    onClick={() => handleDeleteMessage(selectedMessage)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center space-x-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                )}

                <button
                  onClick={() => handleReportMessage(selectedMessage)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2"
                >
                  <Flag className="h-4 w-4" />
                  <span>Report</span>
                </button>
              </div>
            )}

            {/* Reply Banner */}
            {replyingTo && (
              <div className="px-4 py-2 bg-blue-50 border-t border-blue-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Reply className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-700">
                    Replying to <strong>{replyingTo.senderName}</strong>:{" "}
                    {replyingTo.content.substring(0, 50)}...
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* File Preview - WhatsApp Style */}
            {selectedFile && (
              <div className="px-4 py-3 bg-[#f0f2f5] border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {previewUrl ? (
                      <div className="relative">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="h-20 w-20 object-cover rounded-lg shadow-sm"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center">
                          <div className="bg-white bg-opacity-90 rounded-full p-1">
                            <ImageIcon className="h-4 w-4 text-gray-600" />
                          </div>
                        </div>
                      </div>
                    ) : selectedFile.type.startsWith("video/") ? (
                      <div className="h-20 w-20 bg-gray-300 rounded-lg flex items-center justify-center relative">
                        <Film className="h-8 w-8 text-gray-500" />
                        <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                          {Math.round(selectedFile.size / 1024 / 1024)}MB
                        </div>
                      </div>
                    ) : selectedFile.type.startsWith("audio/") ? (
                      <div className="h-20 w-20 bg-green-100 rounded-lg flex items-center justify-center">
                        <Music className="h-8 w-8 text-green-600" />
                      </div>
                    ) : (
                      <div className="h-20 w-20 bg-blue-100 rounded-lg flex items-center justify-center relative">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                          {Math.round(selectedFile.size / 1024 / 1024)}MB
                        </div>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {selectedFile.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                      <div className="text-xs text-gray-400 capitalize">
                        {selectedFile.type.split("/")[0]} file
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                    className="h-8 w-8 p-0 rounded-full hover:bg-gray-200"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Voice Recording UI */}
            {isRecording && (
              <div className="px-4 py-3 bg-red-50 border-t border-red-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-red-700">
                      Recording... {formatRecordingTime(recordingTime)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={cancelRecording}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={stopRecording}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Stop
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Voice Message Preview */}
            {audioBlob && !isRecording && (
              <div className="px-4 py-3 bg-green-50 border-t border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Music className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-700">
                      Voice message ({formatRecordingTime(recordingTime)})
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={cancelRecording}
                      className="text-green-600 hover:text-green-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={sendVoiceMessage}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Message Input */}
            <div className="p-3 bg-[#f0f2f5] border-t border-gray-200">
              <div className="flex items-end space-x-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                />

                {/* Attachment Dropdown */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    className="h-10 w-10 p-0 flex-shrink-0 rounded-full hover:bg-gray-200"
                    onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                  >
                    <Plus className="h-5 w-5 text-gray-600" />
                  </Button>

                  {/* Attachment Menu */}
                  {showAttachmentMenu && (
                    <div className="absolute bottom-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-[200px]">
                      <button
                        onClick={() => {
                          fileInputRef.current?.click();
                          setShowAttachmentMenu(false);
                        }}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-100 rounded"
                      >
                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <ImageIcon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">
                            Photo & Video
                          </div>
                          <div className="text-xs text-gray-500">Gallery</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          // Trigger camera
                          const cameraInput = document.createElement("input");
                          cameraInput.type = "file";
                          cameraInput.accept = "image/*,video/*";
                          cameraInput.capture = "environment";
                          cameraInput.onchange = (e) => {
                            const event =
                              e as unknown as React.ChangeEvent<HTMLInputElement>;
                            handleFileSelect(event);
                          };
                          cameraInput.click();
                          setShowAttachmentMenu(false);
                        }}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-100 rounded"
                      >
                        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Camera className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">Camera</div>
                          <div className="text-xs text-gray-500">
                            Take photo or video
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          fileInputRef.current?.click();
                          setShowAttachmentMenu(false);
                        }}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-100 rounded"
                      >
                        <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <FileText className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">Document</div>
                          <div className="text-xs text-gray-500">
                            Files, PDFs, etc.
                          </div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>

                {/* Emoji Button */}
                <Button
                  variant="ghost"
                  className="h-10 w-10 p-0 flex-shrink-0 rounded-full hover:bg-gray-200"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Smile className="h-5 w-5 text-gray-600" />
                </Button>

                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message"
                    className="w-full resize-none rounded-full border-0 bg-white px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
                    rows={1}
                    style={{ minHeight: "40px", maxHeight: "120px" }}
                  />

                  {/* Send/Voice Button */}
                  {messageInput.trim() || selectedFile ? (
                    <Button
                      variant="ghost"
                      className="absolute right-2 bottom-1 h-8 w-8 p-0 rounded-full bg-green-500 hover:bg-green-600 text-white"
                      onClick={handleSendMessage}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      className="absolute right-2 bottom-1 h-8 w-8 p-0 rounded-full hover:bg-gray-200"
                      onMouseDown={startRecording}
                      onMouseUp={stopRecording}
                      onMouseLeave={stopRecording}
                    >
                      <Mic className="h-4 w-4 text-gray-600" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="absolute bottom-16 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-64 h-48 overflow-y-auto">
                  <div className="grid grid-cols-8 gap-1">
                    {[
                      "😀",
                      "😃",
                      "😄",
                      "😁",
                      "😆",
                      "😅",
                      "😂",
                      "🤣",
                      "😊",
                      "😇",
                      "🙂",
                      "🙃",
                      "😉",
                      "😌",
                      "😍",
                      "🥰",
                      "😘",
                      "😗",
                      "😙",
                      "😚",
                      "😋",
                      "😛",
                      "😝",
                      "😜",
                      "🤪",
                      "🤨",
                      "🧐",
                      "🤓",
                      "😎",
                      "🤩",
                      "🥳",
                      "😏",
                      "😒",
                      "😞",
                      "😔",
                      "😟",
                      "😕",
                      "🙁",
                      "☹️",
                      "😣",
                      "😖",
                      "😫",
                      "😩",
                      "🥺",
                      "😢",
                      "😭",
                      "😤",
                      "😠",
                      "😡",
                      "🤬",
                      "🤯",
                      "😳",
                      "🥵",
                      "🥶",
                      "😱",
                      "😨",
                      "😰",
                      "😥",
                      "😓",
                      "🤗",
                      "🤔",
                      "🤭",
                      "🤫",
                      "🤥",
                      "😶",
                      "😐",
                      "😑",
                      "😬",
                      "🙄",
                      "😯",
                      "😦",
                      "😧",
                      "😮",
                      "😲",
                      "🥱",
                      "😴",
                      "🤤",
                      "😪",
                      "😵",
                      "🤐",
                      "🥴",
                      "🤢",
                      "🤮",
                      "🤧",
                      "😷",
                      "🤒",
                      "🤕",
                      "🤑",
                      "🤠",
                      "😈",
                      "👿",
                      "👹",
                      "👺",
                      "🤡",
                      "💩",
                      "👻",
                      "💀",
                      "☠️",
                      "👽",
                      "👾",
                      "🤖",
                      "🎃",
                      "😺",
                      "😸",
                      "😹",
                      "😻",
                      "😼",
                      "😽",
                      "🙀",
                      "😿",
                      "😾",
                    ].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => insertEmoji(emoji)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-500">
                Choose a channel or direct message to start chatting
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Create Channel Modal */}
      {showCreateChannel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Create New Channel</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateChannel(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Channel Name
                </label>
                <Input
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  placeholder="e.g., marketing-team"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description (optional)
                </label>
                <Input
                  value={channelDescription}
                  onChange={(e) => setChannelDescription(e.target.value)}
                  placeholder="What's this channel about?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Channel Type
                </label>
                <select
                  value={channelType}
                  onChange={(e) =>
                    setChannelType(e.target.value as "STANDARD" | "PRIVATE")
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="STANDARD">Standard (Public)</option>
                  <option value="PRIVATE">Private</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Team (optional)
                </label>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">No team</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Add Members (optional)
                </label>
                <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md p-2 space-y-1">
                  {availableUsers.map((user) => (
                    <label
                      key={user.id}
                      className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.email)}
                        onChange={() => toggleUserSelection(user.email)}
                        className="rounded"
                      />
                      <span className="text-sm">
                        {user.firstName} {user.lastName} ({user.email})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowCreateChannel(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateChannel}
                disabled={!channelName.trim() || isCreating}
              >
                {isCreating ? "Creating..." : "Create Channel"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Video Call Modal */}
      {isInCall && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Call Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-white text-blue-600 text-lg font-semibold">
                        {callerName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {callStatus === "connected" && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {callerName}
                    </h3>
                    <p className="text-blue-100 text-sm">
                      {callStatus === "calling" && "Calling..."}
                      {callStatus === "ringing" && "Incoming call..."}
                      {callStatus === "connected" && "Connected"}
                      {callStatus === "ended" && "Call ended"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-white/20 text-white"
                  onClick={endCall}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Video Area */}
            <div className="relative bg-gray-900 aspect-video">
              {/* Remote Video */}
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
                style={{ display: callType === "video" ? "block" : "none" }}
              />

              {/* Audio Call Avatar */}
              {callType === "audio" && callStatus === "connected" && (
                <div className="w-full h-full flex items-center justify-center">
                  <Avatar className="h-32 w-32">
                    <AvatarFallback className="bg-blue-500 text-white text-4xl font-semibold">
                      {callerName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}

              {/* Local Video (Picture-in-Picture) */}
              {callType === "video" && localStream && (
                <div className="absolute top-4 right-4 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                </div>
              )}

              {/* Call Status Overlay */}
              {callStatus === "ringing" && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="animate-pulse">
                      <PhoneCall className="h-16 w-16 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">
                        Incoming Call
                      </h3>
                      <p className="text-gray-300">from {callerName}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Call Controls */}
            <div className="px-6 py-4 bg-gray-50">
              {callStatus === "ringing" ? (
                // Incoming call controls
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    onClick={endCall}
                    className="h-12 w-12 rounded-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    <PhoneOff className="h-6 w-6" />
                  </Button>
                  <Button
                    onClick={answerCall}
                    className="h-12 w-12 rounded-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Phone className="h-6 w-6" />
                  </Button>
                </div>
              ) : callStatus === "connected" ? (
                // Active call controls
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    onClick={toggleMute}
                    className={`h-12 w-12 rounded-full ${
                      isMuted
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-gray-600 hover:bg-gray-700"
                    } text-white`}
                  >
                    {isMuted ? (
                      <MicOff className="h-6 w-6" />
                    ) : (
                      <Mic className="h-6 w-6" />
                    )}
                  </Button>

                  {callType === "video" && (
                    <Button
                      onClick={toggleVideo}
                      className={`h-12 w-12 rounded-full ${
                        !isVideoEnabled
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-gray-600 hover:bg-gray-700"
                      } text-white`}
                    >
                      {isVideoEnabled ? (
                        <Camera className="h-6 w-6" />
                      ) : (
                        <CameraOff className="h-6 w-6" />
                      )}
                    </Button>
                  )}

                  <Button
                    onClick={endCall}
                    className="h-12 w-12 rounded-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    <PhoneOff className="h-6 w-6" />
                  </Button>
                </div>
              ) : (
                // Calling/ended controls
                <div className="flex items-center justify-center">
                  <Button
                    onClick={endCall}
                    className="h-12 w-12 rounded-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    <PhoneOff className="h-6 w-6" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tag Modal */}
      {showTagModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Tag Users in Message</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Search and select users to tag:
              </label>
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Type to search users..."
                className="mb-2"
              />

              {/* User search results */}
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md">
                {availableUsers
                  .filter(
                    (user: User) =>
                      user.email !== currentUser?.email &&
                      (user.firstName
                        .toLowerCase()
                        .includes(tagInput.toLowerCase()) ||
                        user.lastName
                          .toLowerCase()
                          .includes(tagInput.toLowerCase()) ||
                        user.email
                          .toLowerCase()
                          .includes(tagInput.toLowerCase())),
                  )
                  .map((user: User) => (
                    <div
                      key={user.id}
                      className="flex items-center space-x-2 p-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        if (!taggedUsers.find((u) => u.id === user.id)) {
                          setTaggedUsers([...taggedUsers, user]);
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={taggedUsers.some((u) => u.id === user.id)}
                        onChange={() => {
                          if (taggedUsers.find((u) => u.id === user.id)) {
                            setTaggedUsers(
                              taggedUsers.filter((u) => u.id !== user.id),
                            );
                          } else {
                            setTaggedUsers([...taggedUsers, user]);
                          }
                        }}
                        className="rounded"
                      />
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {user.firstName.substring(0, 1)}
                          {user.lastName.substring(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Selected users */}
            {taggedUsers.length > 0 && (
              <div className="mb-4">
                <div className="text-sm font-medium mb-2">Selected users:</div>
                <div className="flex flex-wrap gap-2">
                  {taggedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                    >
                      <span>
                        {user.firstName} {user.lastName}
                      </span>
                      <button
                        onClick={() =>
                          setTaggedUsers(
                            taggedUsers.filter((u) => u.id !== user.id),
                          )
                        }
                        className="ml-1 hover:text-blue-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowTagModal(false);
                  setTaggedUsers([]);
                  setTagInput("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleTagSubmit}
                disabled={taggedUsers.length === 0}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Tag Users
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
