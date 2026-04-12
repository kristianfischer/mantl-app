import { InterestedWaitlistForm } from "@/components/interested-waitlist-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Interested — MANTL",
  description: "Join the waitlist for the next MANTL fund.",
};

export default function InterestedPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-8 md:py-14">
      <p className="text-mantl-gold-dark font-mono text-[10px] uppercase tracking-[3px]">Next fund access</p>
      <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
        Join the waitlist
      </h1>
      <p className="text-muted-foreground mt-2 max-w-2xl text-[15px] leading-relaxed">
        Email is required. Everything else helps us prioritize outreach for the next fund.
      </p>

      <Card className="ring-mantl-gold-border/80 bg-card/80 mt-8">
        <CardHeader>
          <CardTitle className="font-display text-lg">Interested in the next fund?</CardTitle>
          <CardDescription>Tell us a bit about your intent and target allocation.</CardDescription>
        </CardHeader>
        <CardContent>
          <InterestedWaitlistForm />
        </CardContent>
      </Card>
    </div>
  );
}
