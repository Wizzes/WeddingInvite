import WeddingHero from "@/components/WeddingHero";
import WeddingDetails from "@/components/WeddingDetails";
import RsvpForm from "@/components/RsvpForm";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  return (
    <ScrollArea className="h-screen">
      <div className="min-h-screen bg-background">
        <WeddingHero />
        <WeddingDetails />
        <RsvpForm />
      </div>
    </ScrollArea>
  );
}
