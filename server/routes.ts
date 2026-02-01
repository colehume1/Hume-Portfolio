import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema } from "@shared/schema";
import { api } from "@shared/routes";
import { z } from "zod";
import Parser from "rss-parser";

interface SubstackPost {
  title: string;
  link: string;
  pubDate: string;
  excerpt: string;
}

interface PostsCache {
  posts: SubstackPost[];
  timestamp: number;
}

let postsCache: PostsCache | null = null;
const CACHE_DURATION = 10 * 60 * 1000;

const parser = new Parser({
  customFields: {
    item: ['content:encoded']
  }
});

function extractExcerpt(content: string): string {
  const text = content.replace(/<[^>]*>/g, '').trim();
  if (text.length <= 150) return text;
  return text.substring(0, 150).trim() + '...';
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get('/api/posts', async (req, res) => {
    try {
      const now = Date.now();
      if (postsCache && (now - postsCache.timestamp) < CACHE_DURATION) {
        return res.json({ posts: postsCache.posts });
      }

      const feed = await parser.parseURL('https://colehume1.substack.com/feed');
      
      const posts: SubstackPost[] = feed.items.map(item => ({
        title: item.title || 'Untitled',
        link: item.link || '',
        pubDate: item.pubDate || '',
        excerpt: extractExcerpt(item['content:encoded'] || item.contentSnippet || item.content || '')
      }));

      postsCache = { posts, timestamp: now };
      
      res.json({ posts });
    } catch (error) {
      console.error('Failed to fetch Substack RSS:', error);
      res.status(500).json({ 
        error: 'Failed to fetch posts from Substack', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  app.post(api.contact.submit.path, async (req, res) => {
    try {
      const data = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(data);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid input data" });
      } else {
        res.status(500).json({ message: "Failed to send message" });
      }
    }
  });

  return httpServer;
}
