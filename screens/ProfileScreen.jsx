import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { Text } from "react-native";
import { firebaseAuth, firestoreDB } from "../config/firebase";
import { SET_USER_NULL } from "../context/actions/userActions";
import { collection, getDocs, limit, query, where } from "firebase/firestore";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsCollectionRef = collection(firestoreDB, "posts");
        const usernameFilteredQuery = query(
          postsCollectionRef,
          where("username", "==", user?.username),
          limit(3)
        );

        const querySnapshot = await getDocs(usernameFilteredQuery);
        const fetchedPosts = [];

        querySnapshot.forEach((doc) => {
          fetchedPosts.push({ id: doc.id, ...doc.data() });
        });

        setPosts(fetchedPosts);
        console.log(posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []); // Empty dependency array to run the effect only once on component mount

  const handleLogout = async () => {
    await firebaseAuth.signOut().then(() => {
      dispatch(SET_USER_NULL());
      navigation.replace("LoginScreen");
    });
  };
  return (
    <ScrollView>
      <SafeAreaView className="flex-1 pt-12 items-center justify-start">
        {/* icons  */}

        <View className="w-full flex-row items-center justify-between px-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={32} color={"#555"} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Entypo name="dots-three-vertical" size={24} color={"#555"} />
          </TouchableOpacity>
        </View>
        <View className="items-center justify-center">
          <View className="relative border-2 border-primary p-1 rounded-full">
            <Image
              className="w-24 h-24"
              resizeMode="contain"
              source={{ uri: user?.profilePic }}
            />
          </View>
          <Text className="text-xl font-semibold text-primaryBold pt-3">
            {user?.fullName}
          </Text>
          <Text className="text-base font-semibold text-primaryText">
            {user.providerData.email}
          </Text>
        </View>
        <View className="w-full flex-row items-center justify-evenly py-6">
          <View className="items-center justify-center">
            <TouchableOpacity
              onPress={() => navigation.navigate("HomeScreen")}
              className="items-center justify-center w-12 h-12 rounded-lg bg-gray-200"
            >
              <MaterialIcons
                name="messenger-outline"
                size={24}
                color={"#555"}
              />
            </TouchableOpacity>
            <Text className="text-sm text-primaryText py-1">Messages</Text>
          </View>
          <View className="items-center justify-center">
            <TouchableOpacity className="items-center justify-center w-12 h-12 rounded-lg bg-gray-200">
              <Ionicons name="ios-videocam-outline" size={24} color={"#555"} />
            </TouchableOpacity>
            <Text className="text-sm text-primaryText py-1">Video Call</Text>
          </View>
          <View className="items-center justify-center">
            <TouchableOpacity className="items-center justify-center w-12 h-12 rounded-lg bg-gray-200">
              <Ionicons name="call-outline" size={24} color={"#555"} />
            </TouchableOpacity>
            <Text className="text-sm text-primaryText py-1"> Voice Call</Text>
          </View>
          <View className="items-center justify-center">
            <TouchableOpacity className="items-center justify-center w-12 h-12 rounded-lg bg-gray-200">
              <Entypo name="dots-three-horizontal" size={24} color={"#555"} />
            </TouchableOpacity>
            <Text className="text-sm text-primaryText py-1">More</Text>
          </View>
        </View>
        {/* medias shared  */}
        <View className="w-full px-6 space-y-3">
          <View className="w-full flex-row items-center justify-between">
            <Text className="text-base font-semibold text-primaryText">
              Media Shared
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("UploadScreen")}
            >
              <Text className="text-base font-semibold uppercase text-primaryText">
                View All
              </Text>
            </TouchableOpacity>
          </View>
          <View className="w-full flex-row items-center justify-between">
            {posts?.map((post) => (
              <TouchableOpacity
                key={post?._id}
                className="w-24 h-24 m-1 rounded-xl bg-gray-300 overflow-hidden"
              >
                <Image
                  source={{
                    uri: post?.photoUrl,
                  }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View className="w-full px-6 py-4 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <MaterialIcons name="security" size={24} color={"#555"} />
            <Text className="text-base font-semibold text-primaryText px-3">
              Privacy
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={32} color={"#555"} />
        </View>
        <View className="w-full px-6 py-4 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <MaterialIcons name="music-note" size={24} color={"#555"} />
            <Text className="text-base font-semibold text-primaryText px-3">
              Meadia and Downloads
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={32} color={"#555"} />
        </View>
        <View className="w-full px-6 py-4 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <MaterialIcons name="person" size={24} color={"#555"} />
            <Text className="text-base font-semibold text-primaryText px-3">
              Account
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={32} color={"#555"} />
        </View>
        <TouchableOpacity
          onPress={handleLogout}
          className="w-full px-6 py-4 flex-row items-center justify-center"
        >
          <Text className="text-lg font-semibold text-primaryBold px-3">
            Logout
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ScrollView>
  );
};

export default ProfileScreen;
