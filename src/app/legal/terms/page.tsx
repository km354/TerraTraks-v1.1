import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-8">Terms of Service</h1>
      
      <div className="prose prose-lg max-w-none space-y-6 text-text-secondary">
        <p className="text-sm text-text-secondary mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">1. Acceptance of Terms</h2>
          <p>
            By accessing and using TerraTraks, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">2. Eligibility</h2>
          <p>
            You must be at least 13 years old to use TerraTraks. By accessing or using the platform, you represent and warrant that you are at least 13 years of age. If you are under 18, you may use TerraTraks only with the permission and supervision of a parent or legal guardian.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">3. Use License</h2>
          <p>
            Permission is granted to temporarily use TerraTraks for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to reverse engineer any software contained on TerraTraks</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">4. Disclaimer</h2>
          <p>
            The materials on TerraTraks are provided on an &apos;as is&apos; basis. TerraTraks makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">5. Limitations</h2>
          <p>
            In no event shall TerraTraks or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on TerraTraks, even if TerraTraks or a TerraTraks authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">6. Billing, Subscriptions, Refunds, and Cancellations</h2>
          <p>
            TerraTraks offers subscription-based access to certain features of the platform. By purchasing a subscription, you authorize TerraTraks to automatically charge the applicable fees to your selected payment method on a recurring basis until you cancel. Subscription plans may automatically renew at the end of each billing cycle unless you cancel before the renewal date.
          </p>
          <p>
            All payments are final and non-refundable, including fees paid for partially used subscription periods. TerraTraks does not provide refunds or credits for unused time, downgrades, or accidental purchases, except where required by applicable law.
          </p>
          <p>
            You may cancel your subscription at any time by accessing your account settings. Upon cancellation, you will retain access to paid features until the end of the current billing cycle; no prorated refunds are issued. If your payment fails or is declined, TerraTraks may suspend or terminate your access to paid features.
          </p>
          <p>
            TerraTraks is not responsible for banking or third-party fees, currency exchange charges, or payment disputes initiated through your financial institution.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">7. Affiliate Disclosure</h2>
          <p>
            TerraTraks may contain affiliate links. This means that if you click on certain links and make a purchase, we may receive a small commission at no additional cost to you. We only recommend products and services that we believe will be valuable to our users. Your support helps us continue to provide free and valuable content.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">8. Third-Party Mapping and Location Services</h2>
          <p>
            TerraTraks incorporates third-party services for maps, routing, geolocation, places data, and other location-based features, including but not limited to Google Maps Platform, Google Places API, and Mapbox services. By using TerraTraks, you agree to be bound by the respective terms and privacy policies of these providers.
          </p>
          <p>
            TerraTraks does not create or control underlying map data, route suggestions, business listings, places data, road closures, or travel times. Such information may be incomplete, inaccurate, or outdated. You agree to independently verify all routing details, trailheads, closures, driving directions, place information, and other geographic or location-based details before relying on them.
          </p>
          <p>
            Data sources may include Google Maps, Google Places, Mapbox, and OpenStreetMap contributors. All trademarks, copyrights, and data rights remain the property of their respective owners.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">9. User-Generated Content and Indemnification</h2>
          <p>
            Certain features of TerraTraks may allow you to input, upload, or generate content, including trip plans, notes, preferences, routes, and other user-submitted information (&quot;User Content&quot;). You retain ownership of your User Content; however, by submitting User Content to TerraTraks, you grant TerraTraks a worldwide, non-exclusive, royalty-free license to use, display, reproduce, modify, and distribute such content solely for the purpose of operating and improving the platform.
          </p>
          <p>
            You represent and warrant that you own or have the necessary rights to the User Content you submit and that such content does not infringe or violate any third-party rights.
          </p>
          <p>
            You agree to indemnify, defend, and hold harmless TerraTraks, its owners, employees, affiliates, and partners from any claims, losses, liabilities, damages, costs, or expenses (including attorney&apos;s fees) arising out of or related to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>(a) your use of the platform,</li>
            <li>(b) your User Content,</li>
            <li>(c) any violation of these Terms, or</li>
            <li>(d) your violation of any rights of another party.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">10. Copyright and DMCA Policy</h2>
          <p>
            TerraTraks respects the intellectual property rights of others and expects users to do the same. If you believe that any content posted on TerraTraks infringes your copyright, you may notify us by submitting a written notice that includes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Identification of the copyrighted work claimed to be infringed</li>
            <li>Identification of the infringing material and its location on the platform</li>
            <li>Your contact information</li>
            <li>A statement that you have a good-faith belief that the use is not authorized</li>
            <li>A statement, under penalty of perjury, that the information in your notice is accurate and that you are authorized to act on behalf of the copyright owner</li>
            <li>Your physical or electronic signature</li>
          </ul>
          <p>
            Upon receipt of a valid notice, TerraTraks will remove or disable access to the allegedly infringing material in accordance with applicable law.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">11. Revisions</h2>
          <p>
            TerraTraks may revise these terms of service at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">12. Service Modifications and Availability</h2>
          <p>
            TerraTraks may add, modify, or discontinue features, services, or pricing at any time, with or without notice. We do not guarantee that the platform, or any portion of it, will always be available or operate without interruption. TerraTraks shall not be liable for any modification, suspension, or discontinuation of the service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">13. Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at{" "}
            <Link href="/support" className="text-primary hover:text-primary-dark underline">
              our support page
            </Link>
            .
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">14. Governing Law and Dispute Resolution</h2>
          <p>
            These Terms of Service and any disputes arising out of or relating to TerraTraks shall be governed and interpreted in accordance with the laws of the State of Missouri, without regard to its conflict of law provisions.
          </p>
          <p>
            Any dispute, claim, or controversy arising out of or relating to these Terms or your use of TerraTraks shall be resolved exclusively through binding arbitration administered by a recognized arbitration provider. You waive any right to participate in a class action lawsuit or class-wide arbitration. You agree to resolve disputes only on an individual basis.
          </p>
          <p>
            If any portion of this section is found to be unenforceable, the remainder shall remain in full force and effect.
          </p>
        </section>
      </div>
    </div>
  );
}
