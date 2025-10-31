import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_CHAT_SERVICE_URL || "http://localhost:8089";

class SocketClient {
  private socket: Socket | null = null;
  private isConnecting = false;

  connect(token: string): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    if (this.isConnecting) {
      return this.socket!;
    }

    this.isConnecting = true;

    this.socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on("connect", () => {
      console.log("✅ Socket.IO connected:", this.socket?.id);
      this.isConnecting = false;
    });

    this.socket.on("disconnect", (reason) => {
      console.log("❌ Socket.IO disconnected:", reason);
      this.isConnecting = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("🔥 Socket.IO connection error:", error.message);
      this.isConnecting = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketClient = new SocketClient();
export default socketClient;
