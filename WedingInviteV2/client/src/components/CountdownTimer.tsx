import { useEffect, useState } from "react";
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

const WEDDING_DATE = new Date("2025-09-26T16:00:00");

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      
      if (now >= WEDDING_DATE) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: differenceInDays(WEDDING_DATE, now),
        hours: differenceInHours(WEDDING_DATE, now) % 24,
        minutes: differenceInMinutes(WEDDING_DATE, now) % 60,
        seconds: differenceInSeconds(WEDDING_DATE, now) % 60
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w 4xl mx-auto px-4 py-8">
      <h3 className="text-2xl font-playfair text-center text-primary mb-6">Până la Eveniment</h3>
      <div className="grid grid-cols-4 gap-4">
        <TimeCard value={timeLeft.days} label="Zile" />
        <TimeCard value={timeLeft.hours} label="Ore" />
        <TimeCard value={timeLeft.minutes} label="Minute" />
        <TimeCard value={timeLeft.seconds} label="Secunde" />
      </div>
    </div>
  );
}

function TimeCard({ value, label }: { value: number; label: string }) {
  return (
    <Card>
      <CardContent className="p-4 text-center">
        <div className="text-3xl font-bold text-primary mb-1">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  );
}
