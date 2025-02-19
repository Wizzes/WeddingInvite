import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertRsvpSchema, type InsertRsvp } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export default function RsvpForm() {
  const { toast } = useToast();
  const form = useForm<InsertRsvp>({
    resolver: zodResolver(insertRsvpSchema),
    defaultValues: {
      name: "",
      email: "",
      attending: true,
      guestCount: 1,
      message: "",
      additionalNames: Array(4).fill(""),
      dietaryRestrictions: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertRsvp) => {
      return apiRequest("POST", "/api/rsvp", data);
    },
    onSuccess: () => {
      toast({
        title: "Confirmare trimisă",
        description: "Vă mulțumim pentru răspuns!",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Eroare",
        description: "Nu s-a putut trimite confirmarea. Vă rugăm să încercați din nou.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="py-20 px-4 bg-[#F9F5F2]">
      <div className="max-w-md mx-auto">
        <h2 className="text-4xl font-playfair text-center text-primary mb-8">
          Confirmare Participare
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nume Complet</FormLabel>
                  <FormControl>
                    <Input placeholder="Introduceți numele dvs." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Introduceți adresa de email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="attending"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Veți participa?</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="guestCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Număr de Persoane</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={5}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("guestCount") > 1 && (
              <div className="space-y-4">
                <FormLabel>Numele Invitaților Adiționali</FormLabel>
                {[...Array(form.watch("guestCount") - 1)].map((_, index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name={`additionalNames.${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input 
                            placeholder={`Numele invitatului ${index + 2}`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            )}

            <FormField
              control={form.control}
              name="dietaryRestrictions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Restricții Alimentare (Opțional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Vegetarian, Alergii, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mesaj (Opțional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Lăsați un mesaj pentru miri" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Se trimite..." : "Trimite Confirmarea"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}