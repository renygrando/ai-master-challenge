import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Book, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function KnowledgeBase() {
  const mockArticles = [
    { id: 1, title: "Resetting VPN Credentials", category: "Access", views: 1205 },
    { id: 2, title: "Provisioning a New MacBook", category: "Hardware", views: 843 },
    { id: 3, title: "Resolving Docker Build Failures", category: "Software", views: 650 },
    { id: 4, title: "Onboarding Checklist for HR", category: "HR Support", views: 420 },
    { id: 5, title: "AWS Role Troubleshooting", category: "Access", views: 390 },
    { id: 6, title: "Office Network Diagram", category: "Network", views: 215 },
  ];

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center mb-12 mt-4">
        <h1 className="text-4xl font-display font-bold text-foreground mb-4 text-center" data-testid="text-page-title">Athena Library</h1>
        <p className="text-muted-foreground text-lg text-center max-w-2xl mb-8">
          The centralized repository of operational knowledge. AI automatically indexes and suggests these articles to resolve incoming tickets.
        </p>
        
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input 
            placeholder="Search the archives..." 
            className="pl-12 h-14 text-lg border-border/50 bg-card/80 backdrop-blur-sm rounded-full focus-visible:ring-secondary"
            data-testid="input-search-knowledge"
          />
          <Button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-6" variant="secondary" data-testid="button-search-knowledge">
            Search
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockArticles.map((article) => (
          <Card key={article.id} className="group hover-elevate transition-colors cursor-pointer border-border/50 bg-card" data-testid={`card-article-${article.id}`}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-2 mb-2 flex-wrap">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-secondary bg-secondary/10 px-2 py-1 rounded-md" data-testid={`text-article-category-${article.id}`}>
                  {article.category}
                </span>
                <Book className="w-4 h-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-lg leading-tight" data-testid={`text-article-title-${article.id}`}>
                {article.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mt-2 gap-2">
                <span className="text-sm text-muted-foreground" data-testid={`text-article-views-${article.id}`}>{article.views} views</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground invisible group-hover:visible text-secondary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
