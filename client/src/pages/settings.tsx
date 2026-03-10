import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-foreground mb-2" data-testid="text-page-title">System Configuration</h1>
          <p className="text-muted-foreground text-lg">Manage Hermes AI behavior and operational rules.</p>
        </div>

        <Card className="mb-6 border-border/50">
          <CardHeader>
            <CardTitle className="font-display text-xl text-foreground">AI Automation Rules</CardTitle>
            <CardDescription>Control how the AI interacts with incoming tickets automatically.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">Auto-Classification</Label>
                <p className="text-sm text-muted-foreground">Automatically assign category and priority based on text analysis.</p>
              </div>
              <Switch defaultChecked data-testid="switch-auto-classification" />
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">Auto-Routing</Label>
                <p className="text-sm text-muted-foreground">Assign tickets directly to teams based on classification.</p>
              </div>
              <Switch defaultChecked data-testid="switch-auto-routing" />
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">Auto-Response (High Confidence)</Label>
                <p className="text-sm text-muted-foreground">Allow AI to reply directly if confidence score &gt; 95%.</p>
              </div>
              <Switch data-testid="switch-auto-response" />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" data-testid="button-discard-settings">Discard Changes</Button>
          <Button data-testid="button-save-settings">Save Configuration</Button>
        </div>
      </div>
    </AppLayout>
  );
}
