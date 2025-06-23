import { SignIn } from "@/components/signin";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import React, { Fragment, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import styles from "./styles";

export default function Index() {
  const messages = useQuery(api.messages.list) || [];

  const [newMessageText, setNewMessageText] = useState("");
  const sendMessage = useMutation(api.messages.send);

  const { user } = useUser();

  async function handleSendMessage(event: { preventDefault: () => void }) {
    event.preventDefault();
    setNewMessageText("");
    await sendMessage({ body: newMessageText });
  }

  return (
    <Fragment>
      <Unauthenticated>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{}}
          contentContainerStyle={{
            padding: 16,
          }}
        >
          <SignIn />
        </ScrollView>
      </Unauthenticated>
      <Authenticated>
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          data={messages.slice(-10)}
          testID="MessagesList"
          ListHeaderComponent={() => (
            <Fragment>
              <View style={styles.name}>
                <Text style={styles.nameText} testID="NameField">
                  {user?.id}
                </Text>
                <Text style={styles.nameText} testID="NameField">
                  {user?.primaryEmailAddress?.emailAddress}
                </Text>
              </View>
            </Fragment>
          )}
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
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ position: "fixed", bottom: 0 }}
        >
          <TextInput
            placeholder="Write a message…"
            style={{ ...styles.input }}
            onSubmitEditing={handleSendMessage}
            onChangeText={(newText) => setNewMessageText(newText)}
            defaultValue={newMessageText}
            testID="MessageInput"
          />
        </KeyboardAvoidingView>
      </Authenticated>
    </Fragment>
  );
}
