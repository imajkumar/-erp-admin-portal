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
  ChevronDown,
  Reply,
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
      if (!currentChannel || !currentUser) return;

      try {
        setCallType(type);
        setCallStatus("calling");
        setIsInCall(true);

        // Get user media
        const constraints = {
          video: type === "video" ? true : false,
          audio: true,
        };

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

          socket?.emit("call:invite", {
            targetUserId: targetUser.userId,
            channelId: currentChannel.id,
            callType: type,
            offer: offer,
            callerName: currentUser.firstName + " " + currentUser.lastName,
          });
        }
      } catch (error) {
        console.error("Error starting call:", error);
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
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
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
        className={`flex items-start space-x-3 px-4 py-2 hover:bg-gray-50 group ${
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
            className={`rounded-lg px-3 py-2 max-w-lg ${
              isOwnMessage
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            {/* Image attachment */}
            {message.messageType === "IMAGE" && message.attachmentUrl && (
              <img
                src={message.attachmentUrl}
                alt={message.attachmentName || "Image"}
                className="rounded mb-2 max-w-full h-auto cursor-pointer"
                onClick={() => window.open(message.attachmentUrl, "_blank")}
              />
            )}

            {/* Video attachment */}
            {message.messageType === "VIDEO" && message.attachmentUrl && (
              <video
                src={message.attachmentUrl}
                controls
                className="rounded mb-2 max-w-full h-auto"
              />
            )}

            {/* Audio attachment */}
            {message.messageType === "AUDIO" && message.attachmentUrl && (
              <audio src={message.attachmentUrl} controls className="mb-2" />
            )}

            {/* File attachment */}
            {message.messageType === "FILE" && message.attachmentUrl && (
              <a
                href={message.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center space-x-2 mb-2 ${isOwnMessage ? "text-white" : "text-blue-600"}`}
              >
                <FileText className="h-5 w-5" />
                <span className="underline">{message.attachmentName}</span>
                <Download className="h-4 w-4" />
              </a>
            )}

            {/* Text content */}
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.content}
            </p>

            {/* Read receipts for own messages */}
            {isOwnMessage && (
              <div className="flex items-center justify-end space-x-1 mt-1">
                <span className="text-xs opacity-75">
                  {formatTime(message.createdAt)}
                </span>
                {hasReadReceipt ? (
                  <CheckCheck className="h-3 w-3" />
                ) : (
                  <Check className="h-3 w-3" />
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
              className="h-6 px-2 text-xs"
              onClick={() => setReplyingTo(message)}
            >
              <Reply className="h-3 w-3 mr-1" />
              Reply
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

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-white">
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

            {/* File Preview */}
            {selectedFile && (
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="h-16 w-16 object-cover rounded"
                      />
                    ) : (
                      <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center">
                        <FileText className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium">
                        {selectedFile.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleRemoveFile}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <Progress value={uploadProgress} className="mt-2" />
                )}
              </div>
            )}

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-end space-x-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                />
                <Button
                  variant="ghost"
                  className="h-9 w-9 p-0 flex-shrink-0"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message... (Shift + Enter for new line)"
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={1}
                    style={{ minHeight: "40px", maxHeight: "120px" }}
                  />
                  <Button
                    variant="ghost"
                    className="absolute right-2 bottom-2 h-6 w-6 p-0"
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim() && !selectedFile}
                  >
                    <Send className="h-4 w-4 text-blue-600" />
                  </Button>
                </div>
              </div>
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
    </div>
  );
}
