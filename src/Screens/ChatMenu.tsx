import React, { useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView, StyleSheet } from "react-native";
import TextFieldUI from "../components/TextFieldUI";
import ButtonBlue from "../components/ButtonBlue";
import TextUI from "../components/TextUI";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const ChatMenu = ()=>{

    return(
<View style={{flex:1}}>
<View>
    
    <TouchableOpacity>
<ButtonBlue text="Start new chat" ></ButtonBlue>
    </TouchableOpacity>
    

    <TouchableOpacity>
<ButtonBlue text="Enter code to join existing chatroom" ></ButtonBlue>
    </TouchableOpacity>

</View>

</View>
    )
}