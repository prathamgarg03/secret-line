'use client'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from 'embla-carousel-autoplay'
import messages from '@/messages.json'
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function Home() {
  return (
    <>
      <main className="flex flex-grow flex-col items-center justify-center px-4 md:px-24 py-12">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the world of anonymous conversations
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            Explore Secret Line - where identity remians a secret
          </p>
        </section>
        <section className="items-center">
          <Carousel
            plugins={[Autoplay({ delay: 2000 })]}
            className="w-full max-w-xs">
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-4">
                  <Card>
                    <CardHeader>
                      {message.title}
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                      <Mail className="flex-shrink-0 mt-1" />
                      <div>
                        <p>{message.content}</p>
                        <p className="text-xs text-muted-foreground">
                          {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))

              }
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>
      </main>
      <footer>

      </footer>
    </>
  );
}
