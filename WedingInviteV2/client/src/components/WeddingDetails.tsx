import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, CalendarDays } from "lucide-react";
import CountdownTimer from "./CountdownTimer";

export default function WeddingDetails() {
  return (
    <div className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-playfair text-center text-primary mb-16">
          Ziua Noastră Specială
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardContent className="pt-6 text-center">
              <CalendarDays className="w-8 h-8 mx-auto mb-4 text-primary" />
              <h3 className="font-playfair text-xl mb-2">Data</h3>
              <p className="text-muted-foreground">26 Septembrie 2025</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Clock className="w-8 h-8 mx-auto mb-4 text-primary" />
              <h3 className="font-playfair text-xl mb-2">Ora</h3>
              <p className="text-muted-foreground">16:00</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <MapPin className="w-8 h-8 mx-auto mb-4 text-primary" />
              <h3 className="font-playfair text-xl mb-2">Locație</h3>
              <p className="text-muted-foreground">
                Wonderland Resort<br />
                Cluj-Napoca<br />
                România
              </p>
            </CardContent>
          </Card>
        </div>

        <CountdownTimer />

        <div className="mt-16">
          <h3 className="text-2xl font-playfair text-center text-primary mb-6">Cum Ajungeți la Noi</h3>
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
            <iframe
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2733.8126168494193!2d${23.590656349252544}!3d${46.721431006725304}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47490c1f916c0b8b%3A0x4863af912558c04d!2sWonderland%20Resort!5e0!3m2!1sro!2sro!4v1708373824784!5m2!1sro!2sro`}
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Wonderland Resort Location"
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}