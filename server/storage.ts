import { db } from "./db";
import { 
  users, teams, tickets, ticketEvents, knowledgeBase, bottlenecks, suggestions,
  type InsertUser, type InsertTeam, type InsertTicket, type InsertTicketEvent,
  type User, type Team, type Ticket, type TicketEvent, type KnowledgeBaseArticle, type Bottleneck, type Suggestion,
  type CreateTicketRequest, type UpdateTicketRequest
} from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;

  // Teams
  getTeams(): Promise<Team[]>;
  getTeam(id: number): Promise<Team | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;

  // Tickets
  getTickets(filters?: { status?: string; category?: string }): Promise<Ticket[]>;
  getTicket(id: number): Promise<Ticket | undefined>;
  createTicket(ticket: CreateTicketRequest): Promise<Ticket>;
  updateTicket(id: number, ticket: UpdateTicketRequest): Promise<Ticket | undefined>;
  
  // Suggestions
  createSuggestion(suggestion: any): Promise<Suggestion>;
  getSuggestions(ticketId: number): Promise<Suggestion[]>;
  
  // Dashboard
  getMetrics(): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async createUser(user: InsertUser): Promise<User> {
    const [created] = await db.insert(users).values(user).returning();
    return created;
  }

  async getTeams(): Promise<Team[]> {
    return await db.select().from(teams);
  }

  async getTeam(id: number): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team;
  }

  async createTeam(team: InsertTeam): Promise<Team> {
    const [created] = await db.insert(teams).values(team).returning();
    return created;
  }

  async getTickets(filters?: { status?: string; category?: string }): Promise<Ticket[]> {
    let query = db.select().from(tickets);
    
    // We could add where clauses here based on filters, keeping simple for MVP
    return await query.orderBy(desc(tickets.createdAt));
  }

  async getTicket(id: number): Promise<Ticket | undefined> {
    const [ticket] = await db.select().from(tickets).where(eq(tickets.id, id));
    return ticket;
  }

  async createTicket(ticket: CreateTicketRequest): Promise<Ticket> {
    const [created] = await db.insert(tickets).values(ticket).returning();
    return created;
  }

  async updateTicket(id: number, update: UpdateTicketRequest): Promise<Ticket | undefined> {
    const [updated] = await db.update(tickets)
      .set({ ...update, updatedAt: new Date() })
      .where(eq(tickets.id, id))
      .returning();
    return updated;
  }

  async createSuggestion(suggestion: any): Promise<Suggestion> {
    const [created] = await db.insert(suggestions).values(suggestion).returning();
    return created;
  }

  async getSuggestions(ticketId: number): Promise<Suggestion[]> {
    return await db.select().from(suggestions).where(eq(suggestions.ticketId, ticketId));
  }

  async getMetrics(): Promise<any> {
    const allTickets = await db.select().from(tickets);
    
    const activeTickets = allTickets.filter(t => t.status !== 'Resolved' && t.status !== 'Closed').length;
    
    const resolvedTickets = allTickets.filter(t => t.resolutionTime !== null);
    const avgResolutionTime = resolvedTickets.length > 0 
      ? resolvedTickets.reduce((acc, t) => acc + (t.resolutionTime || 0), 0) / resolvedTickets.length 
      : 0;

    const slaRiskCount = allTickets.filter(t => t.priority === 'High' || t.priority === 'Critical').length;
    
    // Calculate category distribution
    const ticketsByCategory = allTickets.reduce((acc: any, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {});

    const autoResolved = allTickets.filter(t => t.confidenceScore && t.confidenceScore > 0.9 && t.status === 'Resolved').length;
    const automationRate = allTickets.length > 0 ? (autoResolved / allTickets.length) * 100 : 0;

    const allBottlenecks = await db.select().from(bottlenecks).orderBy(desc(bottlenecks.timestamp));

    return {
      activeTickets,
      avgResolutionTime,
      slaRiskCount,
      automationRate,
      ticketsByCategory,
      bottlenecks: allBottlenecks
    };
  }
}

export const storage = new DatabaseStorage();
