import { DateTime, Duration } from "luxon";
import { useEffect, useState } from "react";

export const useElapsedTime = ({
  enabled,
  start,
}: {
  enabled: boolean;
  start: DateTime;
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(
    DateTime.now().diff(start).as("seconds"),
  );

  useEffect(() => {
    if (!enabled) {
      setElapsedSeconds(0);
    }

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [enabled]);

  const duration = Duration.fromObject({
    seconds: elapsedSeconds,
  });

  const seconds = duration.seconds;

  const chars = duration.toFormat("hh:mm:ss").split("");

  return { chars, seconds };
};
