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

function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
    '&#8220;': '"',
    '&#8221;': '"',
    '&#8216;': "'",
    '&#8217;': "'",
    '&#8230;': '...',
    '&#8212;': '—',
    '&#8211;': '–',
    '&#160;': ' '
  };
  
  let decoded = text;
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.replace(new RegExp(entity, 'g'), char);
  }
  decoded = decoded.replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)));
  decoded = decoded.replace(/&#x([a-fA-F0-9]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  
  return decoded;
}

function extractExcerpt(content: string): string {
  const text = content.replace(/<[^>]*>/g, '').trim();
  const decoded = decodeHtmlEntities(text);
  if (decoded.length <= 150) return decoded;
  return decoded.substring(0, 150).trim() + '...';
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
