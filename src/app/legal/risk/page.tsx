import Link from "next/link";

export default function RiskPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-8">Risk, Medical & AI Disclaimer</h1>
      
      <div className="prose prose-lg max-w-none space-y-6 text-text-secondary">
        <p className="text-sm text-text-secondary mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">1. Acknowledgment of Risk</h2>
          <p>
            By using TerraTraks and participating in activities suggested by our platform, you acknowledge that outdoor activities, including but not limited to hiking, camping, and visiting national parks, involve inherent risks and dangers. These risks include, but are not limited to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Physical injury or death</li>
            <li>Exposure to extreme weather conditions</li>
            <li>Wildlife encounters</li>
            <li>Getting lost or stranded</li>
            <li>Equipment failure</li>
            <li>Natural disasters</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">2. Assumption of Risk</h2>
          <p>
            You voluntarily assume all risks associated with outdoor activities and agree that TerraTraks, its owners, employees, and affiliates shall not be liable for any injury, loss, or damage to person or property resulting from your participation in any activities suggested or recommended by our platform.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">3. Medical Disclaimer</h2>
          <p>
            The information provided by TerraTraks is for general informational purposes only and is not intended as medical advice. Before engaging in any physical activity, especially if you have pre-existing medical conditions, you should:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Consult with a qualified healthcare provider</li>
            <li>Obtain medical clearance for physical activities</li>
            <li>Inform yourself about your physical limitations</li>
            <li>Carry necessary medications and medical supplies</li>
          </ul>
          <p>
            TerraTraks is not responsible for any medical emergencies or health issues that may arise during your trip.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">4. AI-Generated Content Disclaimer</h2>
          <p>
            TerraTraks utilizes artificial intelligence (AI) technology to generate travel itineraries, activity suggestions, route recommendations, and other content on our platform. This AI-generated content is designed to assist you in planning your national park adventures, but it is important to understand its limitations and use it responsibly.
          </p>
          <p>
            While we strive to provide accurate and up-to-date information, AI-generated content may contain:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Inaccuracies or outdated information</li>
            <li>Subjective assessments that may not reflect your personal preferences</li>
            <li>Errors in route calculations, distances, or driving times</li>
            <li>Incomplete or missing information about park conditions, closures, or restrictions</li>
            <li>Recommendations that may not be suitable for your specific circumstances</li>
          </ul>
          <p>
            You are responsible for verifying all information provided by TerraTraks before relying on it for your trip planning. We strongly recommend that you:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Cross-reference information with official park websites and resources</li>
            <li>Check current park conditions, closures, and restrictions directly with the National Park Service</li>
            <li>Verify permit requirements, reservation availability, and entry fees</li>
            <li>Confirm trail conditions, difficulty ratings, and safety information</li>
            <li>Validate driving directions and route information using reliable mapping services</li>
            <li>Review weather forecasts and conditions from official sources</li>
          </ul>
          <p>
            TerraTraks does not guarantee the accuracy, completeness, or reliability of AI-generated content. We are not responsible for any errors, omissions, or inaccuracies in the information provided, nor for any decisions made or actions taken based on such information. AI-generated content is a tool to assist in planning, not a substitute for your own research and judgment.
          </p>
          <p>
            Park conditions, regulations, and information change frequently. AI-generated content may not reflect the most current information. Always check with official sources for the latest updates before your trip.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">5. Physical Fitness</h2>
          <p>
            You acknowledge that you are responsible for assessing your own physical fitness and capabilities before attempting any activities suggested by TerraTraks. Activities may vary in difficulty, and it is your responsibility to choose activities appropriate for your fitness level.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">6. Weather and Conditions</h2>
          <p>
            Weather conditions can change rapidly and without warning. TerraTraks provides general weather information, but you are responsible for:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Checking current weather conditions before departure</li>
            <li>Monitoring weather forecasts during your trip</li>
            <li>Making appropriate decisions based on actual conditions</li>
            <li>Having proper gear for expected and unexpected conditions</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">7. Wildlife Safety</h2>
          <p>
            National parks and outdoor areas are home to wildlife. You are responsible for:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Following park regulations regarding wildlife</li>
            <li>Maintaining safe distances from animals</li>
            <li>Proper food storage to avoid attracting wildlife</li>
            <li>Understanding how to respond to wildlife encounters</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">8. Emergency Preparedness</h2>
          <p>
            You are responsible for your own safety and should:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Carry appropriate safety equipment</li>
            <li>Inform others of your travel plans</li>
            <li>Know how to contact emergency services</li>
            <li>Have a plan for emergencies</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">9. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, TerraTraks disclaims all liability for any injury, loss, damage, or death resulting from your use of our platform or participation in any activities suggested by our platform. This includes, but is not limited to, direct, indirect, incidental, special, or consequential damages.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">10. Affiliate Disclosure</h2>
          <p>
            TerraTraks may contain affiliate links. This means that if you click on certain links and make a purchase, we may receive a small commission at no additional cost to you. We only recommend products and services that we believe will be valuable to our users. Your support helps us continue to provide free and valuable content.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">11. Contact Information</h2>
          <p>
            If you have any questions about this Risk, Medical & AI Disclaimer, please contact us at{" "}
            <Link href="/support" className="text-primary hover:text-primary-dark underline">
              our support page
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
