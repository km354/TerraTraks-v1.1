import HeroSection from "@/components/landing/HeroSection";
import PopularTripsSection from "@/components/landing/PopularTripsSection";
import BeforeAfterSection from "@/components/landing/BeforeAfterSection";
import FeatureHighlightsSection from "@/components/landing/FeatureHighlightsSection";
import SampleItinerarySection from "@/components/landing/SampleItinerarySection";
import LandingCtaSection from "@/components/landing/LandingCtaSection";

export default function Home() {
  return (
    // Reduced vertical spacing between sections so PopularTrips appears closer to Hero
    <div className="space-y-8 md:space-y-12">
      <HeroSection />
      <div className="space-y-16 md:space-y-24">
        <div className="-mt-4 md:-mt-6">
          <PopularTripsSection />
        </div>
        <BeforeAfterSection />
        <FeatureHighlightsSection />
        <SampleItinerarySection />
        <LandingCtaSection />
      </div>
    </div>
  );
}
