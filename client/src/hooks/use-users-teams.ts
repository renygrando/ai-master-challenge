import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useUsers() {
  return useQuery({
    queryKey: [api.users.list.path],
    queryFn: async () => {
      const res = await fetch(api.users.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch users");
      try {
        return api.users.list.responses[200].parse(await res.json());
      } catch {
        return [];
      }
    },
  });
}

export function useTeams() {
  return useQuery({
    queryKey: [api.teams.list.path],
    queryFn: async () => {
      const res = await fetch(api.teams.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch teams");
      try {
        return api.teams.list.responses[200].parse(await res.json());
      } catch {
        return [];
      }
    },
  });
}
