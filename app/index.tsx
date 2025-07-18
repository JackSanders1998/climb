import { ActiveSessionFooter } from "@/lib/components/ActiveSessionFooter";
import SillyNav from "@/lib/components/SillyNav";
import { Glur } from "@/lib/ui/Glur";

import React, { useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Summary() {
  const [footerHeight, setFooterHeight] = useState(0);

  const { bottom } = useSafeAreaInsets();

  return (
    <>
      <SillyNav pageName="Summary" paddingBottom={footerHeight - bottom} />

      <View
        style={{
          bottom: 0,
          position: "absolute",
          left: 8,
          right: 8,
          width: "auto",
          justifyContent: "center",
          flexDirection: "row",
          gap: 8,
          padding: 24,
          paddingBottom: bottom + 24,
        }}
        onLayout={(e) => setFooterHeight(e.nativeEvent.layout.height)}
      >
        <Glur
          direction="b2t"
          style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
        />
        <ActiveSessionFooter />
      </View>
    </>
  );
}
