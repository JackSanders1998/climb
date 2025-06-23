import { SignIn } from "@/components/signin";
import { api } from "@/convex/_generated/api";
import { useAuth, useUser } from "@clerk/clerk-expo";
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
  View
} from "react-native";
import styles from "./styles";

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
        {/* <View style={styles.name}>
          <ImageTouchable activeOpacity={0.7} onPress={handleImagePressed}>
            <Image
              style={{
                width: 148,
                height: 148,
                borderRadius: 80,
              }}
              source={{ uri: image || "" }}
            />
            <Text style={styles.nameText} testID="NameField">
              camera icon
              {image ? " (tap to change)" : ""}
              {image}
            </Text>
          </ImageTouchable>
        </View> */}
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
                {message.imageUrl ? (
                  <Image
                    style={{
                      width: 100,
                      height: 100,
                    }}
                    source={{ uri: message.imageUrl }}
                  />
                ) : null}
                <Text style={styles.timestamp}>
                  {new Date(message._creationTime).toLocaleTimeString()}
                </Text>
              </View>
            );
          }}
        />
        {image && (
          <View style={{ alignItems: "center", marginBottom: 12 }}>
            <Image
              style={{ width: 148, height: 148, borderRadius: 80, marginBottom: 4 }}
              source={{ uri: image }}
            />
            <Text style={styles.nameText}>Selected photo preview</Text>
          </View>
        )}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          {/* Message input */}
          <TextInput
            placeholder="Write a message…"
            style={[styles.input, { flex: 1, marginRight: 8 }]}
            onSubmitEditing={handleSendMessage}
            onChangeText={(newText) => setNewMessageText(newText)}
            defaultValue={newMessageText}
            testID="MessageInput"
          />
          {/* Photo selector button */}
          <Button
            title={image ? "Change Photo" : "Add Photo"}
            onPress={handleImagePressed}
            testID="PhotoSelectorButton"
          />
          {/* Send button */}
          <Button
            title="Send"
            onPress={handleSendMessage}
            disabled={!newMessageText && !image}
            testID="SendButton"
          />
        </View>
      </Authenticated>
    </SafeAreaView>
  );
}
