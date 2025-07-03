import { SignIn } from "@/lib/components/signin";
import { api } from "@/convex/_generated/api";
import { useAuth, useUser } from "@clerk/clerk-expo";
import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import React, { useState } from "react";
import {
  Button,
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";
import styles from "../lib/components/styles";

export default function Index() {
  const messages = useQuery(api.messages.list) || [];

  const [newMessageText, setNewMessageText] = useState("");
  const sendMessage = useMutation(api.messages.send);

  const { user } = useUser();

  const { signOut } = useAuth();

  async function handleSendMessage(event: { preventDefault: () => void }) {
    event.preventDefault();
    setNewMessageText("");
    await sendMessage({ body: newMessageText });
  }

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
