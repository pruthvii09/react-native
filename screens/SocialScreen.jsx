import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Logo, LogoName } from "../assets";
import {
  AntDesign,
  Feather,
  FontAwesome,
  FontAwesome5,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { firestoreDB } from "../config/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

const SocialScreen = () => {
  const user = useSelector((state) => state.user.user);
  const navigation = useNavigation();
  const [posts, setPosts] = useState();
  useEffect(() => {
    const q = query(
      collection(firestoreDB, "posts"),
      orderBy("timeStamp", "desc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsData = [];
      querySnapshot.forEach((doc) => {
        postsData.push(doc?.data());
      });
      setPosts(postsData);
      console.log(postsData);
    });

    // This cleanup function will unsubscribe the snapshot listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View className="flex-1 pt-12">
      <SafeAreaView>
        <View className="w-full flex-row items-center justify-between px-4 py-2">
          <TouchableOpacity onPress={() => navigation.navigate("SocialScreen")}>
            <Image source={Logo} className="w-12 h-12" resizeMode="contain" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("SocialScreen")}>
            <Image
              source={LogoName}
              className="w-36 h-12"
              resizeMode="contain"
            />
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
              Timeline
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("UploadScreen")}
            >
              <AntDesign name="pluscircleo" size={24} color="black" />
            </TouchableOpacity>
          </View>
          {posts?.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
const PostCard = ({ post }) => {
  return (
    <View className="pb-4">
      <View className="py-2 flex flex-row justify-start align-middle gap-2">
        <View className="w-14 z-10 h-14 rounded-full border border-primary flex items-center justify-center">
          <Image
            source={{ uri: post?.user?.profilePic }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <View>
          <Text className="font-semibold text-[18px]">
            {post?.user?.fullName}
          </Text>
          <Text>52 minute ago</Text>
        </View>
      </View>
      <View className="z-30">
        <Text className="mb-1">{post?.caption}</Text>
        <Image
          style={{ height: 350 }}
          className="w-full rounded-xl"
          source={{ uri: post?.photoUrl }}
          resizeMode="cover"
        />
      </View>
      <View className="flex flex-row justify-between px-4 py-2">
        <View className="flex flex-row gap-4">
          <TouchableOpacity>
            <FontAwesome name="heart-o" size={26} color="black" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="send" size={26} color="black" />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity>
            <FontAwesome5 name="bookmark" size={26} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
export default SocialScreen;
