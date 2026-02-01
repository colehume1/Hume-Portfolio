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
  image: string | null;
}

interface PostsCache {
  posts: SubstackPost[];
  timestamp: number;
}

interface OgDataCache {
  [url: string]: {
    image: string | null;
    title: string | null;
    description: string | null;
    timestamp: number;
  };
}

let postsCache: PostsCache | null = null;
const ogDataCache: OgDataCache = {};

const FEED_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const OG_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

const SUBSTACK_FEED_URL = 'https://colehume1.substack.com/feed';
const DEFAULT_PLACEHOLDER_IMAGE = '/placeholder-post.svg';

const parser = new Parser({
  customFields: {
    item: ['content:encoded', 'media:content', 'enclosure']
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

function extractExcerpt(content: string, maxLength: number = 150): string {
  const text = content.replace(/<[^>]*>/g, '').trim();
  const decoded = decodeHtmlEntities(text);
  if (decoded.length <= maxLength) return decoded;
  return decoded.substring(0, maxLength).trim() + '...';
}

function extractYouTubeThumbnail(content: string): string | null {
  const youtubePatterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/
  ];
  
  for (const pattern of youtubePatterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
    }
  }
  return null;
}

function extractRssImage(item: any): string | null {
  if (item['media:content']?.['$']?.url) {
    return item['media:content']['$'].url;
  }
  if (item.enclosure?.url && item.enclosure.type?.startsWith('image')) {
    return item.enclosure.url;
  }
  const imgMatch = item['content:encoded']?.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch && imgMatch[1]) {
    return imgMatch[1];
  }
  return null;
}

async function fetchOgData(url: string): Promise<{ image: string | null; title: string | null; description: string | null }> {
  const now = Date.now();
  
  if (ogDataCache[url] && (now - ogDataCache[url].timestamp) < OG_CACHE_DURATION) {
    return {
      image: ogDataCache[url].image,
      title: ogDataCache[url].title,
      description: ogDataCache[url].description
    };
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ColeHumeBot/1.0)'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const html = await response.text();
    
    const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                         html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    
    const ogTitleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
                         html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i);
    
    const ogDescMatch = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) ||
                        html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i);

    const result = {
      image: ogImageMatch ? decodeHtmlEntities(ogImageMatch[1]) : null,
      title: ogTitleMatch ? decodeHtmlEntities(ogTitleMatch[1]) : null,
      description: ogDescMatch ? decodeHtmlEntities(ogDescMatch[1]) : null
    };

    ogDataCache[url] = { ...result, timestamp: now };
    
    return result;
  } catch (error) {
    console.error(`Failed to fetch OG data for ${url}:`, error);
    ogDataCache[url] = { image: null, title: null, description: null, timestamp: now };
    return { image: null, title: null, description: null };
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get('/api/posts', async (req, res) => {
    try {
      const now = Date.now();
      
      if (postsCache && (now - postsCache.timestamp) < FEED_CACHE_DURATION) {
        return res.json({ posts: postsCache.posts });
      }

      const feed = await parser.parseURL(SUBSTACK_FEED_URL);
      
      const postsPromises = feed.items.map(async (item) => {
        const postUrl = item.link || '';
        const rssContent = item['content:encoded'] || item.contentSnippet || item.content || '';
        
        const ogData = postUrl ? await fetchOgData(postUrl) : { image: null, title: null, description: null };
        
        let image = ogData.image;
        if (!image) {
          image = extractRssImage(item);
        }
        if (!image) {
          image = extractYouTubeThumbnail(rssContent);
        }
        if (!image) {
          image = DEFAULT_PLACEHOLDER_IMAGE;
        }

        const title = decodeHtmlEntities(ogData.title || item.title || 'Untitled');
        const excerpt = ogData.description 
          ? decodeHtmlEntities(ogData.description)
          : extractExcerpt(rssContent);

        return {
          title,
          link: postUrl,
          pubDate: item.pubDate || '',
          excerpt,
          image
        };
      });

      const posts = await Promise.all(postsPromises);
      
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
