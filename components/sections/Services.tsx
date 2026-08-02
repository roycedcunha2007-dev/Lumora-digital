"use client";

import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { services } from "@/lib/site";
import { getIcon } from "@/lib/icons";
import { ExpandingCards, CardItem } from "@/components/ui/expanding-cards";

export default function Services() {
  const serviceItems: CardItem[] = services
    .filter((s) => !s.id.startsWith("future"))
    .map((service) => {
      const Icon = getIcon(service.icon);
      let imgSrc = "";
      switch (service.id) {
        case "design":
          imgSrc =
            "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200";
          break;
        case "development":
          imgSrc =
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200";
          break;
        case "responsive":
          imgSrc =
            "https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=1200";
          break;
        case "uiux":
          imgSrc =
            "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=1200";
          break;
        case "maintenance":
          imgSrc =
            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200";
          break;
        case "seo":
          imgSrc =
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200";
          break;
        default:
          imgSrc =
            "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200";
      }

      return {
        id: service.id,
        title: service.title,
        description: service.blurb,
        imgSrc,
        icon: <Icon size={24} />,
        linkHref: "#contact",
      };
    });

  return (
    <section id="services" className="relative py-28 sm:py-36">

      <div className="container-px">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end mb-14">
          <SectionHeading
            eyebrow="What we do"
            title="Services crafted end to end"
            description="Everything you need to launch and grow online — designed, built and cared for under one roof."
            align="left"
          />
          <a
            href="#contact"
            className="group hidden items-center gap-2 text-sm font-medium text-white/60 transition-colors hover:text-white lg:flex"
          >
            Discuss your project
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <ExpandingCards items={serviceItems} defaultActiveIndex={0} />
      </div>
    </section>
  );
}
