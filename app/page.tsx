import AuroraBackground from "@/components/effects/AuroraBackground";
import LumoraPrism3D from "@/components/3d/LumoraPrism3D";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/effects/WhatsAppButton";
import SectionDivider from "@/components/ui/SectionDivider";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Services from "@/components/sections/Services";
import Process from "@/components/sections/Process";
import MacBookReveal from "@/components/ui/MacBookReveal";
import Stats from "@/components/sections/Stats";
import Pricing from "@/components/sections/Pricing";
import Team from "@/components/sections/Team";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";
import { CheckoutProvider } from "@/components/checkout/CheckoutContext";
import CheckoutModal from "@/components/checkout/CheckoutModal";

export default function Home() {
  return (
    <CheckoutProvider>
      <AuroraBackground />
      <LumoraPrism3D />
      <Navbar />
      <main className="relative">
        <Hero />
        <SectionDivider />
        <About />
        <SectionDivider />
        <WhyChooseUs />
        <SectionDivider />
        <Services />
        <SectionDivider />
        <Process />
        <MacBookReveal />
        <Stats />
        <SectionDivider />
        <Pricing />
        <SectionDivider />
        <Team />
        <SectionDivider />
        <FAQ />
        <SectionDivider />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
      <CheckoutModal />
    </CheckoutProvider>
  );
}
