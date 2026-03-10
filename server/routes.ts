import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.tickets.list.path, async (req, res) => {
    try {
      const tickets = await storage.getTickets({
        status: req.query.status as string,
        category: req.query.category as string,
      });
      res.json(tickets);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.get(api.tickets.get.path, async (req, res) => {
    try {
      const ticket = await storage.getTicket(Number(req.params.id));
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      res.json(ticket);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.post(api.tickets.create.path, async (req, res) => {
    try {
      const input = api.tickets.create.input.parse(req.body);
      const ticket = await storage.createTicket(input);
      res.status(201).json(ticket);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.patch(api.tickets.update.path, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const input = api.tickets.update.input.parse(req.body);
      const ticket = await storage.updateTicket(id, input);
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      res.json(ticket);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.post(api.tickets.classify.path, async (req, res) => {
    try {
      const { description } = api.tickets.classify.input.parse(req.body);
      
      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [{
          role: "system",
          content: `You are an AI Ticket Classifier for Hermes IT support system.
          Classify the following ticket into one of these categories:
          Hardware, Access, HR Support, Storage, Purchase, Administrative rights, Internal Project, Misc.
          
          Determine priority: Low, Medium, High, Critical
          
          Return JSON format: { "category": "category", "confidence": 0.95, "priority": "Medium" }`
        }, {
          role: "user",
          content: description
        }],
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      res.json({
        category: result.category || "Misc",
        confidence: result.confidence || 0.5,
        priority: result.priority || "Low",
      });
    } catch (err) {
      res.status(500).json({ message: "Classification failed" });
    }
  });

  app.post(api.tickets.suggestResponse.path, async (req, res) => {
    try {
      const ticketId = Number(req.params.id);
      const ticket = await storage.getTicket(ticketId);
      
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [{
          role: "system",
          content: `You are a senior IT support engineer. 
          Generate a helpful, professional response for the user's ticket.`
        }, {
          role: "user",
          content: `Ticket Title: ${ticket.title}\nDescription: ${ticket.description}`
        }],
      });

      const suggestion = await storage.createSuggestion({
        ticketId,
        suggestedResponse: response.choices[0].message.content || "I can help with that.",
        confidence: 0.9,
      });

      res.json(suggestion);
    } catch (err) {
      res.status(500).json({ message: "Failed to generate suggestion" });
    }
  });

  app.get(api.dashboard.metrics.path, async (req, res) => {
    try {
      const metrics = await storage.getMetrics();
      res.json(metrics);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.get(api.users.list.path, async (req, res) => {
    try {
      const result = await storage.getUsers();
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.get(api.teams.list.path, async (req, res) => {
    try {
      const result = await storage.getTeams();
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const users = await storage.getUsers();
  if (users.length === 0) {
    const admin = await storage.createUser({
      name: "Admin User",
      email: "admin@hermes.io",
      role: "admin",
      team: "IT",
    });

    const itTeam = await storage.createTeam({
      name: "IT Support",
      type: "Technical",
      slaHours: 24,
    });

    const hrTeam = await storage.createTeam({
      name: "HR Support",
      type: "Human Resources",
      slaHours: 48,
    });

    await storage.createTicket({
      title: "Cannot access VPN",
      description: "I am getting an error 403 when trying to connect to the corporate VPN.",
      category: "Access",
      priority: "High",
      status: "Open",
      channel: "web",
      confidenceScore: 0.95,
      customerId: admin.id,
      assignedTeamId: itTeam.id,
    });

    await storage.createTicket({
      title: "Need a new mouse",
      description: "My current mouse is double clicking. Can I request a replacement?",
      category: "Hardware",
      priority: "Low",
      status: "Resolved",
      channel: "web",
      confidenceScore: 0.88,
      customerId: admin.id,
      assignedTeamId: itTeam.id,
    });
  }
}
