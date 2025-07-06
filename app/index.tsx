import { Placeholder } from "@/lib/components/Placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { ScrollView, View } from "react-native";

export default function Climbs() {
  return (
    <View className="flex-1">
      <ScrollView className="flex-1">
        {Array.from({ length: 20 }).map((_, i) => (
          <Placeholder key={i} text={`Climb ${i + 1}`} />
        ))}
      </ScrollView>
      <View className="absolute left-0 right-0 bottom-0 items-center z-10">
        <LinearGradient
          colors={["rgba(255,255,255,0)", "rgba(255,255,255,1)"]}
          style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 96, borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
          pointerEvents="none"
        />
        <View className="bottom-8 absolute left-0 right-0 items-center">
          <Link
            href="/preferences"
            className="bg-black text-white py-2.5 px-7 rounded-full font-bold text-lg overflow-hidden"
          >
            Add Climbs
          </Link>
        </View>
      </View>
    </View>
  );
}
