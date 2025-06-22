import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import React, { useState } from "react";
import { FlatList, SafeAreaView, Text, TextInput, View } from "react-native";
import styles from "./styles";

export default function Index() {
  const messages = useQuery(api.messages.list) || [];

  const [newMessageText, setNewMessageText] = useState("");
  const sendMessage = useMutation(api.messages.send);

  const [name] = useState(() => "User " + Math.floor(Math.random() * 10000));
  async function handleSendMessage(event: { preventDefault: () => void }) {
    event.preventDefault();
    setNewMessageText("");
    await sendMessage({ body: newMessageText, author: name });
  }

  return (
    <SafeAreaView style={styles.body}>
      <Text style={styles.title}>Convex Chat</Text>
      <View style={styles.name}>
        <Text style={styles.nameText} testID="NameField">
          {name}
        </Text>
      </View>
      <FlatList
        data={messages.slice(-10)}
        testID="MessagesList"
        renderItem={(x) => {
          const message = x.item;
          return (
            <View style={styles.messageContainer}>
              <Text>
                <Text style={styles.messageAuthor}>{message.author}:</Text>{" "}
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
    </SafeAreaView>
  );
}