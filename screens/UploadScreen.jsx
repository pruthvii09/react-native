import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Logo, Sample, newSample } from "../assets";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { firestoreDB, uploadToFirebase } from "../config/firebase";
import { Feather } from "@expo/vector-icons";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

const UploadScreen = () => {
  const user = useSelector((state) => state.user.user);
  const navigation = useNavigation();
  const [permission, requestPermission] = ImagePicker.useCameraPermissions();
  const [uploadImage, setUploadImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [caption, setCaption] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isphotoUploading, setIsPhotoUploading] = useState(false);
  const [posts, setPosts] = useState([]);
  const takePhoto = async () => {
    requestPermission(); // Make sure to call the function with parentheses
    try {
      setIsLoading(true);
      const cameraResp = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
      });

      if (!cameraResp.canceled) {
        // Fix the property name here: it should be 'cancelled' instead of 'canceled'
        console.log(cameraResp.assets[0].uri);
        const { uri } = cameraResp.assets[0];
        console.log("URI:", uri);

        const fileName = uri.split("/").pop(); // Split by '/' and get the last element
        console.log("FileName:", fileName);

        const uploadResp = await uploadToFirebase(uri, fileName, (v) => {
          const formattedPercentage = parseFloat(v).toFixed(2); // Format percentage to 2 decimal places
          console.log(formattedPercentage, "%");
          setUploadStatus(formattedPercentage);
        });
        setIsLoading(false);
        console.log("Upload Resp", uploadResp.downloadUrl);
        setUploadImage(uploadResp?.downloadUrl);
      }
    } catch (e) {
      Alert.alert("Error While Uploading: " + e.message);
    }
  };
  const postPhoto = async () => {
    setIsPhotoUploading(true);
    let id = `${Date.now()}`;
    const data = {
      _id: id,
      photoUrl: uploadImage,
      user: user,
      caption: caption,
      username: user?.username,
      timeStamp: serverTimestamp(),
    };
    try {
      const docRef = await addDoc(collection(firestoreDB, "posts"), data);
      setUploadImage(null);
      setCaption("");
      setIsPhotoUploading(false);
      navigation.navigate("SocialScreen");
    } catch (e) {
      console.log("Error", e);
      setIsPhotoUploading(false);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsCollectionRef = collection(firestoreDB, "posts");
        const usernameFilteredQuery = query(
          postsCollectionRef,
          where("username", "==", user?.username)
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

  return (
    <ScrollView>
      <View className="flex-1 pt-12">
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
        <View className="p-5 mt-5">
          <View>
            {isLoading ? (
              <TouchableOpacity
                style={{
                  aspectRatio: 4 / 3,
                  alignItems: "center",
                  marginBottom: 10,
                }}
                className="w-[100%] flex justify-center bg-slate-300 rounded-lg"
              >
                <ActivityIndicator size={"large"} color={"#43C651"} />
                <Text>{uploadStatus}</Text>
              </TouchableOpacity>
            ) : uploadImage ? (
              <Image
                style={{
                  width: "100%",
                  aspectRatio: 4 / 3,
                  borderRadius: 15,
                  marginBottom: 10,
                }}
                source={{ uri: uploadImage }}
                resizeMode="cover"
              />
            ) : (
              <TouchableOpacity
                onPress={takePhoto}
                style={{
                  aspectRatio: 4 / 3,
                  alignItems: "center",
                  marginBottom: 10,
                }}
                className="w-[100%] flex justify-center bg-slate-300 rounded-lg"
              >
                <Feather name="upload" size={24} color="black" />
              </TouchableOpacity>
            )}
            <TextInput
              className="p-2 text-lg"
              onChangeText={(text) => setCaption(text)}
              placeholder="Enter Your Caption"
            />
          </View>

          {uploadImage ? (
            <TouchableOpacity
              onPress={postPhoto}
              className="flex rounded-xl p-4 bg-primary justify-center text-center"
            >
              <Text className="font-semibold text-center text-white">
                {isphotoUploading ? "Uploading....." : "Upload Photo"}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={takePhoto}
              className="flex rounded-xl p-4 bg-primary justify-center text-center"
            >
              <Text className="font-semibold text-center text-white">
                Take Photo
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View className="flex gap-1 flex-wrap z-10 justify-start p-2 flex-row">
          {posts?.map((post) => (
            <View key={post?._id}>
              <TouchableOpacity>
                <Image className="w-28 h-28" source={{ uri: post?.photoUrl }} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default UploadScreen;
