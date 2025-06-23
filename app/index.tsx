import { SignIn } from "@/components/signin";
import { api } from "@/convex/_generated/api";
import { useAuth, useUser } from "@clerk/clerk-expo";
import styled from "@emotion/native";
import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import { Image } from "expo-image";
import {
  ImagePickerAsset,
  launchImageLibraryAsync,
  MediaTypeOptions,
  requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";
import React, { useState } from "react";
import {
  Button,
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";
import styles from "./styles";

const ImageTouchable = styled.TouchableOpacity`
  padding: 8px;

  justify-content: center;
  align-items: center;
`;

export default function Index() {
  const messages = useQuery(api.messages.list) || [];

  const [newMessageText, setNewMessageText] = useState("");
  const sendMessage = useMutation(api.messages.send);
  const [imagePickerAsset, setImagePickerAsset] =
    useState<ImagePickerAsset | null>(null);
  const generateUploadUrl = useMutation(api.messages.generateUploadUrl);
  const sendImage = useMutation(api.messages.sendImage);

  const { user } = useUser();

  const { signOut } = useAuth();

  const handleImagePressed = async () => {
    const { granted } = await requestMediaLibraryPermissionsAsync();

    if (granted) {
      const image = await launchImageLibraryAsync({
        ...{
          quality: 1,
          aspect: [1, 1],
          mediaTypes: MediaTypeOptions.Images,
        },
      });

      setImagePickerAsset(image.assets?.[0] || null);
    }
  };

  async function handleSendMessage(event: { preventDefault: () => void }) {
    let imageUrlId;

    if (imagePickerAsset) {
      const url = await generateUploadUrl();
      const response = await fetch(imagePickerAsset.uri);
      const blob = await response.blob();

      const result = await fetch(url, {
        method: "POST",
        headers: imagePickerAsset.type
          ? { "Content-Type": `${imagePickerAsset.type}/*` }
          : {},
        body: blob,
      });

      const { storageId } = await result.json();
      await sendImage({ storageId });

      imageUrlId = storageId;
    }

    event.preventDefault();
    setNewMessageText("");
    await sendMessage({ body: newMessageText, imageUrlId });
  }

  const image = imagePickerAsset?.uri;

  return (
    <SafeAreaView style={styles.body}>
      <Text style={styles.title}>Convex Chat</Text>
      <Unauthenticated>
        <SignIn />
      </Unauthenticated>
      <Authenticated>
        <Button title="Sign out" onPress={() => signOut()} />
        <View style={styles.name}>
          <Text style={styles.nameText} testID="NameField">
            {user?.id}
          </Text>
          <Text style={styles.nameText} testID="NameField">
            {user?.primaryEmailAddress?.emailAddress}
          </Text>
        </View>
        <ImageTouchable activeOpacity={0.7} onPress={handleImagePressed}>
          <Image
            source={{ uri: image || "" }}
          />
          {!image ? (
            <div>
              camera icon
            </div>
          ) : null}
        </ImageTouchable>
        <FlatList
          data={messages.slice(-10)}
          testID="MessagesList"
          renderItem={(x) => {
            const message = x.item;
            return (
              <View style={styles.messageContainer}>
                <Text>
                  <Text style={styles.messageAuthor}>
                    {message.author.name}:
                  </Text>{" "}
                  {message.body}
                </Text>
                <Text style={styles.timestamp}>
                  {new Date(message._creationTime).toLocaleTimeString()}
                </Text>
              </View>
            );
          }}
        />
        <TextInput
          placeholder="Write a message…"
          style={styles.input}
          onSubmitEditing={handleSendMessage}
          onChangeText={(newText) => setNewMessageText(newText)}
          defaultValue={newMessageText}
          testID="MessageInput"
        />
      </Authenticated>
    </SafeAreaView>
  );
}
