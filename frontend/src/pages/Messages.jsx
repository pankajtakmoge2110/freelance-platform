import { useState, useEffect } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await API.get("/messages/conversations");
        setConversations(data.conversations);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  const openConversation = async (conv) => {
    setSelected(conv);
    try {
      const { data } = await API.get(`/messages/${conv.project._id}`);
      setMessages(data.messages);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const receiverId =
        selected.sender._id === user.id
          ? selected.receiver._id
          : selected.sender._id;

      const { data } = await API.post("/messages", {
        receiverId,
        projectId: selected.project._id,
        content: newMessage,
      });
      setMessages([...messages, data.data]);
      setNewMessage("");
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  return (
    <div style={styles.container}>
      {/* Conversations List */}
      <div style={styles.sidebar}>
        <h2 style={styles.sideTitle}>Messages 💬</h2>
        {loading ? (
          <p style={styles.msg}>Loading...</p>
        ) : conversations.length === 0 ? (
          <p style={styles.msg}>No conversations yet.</p>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv._id}
              onClick={() => openConversation(conv)}
              style={{
                ...styles.convItem,
                backgroundColor: selected?._id === conv._id ? "#16213e" : "transparent",
              }}
            >
              <p style={styles.convName}>
                {conv.sender._id === user.id ? conv.receiver.name : conv.sender.name}
              </p>
              <p style={styles.convProject}>📁 {conv.project?.title}</p>
              <p style={styles.convPreview}>
                {conv.content.length > 40 ? conv.content.slice(0, 40) + "..." : conv.content}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Chat Window */}
      <div style={styles.chat}>
        {!selected ? (
          <div style={styles.noChat}>
            <p style={styles.noChatText}>Select a conversation to start messaging 💬</p>
          </div>
        ) : (
          <>
            <div style={styles.chatHeader}>
              <p style={styles.chatName}>
                {selected.sender._id === user.id
                  ? selected.receiver.name
                  : selected.sender.name}
              </p>
              <p style={styles.chatProject}>📁 {selected.project?.title}</p>
            </div>

            <div style={styles.messages}>
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  style={{
                    ...styles.msgBubble,
                    alignSelf: msg.sender._id === user.id ? "flex-end" : "flex-start",
                    backgroundColor: msg.sender._id === user.id ? "#e94560" : "#1a1a2e",
                  }}
                >
                  <p style={styles.msgText}>{msg.content}</p>
                  <p style={styles.msgTime}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              ))}
            </div>

            <div style={styles.inputRow}>
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                style={styles.input}
                placeholder="Type a message..."
              />
              <button onClick={sendMessage} style={styles.sendBtn}>Send →</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", height: "calc(100vh - 60px)", backgroundColor: "#0f0f1a" },
  sidebar: { width: "300px", borderRight: "1px solid #2a2a4a", padding: "20px", overflowY: "auto" },
  sideTitle: { color: "white", fontSize: "18px", marginBottom: "20px" },
  msg: { color: "#a0a0b0", fontSize: "14px" },
  convItem: { padding: "14px", borderRadius: "8px", cursor: "pointer", marginBottom: "8px" },
  convName: { color: "white", fontSize: "15px", fontWeight: "bold", marginBottom: "4px" },
  convProject: { color: "#a0a0b0", fontSize: "12px", marginBottom: "4px" },
  convPreview: { color: "#a0a0b0", fontSize: "13px" },
  chat: { flex: 1, display: "flex", flexDirection: "column" },
  noChat: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center" },
  noChatText: { color: "#a0a0b0", fontSize: "16px" },
  chatHeader: { padding: "16px 24px", borderBottom: "1px solid #2a2a4a", backgroundColor: "#1a1a2e" },
  chatName: { color: "white", fontSize: "16px", fontWeight: "bold", marginBottom: "4px" },
  chatProject: { color: "#a0a0b0", fontSize: "13px" },
  messages: { flex: 1, padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" },
  msgBubble: { maxWidth: "60%", padding: "12px 16px", borderRadius: "12px" },
  msgText: { color: "white", fontSize: "14px", marginBottom: "4px" },
  msgTime: { color: "rgba(255,255,255,0.5)", fontSize: "11px", textAlign: "right" },
  inputRow: { padding: "16px 24px", borderTop: "1px solid #2a2a4a", display: "flex", gap: "12px" },
  input: { flex: 1, padding: "12px 16px", borderRadius: "8px", border: "1px solid #2a2a4a", backgroundColor: "#1a1a2e", color: "white", fontSize: "15px" },
  sendBtn: { padding: "12px 24px", backgroundColor: "#e94560", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "15px" },
};

export default Messages;