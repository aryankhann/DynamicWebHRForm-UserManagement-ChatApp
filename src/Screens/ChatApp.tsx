import React, { useEffect, useRef } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import io from "socket.io-client";
import TextFieldUI from "../components/TextFieldUI";
import ButtonBlue from "../components/ButtonBlue";
import TextUI from "../components/TextUI";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const ChatApp = ({ navigation, route }: any) => {
  const [message, setMessage] = React.useState("");
  const { roomCode } = route.params;
  const [messages, setMessages] = React.useState<
    { text: string; from: "me" | "other" }[]
  >([]);

  const lastTypingTimeRef = useRef(0);
  const stopTypingTimeoutRef = useRef<any | null>(null);
  
  const [userTyping, setUserTyping] = React.useState(false);

  const socketRef = useRef<any>(null);

  console.log('roomcode from other screen:', roomCode);

  const changeText = (text: string) => {
    setMessage(text);
    const now = Date.now();
    
    if (now - lastTypingTimeRef.current > 3000) {
      socketRef.current?.emit('typing', true,'me',roomCode);
      lastTypingTimeRef.current = now;
    }
    
    if (stopTypingTimeoutRef.current) {
      clearTimeout(stopTypingTimeoutRef.current);
    }
    
    stopTypingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit('stoppedTyping', false,'me',roomCode);
    }, 3000);
  };

  console.log('messages', messages);
  
  const handleMessage = () => {
    if (!message.trim()) return;
    
    setMessages(prev => [...prev, { text: message, from: "me" }]);
    socketRef.current?.emit("sendMessage", { roomCode, message });
    setMessage("");
    
    if (stopTypingTimeoutRef.current) {
      clearTimeout(stopTypingTimeoutRef.current);
    }
    socketRef.current?.emit('stoppedTyping', roomCode);
  };

  const handleDisconnect = () => {
    socketRef.current?.emit('leaveRoom', roomCode);
    socketRef.current?.disconnect();
    navigation?.goBack();
  };

  useEffect(() => {
    console.log(`[Mobile] Setting up socket for room: ${roomCode}`);
    
    const socket = io("http://localhost:3000", {
      autoConnect: false
    });
    
    socketRef.current = socket;

    const handleConnect = () => {
      console.log("[Mobile] Connected to server, socket ID:", socket.id);
      socket.emit('joinRoom', roomCode);
      console.log(`[Mobile] Joining room: ${roomCode}`);
    };

    const handleReceiveMessage = (receivedMessage: string) => {
      console.log(`[Mobile] Message received in room ${roomCode}:`, receivedMessage);
      setMessages(prev => [...prev, { text: receivedMessage, from: 'other' }]);
    };

    const handleRoomLeft = (room: string) => {
      console.log('[Mobile] Left room:', room);
    };

    const handleUserJoined = (userId: string) => {
      console.log('[Mobile] User joined:', userId);
    };

    const handleUserLeft = (userId: string) => {
      console.log('[Mobile] User left:', userId);
    };

    const handleUserTyping = () => {
      console.log('Other user is typing');
      setUserTyping(true);
    };

    const handleUserNotTyping = () => {
      console.log('Other user stopped typing');
      setUserTyping(false);
    };

    socket.on("connect", handleConnect);
    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("roomLeft", handleRoomLeft);
    socket.on("userJoined", handleUserJoined);
    socket.on("userLeft", handleUserLeft);
    socket.on('UserTyping', handleUserTyping); 
    socket.on('UserNotTyping', handleUserNotTyping); 

    socket.connect();

    return () => {
      console.log(`[Mobile] Cleaning up socket for room: ${roomCode}`);
      
      if (stopTypingTimeoutRef.current) {
        clearTimeout(stopTypingTimeoutRef.current);
      }
      
      socket.off("connect", handleConnect);
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("roomLeft", handleRoomLeft);
      socket.off("userJoined", handleUserJoined);
      socket.off("userLeft", handleUserLeft);
      socket.off('userTyping', handleUserTyping);
      socket.off('userNotTyping', handleUserNotTyping);
      
      socket.emit('leaveRoom', roomCode);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [roomCode]); 

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextUI text={`Chat - Room ${roomCode}`} style={styles.headerText} />
      </View>
      
      <View style={{ width: '100%', flexDirection: 'row-reverse' }}>
        <TouchableOpacity style={{ width: '40%' }}>
          <ButtonBlue 
            text="leave chat room" 
            onNext={() => { handleDisconnect(); navigation.goBack(); }} 
            style={{ width: '100%', marginTop: 10, borderRadius: 5, right: 10 }}
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.chatContainer}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {messages.map((item, index) =>
          item.from === "me" ? (
            <View key={index} style={styles.myMessageRow}>
              <View style={styles.myBubble}>
                <TextUI text={item.text} style={{ color: "#fff" }} />
              </View>
              <FontAwesomeIcon icon={faUser} size={22} color="#0C64AE" />
            </View>
          ) : (
            <View key={index} style={styles.otherMessageRow}>
              <FontAwesomeIcon icon={faUser} size={22} color="#6b7280" />
              <View style={styles.otherBubble}>
                <TextUI text={item.text} />
              </View>
            </View>
          )
        )}
        
        {userTyping && (
          <View style={styles.otherMessageRow}>
            <FontAwesomeIcon icon={faUser} size={22} color="#6b7280" />
            <View style={styles.typingBubble}>
              <TextUI text="typing..." style={{ fontStyle: 'italic', color: '#6b7280' }} />
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextFieldUI
          pholder="Type a message..."
          value={message}
          onChangeText={changeText}
          style={{ flex: 1 }}
        />
        <ButtonBlue
          text="Send"
          onNext={handleMessage}
          style={{ marginLeft: 15, width: '20%', right: 10 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6", 
  },

  header: {
    paddingTop: 70,
    paddingBottom: 10,
    backgroundColor: "#0C64AE",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  chatContainer: {
    flex: 1,
    paddingHorizontal: 15,
    marginTop: 30,
  },

  myMessageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 10,
    gap: 8,
  },

  otherMessageRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },

  myBubble: {
    backgroundColor: "#0C64AE",
    padding: 10,
    borderRadius: 16,
    maxWidth: "75%",
  },

  otherBubble: {
    backgroundColor: "#e5e7eb",
    padding: 10,
    borderRadius: 16,
    maxWidth: "75%",
  },

  typingBubble: {
    backgroundColor: "#e5e7eb",
    padding: 10,
    borderRadius: 16,
    maxWidth: "75%",
    opacity: 0.8,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 32,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
  },
});

export default ChatApp;