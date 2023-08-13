import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { Image } from "react-native";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { firestoreDB } from "../config/firebase";
const AddToChatScreen = () => {
  const user = useSelector((state) => state.user.user);
  const navigation = useNavigation();
  const [addChat, setAddChat] = useState("");
  const [addedUser, setAddedUser] = useState({});

  const createNewChat = async () => {
    const q = query(
      collection(firestoreDB, "users"),
      where("username", "==", addChat)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc?.data());
      setAddedUser(doc?.data());
      console.log(addedUser);
    });
    let id = `${Date.now()}`;
    const _doc = {
      _id: id,
      user: user,
      addedUser: addedUser?.fullName,
      username: addChat,
    };
    if (addChat !== "") {
      setDoc(doc(firestoreDB, "chats", id), _doc)
        .then(() => {
          setAddChat("");
          navigation.replace("HomeScreen");
        })
        .catch((err) => {
          alert("Error : ", err);
        });
    }
  };
  return (
    <View className="flex-1">
      <View className="w-full bg-primary px-4 py-4 flex-[0.25]">
        <View className="flex-row items-center justify-between  w-full px-4 py-12">
          {/* goback */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={32} color={"#fbfbfb"} />
          </TouchableOpacity>
          {/* middle */}
          {/* lastsection */}
          <View className="w-12 h-12 rounded-full border border-primary flex items-center justify-center">
            <Image
              source={{ uri: user?.profilePic }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        </View>
      </View>
      {/* bottom section */}
      <View classcreateNewChatName="w-full bg-white px-4 py-6 rounded-3xl flex-1 rounded-t-[50px] -mt-10">
        <View className="w-full px-4 py-4">
          <View className="w-full px-4 flex-row items-center justify-between py-3 rounded-xl border border-gray-200 space-x-3">
            {/* icons */}
            <Ionicons name="chatbubbles" size={24} color={"#777"} />
            {/* text input  */}
            <TextInput
              className="flex-1 text-lg text-primaryText -my-2 h-12 w-full z-20"
              placeholder="Create a Chat"
              placeholderTextColor={"#999"}
              value={addChat}
              onChangeText={(text) => setAddChat(text)}
            />
            {/* icon  */}
            <TouchableOpacity onPress={createNewChat}>
              <FontAwesome name="send" size={24} color={"#777"} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AddToChatScreen;
