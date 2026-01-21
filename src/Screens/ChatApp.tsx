import React, { useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView, StyleSheet } from "react-native";
import io from "socket.io-client";
import TextFieldUI from "../components/TextFieldUI";
import ButtonBlue from "../components/ButtonBlue";
import TextUI from "../components/TextUI";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";


const socket = io("http://localhost:3000",{
  autoConnect:false
});

const ChatApp = ({navigate}:any) => {
  const [message, setMessage] = React.useState("");
 
const [messages, setMessages] = React.useState<
  { text: string; from: "me" | "other" }[]
>([]);


  const changeText = (text: string) => {
    setMessage(text);
  };

  console.log('messages',messages)

  const handleMessage = () => {
 
    setMessages(prev => [...prev, { text: message, from: "me" }]);
    socket.emit("sendMessage", message);
    setMessage("");
  
};



const handleDisconnect = () => {
  socket.emit('leaveRoom', "Room 52");
};
 useEffect(() => {
  const roomCode = 'Room 52';
  
  const handleConnect = () => {
    console.log("Connected to server");
    socket.emit('joinRoom', roomCode);
  };

  const handleReceiveMessage = (message: string) => {
    console.log("Message received:", message);
    setMessages(prev => [...prev, { text: message, from: 'other' }]);
  };

          const handleRoomLeft = (room: string) => {
    console.log('Left room:', room);
  };

  socket.on("connect", handleConnect);

      socket.on("receiveMessage", handleReceiveMessage);
  
  
  socket.on("roomLeft", handleRoomLeft);

  socket.connect();

  return () => {
    socket.off("connect", handleConnect);
      socket.off("receiveMessage", handleReceiveMessage);
          socket.off("roomLeft", handleRoomLeft);
    socket.disconnect(); 
  };
}, []);



 
  return (
  <View style={styles.container}>

    <View style={styles.header}>
      <TextUI text="Chat App" style={styles.headerText} />
    </View>
    <View style={{width:'100%',flexDirection:'row-reverse'}}>
     <TouchableOpacity style={{width:'40%'}}><ButtonBlue text="leave chat room" onNext={handleDisconnect} style={{width:'100%',marginTop:10,borderRadius:5,right:10}}/></TouchableOpacity>
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
        style={{ marginLeft: 15,width:'20%',right:10 }}
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