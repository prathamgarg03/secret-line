'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function Home() {
  return (
      <main className="flex flex-grow flex-col items-center justify-center px-4 md:px-24 py-12">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800">
            Dive into the World of Anonymous Conversations
          </h1>
          <p className="mt-4 md:mt-6 text-lg md:text-xl text-gray-600">
            Explore Secret Line - where identity remains a secret
          </p>
        </section>
        <section className="w-full max-w-3xl">
          <Carousel plugins={[Autoplay({ delay: 3000 })]} className="w-full">
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-4">
                  <Card className="shadow-lg">
                    <CardHeader className="font-semibold text-lg text-gray-700">
                      {message.title}
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
                      <Mail className="flex-shrink-0 text-gray-500 w-6 h-6" />
                      <div>
                        <p className="text-gray-600">{message.content}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="text-gray-500 hover:text-gray-700" />
            <CarouselNext className="text-gray-500 hover:text-gray-700" />
          </Carousel>
        </section>
      </main>
  );
}
