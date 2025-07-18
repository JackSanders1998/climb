import { ActiveSessionFooter } from "@/lib/components/ActiveSessionFooter";
import SillyNav from "@/lib/components/SillyNav";
import React, { useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Summary() {
  const [footerHeight, setFooterHeight] = useState(0);

  const { bottom } = useSafeAreaInsets();

  return (
    <>
      <SillyNav pageName="Summary" paddingBottom={footerHeight} />

      <View
        style={{
          bottom,
          position: "absolute",
          left: 8,
          right: 8,
          width: "auto",
          justifyContent: "center",
          flexDirection: "row",
          gap: 8,
        }}
        onLayout={(e) => setFooterHeight(e.nativeEvent.layout.height)}
      >
        <ActiveSessionFooter />
      </View>
    </>
  );
}
