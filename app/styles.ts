import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  messageAuthor: { fontWeight: "bold" },
  messageContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderBottomColor: "#6c757d",
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderRadius: 0,
  },
  name: {
    backgroundColor: "#212529",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
    marginHorizontal: 4,
    marginVertical: 16,
  },
  nameText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  title: {
    textAlign: "center",
    fontSize: 36,
  },
  body: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    flexGrow: 1,
    flexShrink: 0,
    marginVertical: 100,
  },
  timestamp: {
    color: "#6c757d",
  },
  input: {
    fontSize: 16,
    margin: 10,
    padding: 10,
    borderStyle: "solid",
    borderColor: "lightgrey",
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default styles;
