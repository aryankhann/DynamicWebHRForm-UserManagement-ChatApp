import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from "react-native";
import TextFieldUI from "../components/TextFieldUI";
import ButtonBlue from "../components/ButtonBlue";
import TextUI from "../components/TextUI";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faComments, faKey, faTimes } from "@fortawesome/free-solid-svg-icons";

const ChatMenu = ({ navigation }: any) => {
  const [showModal, setShowModal] = useState(false);
  const [roomCode, setRoomCode] = useState("");

  const handleGenerateCode = ()=>{
  const code = Math.random().toString(32).substring(2, 8);

navigation.navigate("ChatApp",{roomCode:code})
  }
  const handleJoinRoom = () => {
    if (!roomCode.trim()) return;
    setShowModal(false);
    navigation.navigate("ChatApp", { roomCode });
    setRoomCode("");
  };

  return (
    <View style={styles.container}>
      <TextUI text="Chat Rooms" style={styles.title} />

      <TouchableOpacity style={styles.card} onPress={handleGenerateCode}>
        <FontAwesomeIcon icon={faComments} size={24} color="#0C64AE" />
        <TextUI text="Start New Chat" style={styles.cardText} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => setShowModal(true)}>
        <FontAwesomeIcon icon={faKey} size={22} color="#0C64AE" />
        <TextUI text="Join with Code" style={styles.cardText} />
      </TouchableOpacity>

      <Modal
        transparent
        animationType="fade"
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <TextUI text="Enter Room Code" style={styles.modalTitle} />
              <Pressable onPress={() => setShowModal(false)}>
                <FontAwesomeIcon icon={faTimes} size={18} color="#6b7280" />
              </Pressable>
            </View>

            <TextFieldUI
              pholder="e.g. Room-52"
              value={roomCode}
              style={{width:'100%'}}
              onChangeText={setRoomCode}
            />

            <View style={styles.modalButtons}>
              <ButtonBlue
                text="Cancel"
                onNext={() => setShowModal(false)}
                style={styles.cancelBtn}
              />
              <ButtonBlue
                text="Join"
                onNext={handleJoinRoom}
                style={styles.joinBtn}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ChatMenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
  },

  card: {
    width: "80%",
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 16,
    elevation: 3,
  },

  cardText: {
    fontSize: 16,
    fontWeight: "600",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalCard: {
    width: "90%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 10,
  },

  cancelBtn: {
    flex: 1,
    backgroundColor: "gray",
  },

  joinBtn: {
    flex: 1,
  },
});
