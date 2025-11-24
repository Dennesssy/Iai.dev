import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { COMMUNITY_POSTS } from "@/lib/mockData";
import { MessageSquare, ThumbsUp } from "lucide-react";

export default function CommunityInsights() {
  return (
    <ScrollArea className="h-full">
      <div className="divide-y divide-border">
        {COMMUNITY_POSTS.map((post) => (
          <div key={post.id} className="p-3 hover:bg-secondary/30 transition-colors border-b border-border/30">
            <div className="flex items-start gap-2.5 mb-2">
              {/* Avatar */}
              <div className="text-lg flex-shrink-0">{post.avatar}</div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-xs font-medium text-muted-foreground">{post.author}</p>
                  <Badge variant="outline" className="text-xs capitalize">
                    {post.category}
                  </Badge>
                </div>

                <h4 className="font-bold text-sm mb-1 line-clamp-2">{post.title}</h4>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{post.content}</p>

                {/* Engagement + Time */}
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      {post.upvotes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {post.replies}
                    </span>
                  </div>
                  <span className="text-muted-foreground/70">
                    {new Date(post.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
