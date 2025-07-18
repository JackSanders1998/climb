import { api } from "@/convex/_generated/api";
import { decodeDate } from "@/convex/utils/date";
import { useElapsedTime } from "@/lib/hooks/useElapsedTime";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { useCallback } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "../ui/Button";

const ElapsedTimeButton = ({
  enabled,
  start,
  onPress,
}: {
  enabled: boolean;
  start: DateTime;
  onPress: () => void;
}) => {
  const { chars } = useElapsedTime({
    enabled,
    start,
  });
  return (
    <Button
      title={chars.join("")}
      symbol="record.circle"
      variant="surface"
      onPress={onPress}
    />
  );
};

export const ActiveSessionFooter = () => {
  const { bottom } = useSafeAreaInsets();

  const session = useQuery(convexQuery(api.sessions.sessions.get, {}));

  const start = useMutation({
    mutationFn: useConvexMutation(api.sessions.sessions.create),
  });

  const end = useMutation({
    mutationFn: useConvexMutation(api.sessions.sessions.end),
  });

  const startOrEnd = useCallback(() => {
    if (session.data) {
      end.mutate({});
    } else {
      start.mutate({});
    }
  }, [session.data]);

  return (
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
    >
      {session.data?.startedAt && (
        <ElapsedTimeButton
          enabled={true}
          start={decodeDate(session.data?.startedAt)}
          onPress={startOrEnd}
        />
      )}
      <Button
        title={session.data ? undefined : "Add climb"}
        symbol="plus"
        variant="primary"
        onPress={startOrEnd}
      />
    </View>
  );
};
