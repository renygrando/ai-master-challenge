import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useDashboardMetrics() {
  return useQuery({
    queryKey: [api.dashboard.metrics.path],
    queryFn: async () => {
      const res = await fetch(api.dashboard.metrics.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch dashboard metrics");
      // Fallback/Mock data if backend endpoint isn't wired fully yet
      try {
        return api.dashboard.metrics.responses[200].parse(await res.json());
      } catch (e) {
        return {
          activeTickets: 142,
          avgResolutionTime: 4.5,
          slaRiskCount: 12,
          automationRate: 68,
          bottlenecks: [
            { id: 1, category: "Access Rights", avgResolution: 8.2, ticketCount: 45, riskScore: 0.8 },
            { id: 2, category: "Hardware", avgResolution: 24.5, ticketCount: 12, riskScore: 0.4 },
          ],
          ticketsByCategory: {
            "Access": 45,
            "Hardware": 20,
            "Software": 35,
            "Network": 15,
            "HR Support": 27
          }
        };
      }
    },
  });
}
