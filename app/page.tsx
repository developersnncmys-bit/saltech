import Animations from "@/components/Animations";
import ComponentsToSystems from "@/components/ComponentsToSystems";
import Credibility from "@/components/Credibility";
import EngineeringUnderOneRoof from "@/components/EngineeringUnderOneRoof";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import GlobalBall from "@/components/GlobalBall";
import Hero from "@/components/Hero";
import Industries from "@/components/Industries";
import LegacyObsolete from "@/components/LegacyObsolete";
import ManufacturingEngineering from "@/components/ManufacturingEngineering";
import Nav from "@/components/Nav";
import Preloader from "@/components/Preloader";
import Reframe from "@/components/Reframe";
import Solutions from "@/components/Solutions";
import WhySaltech from "@/components/WhySaltech";

export default function Page() {
  return (
    <>
      <Preloader />
      <Nav />
      <Hero />
      <Reframe />
      <Solutions />
      <ComponentsToSystems />
      <LegacyObsolete />
      <EngineeringUnderOneRoof />
      <WhySaltech />
      <Industries />
      <ManufacturingEngineering />
      <Credibility />
      <FinalCTA />
      <Footer />
      <GlobalBall />
      <Animations />
    </>
  );
}
