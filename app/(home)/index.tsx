import { AppText } from "@/lib/components/AppText";
import { Button } from "@/lib/components/Button";
import { Link, useRouter } from "expo-router";
import { View } from "react-native";

export default function IndexScreen() {
  const router = useRouter();
  const canGoBack = router.canGoBack();

  return (
    <View className="justify-center flex-1 p-4">
      <AppText center>Index Screen</AppText>
      <Link href="/home-nested" push asChild>
        <Button title="Push to /home-nested" />
      </Link>
      {canGoBack ? (
        <Button
          title="Back"
          theme="secondary"
          onPress={() => {
            router.back();
          }}
        />
      ) : null}
    </View>
  );
}
