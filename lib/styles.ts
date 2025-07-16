import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
  body: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    flexShrink: 0,
    justifyContent: "space-between",
    marginVertical: 100,
  },
  input: {
    borderColor: "lightgrey",
    borderRadius: 5,
    borderStyle: "solid",
    borderWidth: 1,
    fontSize: 16,
    margin: 10,
    padding: 10,
  },
  messageAuthor: { fontWeight: "bold" },
  messageContainer: {
    borderBottomColor: "#6c757d",
    borderBottomWidth: 1,
    borderRadius: 0,
    borderStyle: "solid",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 6,
  },
  name: {
    alignSelf: "center",
    backgroundColor: "#212529",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  nameText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  timestamp: {
    color: "#6c757d",
  },
  title: {
    fontSize: 36,
    textAlign: "center",
  },
});

export default globalStyles;
