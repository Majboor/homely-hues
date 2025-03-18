
import { useQuery } from "@tanstack/react-query";

export interface BlogMetaTags {
  description: string;
  title: string;
}

export interface BlogPost {
  content: string;
  meta_tags: BlogMetaTags;
  slug: string;
  url: string;
}

const BLOG_API_URL = "https://blogsinterior.techrealm.online";

export const fetchBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const response = await fetch(`${BLOG_API_URL}/api/search_by_slug?slug=${slug}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Error fetching blog post: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
};

export const useBlogPost = (slug: string) => {
  return useQuery({
    queryKey: ["blogPost", slug],
    queryFn: () => fetchBlogPostBySlug(slug),
    retry: false, // Don't retry if the post doesn't exist
  });
};
