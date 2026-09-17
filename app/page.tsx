import Animations from "@/components/Animations";
import ComponentsToSystems from "@/components/ComponentsToSystems";
import Credibility from "@/components/Credibility";
import EngineeringUnderOneRoof from "@/components/EngineeringUnderOneRoof";
import FeatureGrid from "@/components/FeatureGrid";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import GlobalBall from "@/components/GlobalBall";
import Hero from "@/components/Hero";
import Industries from "@/components/Industries";
import LegacyObsolete from "@/components/LegacyObsolete";
import ManufacturingEngineering from "@/components/ManufacturingEngineering";
import Nav from "@/components/Nav";
import Partners from "@/components/Partners";
import Preloader from "@/components/Preloader";
import Reframe from "@/components/Reframe";
import Solutions from "@/components/Solutions";
import ThinkingSpaceSaltech from "@/components/ThinkingSpaceSaltech";
import WhatsAppButton from "@/components/WhatsAppButton";
import WhySaltech from "@/components/WhySaltech";

export default function Page() {
  return (
    <>
      <Preloader />
      <Nav />
      <Hero />
      {/* <Reframe /> */}
      <FeatureGrid />
      <Solutions />
      <ComponentsToSystems />
      <LegacyObsolete />
      <EngineeringUnderOneRoof />
      <ThinkingSpaceSaltech />
      <WhySaltech />
      <Industries />
      <ManufacturingEngineering />
      <Partners />
      <Credibility />
      <FinalCTA />
      <Footer />
      <GlobalBall />
      <WhatsAppButton />
      <Animations />
    </>
  );
}
