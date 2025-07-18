import { api } from "@/convex/_generated/api";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useSettings = () => {
  const query = useQuery(convexQuery(api.settings.settings.get, {}));

  const mutation = useMutation({
    mutationFn: useConvexMutation(api.settings.settings.patch),
  });

  return {
    query,
    mutation,
  };
};
