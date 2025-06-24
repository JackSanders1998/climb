import { SignIn } from "@/components/signin";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { Button, ContextMenu, Picker, Switch } from "@expo/ui/swift-ui";
import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import { Image } from "expo-image";
import { Stack } from "expo-router";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "./styles";

export default function Index() {
  const sortOptions = ["Newest", "Oldest"];

  const [sortIndex, setSortIndex] = useState(0);

  const sort = sortOptions[sortIndex] === "Newest" ? "desc" : "asc";

  const [funMode, setFunMode] = useState(false);

  const messages = useQuery(api.messages.list, { sort }) || [];

  const [newMessageText, setNewMessageText] = useState("");
  const sendMessage = useMutation(api.messages.send);

  const { bottom } = useSafeAreaInsets();

  const { user } = useUser();

  async function handleSendMessage(event: { preventDefault: () => void }) {
    event.preventDefault();
    setNewMessageText("");
    await sendMessage({ body: newMessageText });
  }

  return (
    <Fragment>
      <Stack.Screen
        options={{
          headerRight: () => (
            <ContextMenu>
              <ContextMenu.Items>
                <Picker
                  label="Sort"
                  options={sortOptions}
                  variant="menu"
                  selectedIndex={sortIndex}
                  onOptionSelected={({ nativeEvent: { index } }) =>
                    setSortIndex(index)
                  }
                />
              </ContextMenu.Items>
              <ContextMenu.Trigger>
                <Button style={{ width: 90, height: 50 }}>Options</Button>
              </ContextMenu.Trigger>
            </ContextMenu>
          ),
        }}
      />
      <Unauthenticated>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{
            padding: 16,
          }}
        >
          <SignIn />
        </ScrollView>
      </Unauthenticated>
      <Authenticated>
        {/* <List
          scrollEnabled={true}
          editModeEnabled={true}
          // onSelectionChange={(items) =>
          //   alert(`indexes of selected items: ${items.join(", ")}`)
          // }
          // moveEnabled={true}
          // onMoveItem={(from, to) =>
          //   alert(`moved item at index ${from} to index ${to}`)
          // }
          // onDeleteItem={(item) => alert(`deleted item at index: ${item}`)}
          style={{ flex: 1 }}
          listStyle="automatic"
          deleteEnabled={false}
          selectEnabled={true}
        >
          {messages.map((message, index) => (
            // <View
            //   key={index}
            //   style={{
            //     paddingVertical: 8,
            //   }}
            // >
            //   <Text style={{ fontSize: 17 }}>{message.body}</Text>
            //   <Text>{message.author.name}</Text>
            // </View>
            <LabelPrimitive
              key={index}
              title={message.author.name + ": " + message.body}
            />
          ))}
        </List> */}

        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          data={messages}
          testID="MessagesList"
          extraData={{ funMode }}
          ListHeaderComponent={
            <View
              style={{
                width: "100%",
                paddingHorizontal: 4,
                paddingVertical: 16,
              }}
            >
              <View
                style={{
                  width: "100%",
                  paddingVertical: 8,
                  paddingHorizontal: 8,
                  borderTopColor: "rgba(0,0,0,.25)",
                  borderTopWidth: 1,
                  borderStyle: "solid",
                  borderBottomColor: "rgba(0,0,0,.25)",
                  borderBottomWidth: 1,
                  marginVertical: 16,
                }}
              >
                <Switch
                  value={funMode}
                  onValueChange={(val) => setFunMode(val)}
                  label={funMode ? "I warned you" : "Don't click me"}
                  variant="switch"
                  style={{
                    width: "100%",
                  }}
                />
              </View>
              <Image
                source={{
                  uri: "https://media4.giphy.com/media/v1.Y2lkPTZjMDliOTUydW4wNGs1emY5bDIyNTNnMHNpaGtxNWttdTFoYTM5djhidzhheDZwOSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Vuw9m5wXviFIQ/source.gif",
                }}
                style={{
                  width: "100%",
                  aspectRatio: 1,
                  height: funMode ? "auto" : 0,
                }}
              />

              <View style={styles.name}>
                <Text style={styles.nameText} testID="NameField">
                  {user?.id}
                </Text>
                <Text style={styles.nameText} testID="NameField">
                  {user?.primaryEmailAddress?.emailAddress}
                </Text>
              </View>
            </View>
          }
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
        <View
          style={{
            height: bottom,
          }}
        ></View>
      </Authenticated>
    </Fragment>
  );
}
