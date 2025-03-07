'use client';

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

interface Event {
  id: string;
  title: string;
  time: string;
}

interface DayAccordionProps {
  date: number;
  events: Event[];
}

export default function DayAccordion({ date, events }: DayAccordionProps) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value={date.toString()}>
        <AccordionTrigger className="flex w-full justify-between p-4 bg-gray-100 hover:bg-gray-200">
          <span className="font-semibold">{date}</span>
        </AccordionTrigger>
        <AccordionContent className="p-4 bg-white border-t">
          {events.length > 0 ? (
            <ul>
              {events.map(event => (
                <li key={event.id} className="py-1">
                  <span className="font-medium">{event.time}</span>: {event.title}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No hay eventos</p>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
