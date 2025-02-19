import { motion } from "framer-motion";

export default function WeddingHero() {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[#F9F5F2] z-0" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center z-10 px-4"
      >
        <h1 className="font-playfair text-5xl md:text-7xl text-primary mb-6">
          Andrada & Cristi
        </h1>
        <p className="font-lato text-xl md:text-2xl text-muted-foreground mb-4">
          se căsătoresc
        </p>
        <div className="font-playfair text-2xl md:text-3xl text-primary">
          26 Septembrie 2025
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1583939003579-730e3918a45a')] bg-cover bg-center"
      />
    </div>
  );
}