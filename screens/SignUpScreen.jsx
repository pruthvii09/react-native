import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { BGImage, Logo } from "../assets";
import { UserTextInput } from "../components";
import { useNavigation } from "@react-navigation/native";
import { avatars } from "../utils/supports";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth, firestoreDB } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Toast } from "react-native-toast-message/lib/src/Toast";

const SignUpScreen = () => {
  const screenWidth = Math.round(Dimensions.get("window").width);
  const screenHeight = Math.round(Dimensions.get("window").height);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(avatars[0].image.asset.url);
  const [isAvatarMenu, setIsAvatarMenu] = useState(false);
  const [getEmailValidationStatus, setGetEmailValidationStatus] =
    useState(false);
  const handleAvatar = (item) => {
    setAvatar(item?.image.asset.url);
    setIsAvatarMenu(false);
  };
  const handleSignUp = async () => {
    if (getEmailValidationStatus && email !== "") {
      await createUserWithEmailAndPassword(firebaseAuth, email, password).then(
        (userCred) => {
          const data = {
            _id: userCred?.user.uid,
            fullName: name,
            username: username,
            profilePic: avatar,
            providerData: userCred.user.providerData[0],
          };
          setDoc(doc(firestoreDB, "users", userCred?.user.uid), data).then(
            () => {
              navigation.navigate("LoginScreen");
            }
          );
        }
      );
    }
    Toast.show({
      type: "error",
      text1: "Enter correct Details!",
      position: "top",
      topOffset: 145,
    });
  };
  const navigation = useNavigation();
  return (
    <ScrollView>
      <View className="flex-1 items-center justify-start">
        <Image
          source={BGImage}
          resizeMode="cover"
          className="h-96"
          style={{ width: screenWidth }}
        />
        {isAvatarMenu && (
          <>
            <View
              className="absolute inset-0 z-20 h-full"
              style={{ width: screenWidth }}
            >
              <ScrollView>
                <BlurView
                  className="w-full h-full px-4 py-16 flex-row flex-wrap items-center justify-evenly"
                  tint="light"
                  intensity={80}
                  style={{ width: screenWidth, height: screenHeight }}
                >
                  {avatars?.map((item) => (
                    <TouchableOpacity
                      key={item._id}
                      className="w-20 m-3 h-20 p-1 rounded-full border-2 relative"
                      onPress={() => handleAvatar(item)}
                    >
                      <Image
                        source={{ uri: item?.image.asset.url }}
                        className="w-full h-full"
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  ))}
                </BlurView>
              </ScrollView>
            </View>
          </>
        )}
        <View
          className="w-full h-full bg-white rounded-tl-[90px] -mt-44 flex items-center 
      justify-start py-6 px-6 space-y-6"
        >
          <Image source={Logo} className="w-16 h-16" resizeMode="contain" />
          <Text className=" text-primaryText text-xl font-semibold">
            Join Us
          </Text>
          {/* avatar */}
          <View className="w-full flex items-center justify-center relative -my-4">
            <TouchableOpacity
              onPress={() => setIsAvatarMenu(true)}
              className="w-20 h-20 p-1 rounded-full border-2 border-primary relative"
            >
              <Image
                source={{ uri: avatar }}
                className="w-full h-full"
                resizeMode="contain"
              />
              <View className="w-6 h-6 bg-primary rounded-full absolute top-0 right-0 flex items-center justify-center">
                <MaterialIcons name="edit" size={18} color={"#fff"} />
              </View>
            </TouchableOpacity>
          </View>
          <View className="w-full flex items-center">
            <UserTextInput
              placeholder="Full Name"
              isPass={false}
              setStateValue={setName}
            />
            <UserTextInput
              placeholder="Username"
              isPass={false}
              setStateValue={setUsername}
            />
            <UserTextInput
              placeholder="Email"
              isPass={false}
              setStateValue={setEmail}
              setGetEmailValidationStatus={setGetEmailValidationStatus}
            />
            <UserTextInput
              placeholder="Password"
              isPass={true}
              setStateValue={setPassword}
            />
            <TouchableOpacity
              onPress={handleSignUp}
              className="w-full px-4 py-2 rounded-xl bg-primary my-3 flex items-center justify-center"
            >
              <Text className="py-2 text-white text-xl font-semibold -z-10">
                Sign In
              </Text>
            </TouchableOpacity>
            <View className="w-full flex-row items-center justify-center space-x-2">
              <Text className="text-base text-primaryText">
                Have an account?
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("LoginScreen")}
              >
                <Text className="text-base font-semibold text-primaryBold">
                  Login Here
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <Toast />
    </ScrollView>
  );
};

export default SignUpScreen;
