import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Logo } from "../assets";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { firestoreDB } from "../config/firebase";

const HomeScreen = () => {
  const user = useSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState(null);
  const navigation = useNavigation();
  useLayoutEffect(() => {
    const chatQuery = query(
      collection(firestoreDB, "chats"),
      orderBy("_id", "desc")
    );

    const unsubscribe = onSnapshot(chatQuery, (querySnapShot) => {
      const chatRooms = querySnapShot.docs.map((doc) => doc.data());
      setChats(chatRooms);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);
  return (
    <View className="flex-1 pt-12">
      <SafeAreaView>
        <View className="w-full flex-row items-center justify-between px-4 py-2">
          <TouchableOpacity onPress={() => navigation.navigate("SocialScreen")}>
            <Image source={Logo} className="w-12 h-12" resizeMode="contain" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("ProfileScreen")}
            className="w-12 h-12 rounded-full border border-primary flex items-center justify-center"
          >
            <Image
              source={{ uri: user?.profilePic }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
        <ScrollView className="w-full px-4 pt-4">
          <View className="w-full flex-row items-center justify-between px-2">
            <Text className="text-primaryText text-base font-extrabold pb-2">
              Messages
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("AddToChatScreen")}
            >
              <Ionicons name="chatbox" size={28} color={"#555"} />
            </TouchableOpacity>
          </View>
          {/* {chats?.map((room) => {
            return room.user.username === user.username ? (
              <MessageCard room={room} key={room._id} />
            ) : (
              <React.Fragment key={room._id} />
            );
          })} */}

          {isLoading ? (
            <View className="w-full flex items-center justify-center">
              <ActivityIndicator size={"large"} color={"#43C651"} />
            </View>
          ) : (
            <>
              {chats && chats?.length > 0
                ? chats?.map((room) =>
                    room?.user?.username === user?.username ||
                    room?.username === user?.username ? (
                      <MessageCard room={room} key={room?._id} />
                    ) : null
                  )
                : null}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
const MessageCard = ({ room }) => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user);
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("ChatScreen", { room: room })}
      className="w-full flex-row items-center justify-start py-2"
    >
      {/* images */}
      <View className="w-16 h-16 rounded-full flex items-center border-2 border-primary p-1 justify-center">
        <FontAwesome5 name="users" size={24} color={"#555"} />
      </View>
      {/* content */}
      <View className="flex-1 flex items-start justify-center ml-4">
        <Text className="text-[#333] text-base font-semibold capitalize">
          {room?.addedUser === user?.fullName
            ? room?.user?.fullName
            : room?.addedUser}
        </Text>
        <Text className="text-primaryText text-sm text-justify">
          Lorem ipsum dolor, sit amet consectetur adipisicing..
        </Text>
      </View>
      {/* time */}
      <Text className="text-primary px-4 text-base font-semibold">28 min</Text>
    </TouchableOpacity>
  );
};

export default HomeScreen;
