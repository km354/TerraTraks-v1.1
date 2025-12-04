import HeroSection from "@/components/landing/HeroSection";
import PopularTripsSection from "@/components/landing/PopularTripsSection";
import BeforeAfterSection from "@/components/landing/BeforeAfterSection";
import FeatureHighlightsSection from "@/components/landing/FeatureHighlightsSection";
import SampleItinerarySection from "@/components/landing/SampleItinerarySection";
import LandingCtaSection from "@/components/landing/LandingCtaSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <div className="space-y-16 md:space-y-24">
        <PopularTripsSection />
        <BeforeAfterSection />
        <FeatureHighlightsSection />
        <SampleItinerarySection />
        <LandingCtaSection />
      </div>
    </div>
  );
}

