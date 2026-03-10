import { z } from 'zod';
import { 
  insertTicketSchema, 
  insertUserSchema,
  tickets,
  users,
  teams,
  knowledgeBase,
  bottlenecks,
  suggestions,
  ticketEvents
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  tickets: {
    list: {
      method: 'GET' as const,
      path: '/api/tickets' as const,
      input: z.object({
        status: z.string().optional(),
        category: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof tickets.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/tickets/:id' as const,
      responses: {
        200: z.custom<typeof tickets.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/tickets' as const,
      input: insertTicketSchema,
      responses: {
        201: z.custom<typeof tickets.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/tickets/:id' as const,
      input: insertTicketSchema.partial(),
      responses: {
        200: z.custom<typeof tickets.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    classify: {
      method: 'POST' as const,
      path: '/api/tickets/classify' as const,
      input: z.object({
        description: z.string()
      }),
      responses: {
        200: z.object({
          category: z.string(),
          confidence: z.number(),
          priority: z.string(),
          teamId: z.number().optional()
        })
      }
    },
    suggestResponse: {
      method: 'POST' as const,
      path: '/api/tickets/:id/suggest-response' as const,
      responses: {
        200: z.custom<typeof suggestions.$inferSelect>(),
        404: errorSchemas.notFound,
      }
    }
  },
  dashboard: {
    metrics: {
      method: 'GET' as const,
      path: '/api/dashboard/metrics' as const,
      responses: {
        200: z.any() // DashboardMetricsResponse
      }
    }
  },
  users: {
    list: {
      method: 'GET' as const,
      path: '/api/users' as const,
      responses: {
        200: z.array(z.custom<typeof users.$inferSelect>()),
      }
    }
  },
  teams: {
    list: {
      method: 'GET' as const,
      path: '/api/teams' as const,
      responses: {
        200: z.array(z.custom<typeof teams.$inferSelect>()),
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
