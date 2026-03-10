import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertTicket, type UpdateTicketRequest } from "@shared/schema";

export function useTickets(status?: string, category?: string) {
  return useQuery({
    queryKey: [api.tickets.list.path, { status, category }],
    queryFn: async () => {
      const url = new URL(api.tickets.list.path, window.location.origin);
      if (status) url.searchParams.append("status", status);
      if (category) url.searchParams.append("category", category);
      
      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch tickets");
      return api.tickets.list.responses[200].parse(await res.json());
    },
  });
}

export function useTicket(id: number) {
  return useQuery({
    queryKey: [api.tickets.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.tickets.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch ticket");
      return api.tickets.get.responses[200].parse(await res.json());
    },
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertTicket) => {
      const validated = api.tickets.create.input.parse(data);
      const res = await fetch(api.tickets.create.path, {
        method: api.tickets.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create ticket");
      return api.tickets.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.tickets.list.path] }),
  });
}

export function useUpdateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & UpdateTicketRequest) => {
      const validated = api.tickets.update.input.parse(updates);
      const url = buildUrl(api.tickets.update.path, { id });
      const res = await fetch(url, {
        method: api.tickets.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update ticket");
      return api.tickets.update.responses[200].parse(await res.json());
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [api.tickets.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.tickets.get.path, id] });
    },
  });
}

export function useClassifyTicket() {
  return useMutation({
    mutationFn: async (description: string) => {
      const validated = api.tickets.classify.input.parse({ description });
      const res = await fetch(api.tickets.classify.path, {
        method: api.tickets.classify.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to classify ticket");
      return api.tickets.classify.responses[200].parse(await res.json());
    },
  });
}

export function useSuggestResponse() {
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.tickets.suggestResponse.path, { id });
      const res = await fetch(url, {
        method: api.tickets.suggestResponse.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to generate suggestion");
      return api.tickets.suggestResponse.responses[200].parse(await res.json());
    },
  });
}
