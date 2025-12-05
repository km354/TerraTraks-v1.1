import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg max-w-none space-y-6 text-text-secondary">
        <p className="text-sm text-text-secondary mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">1. Information We Collect</h2>
          <p>
            We collect information that you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This may include:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Name and email address</li>
            <li>Payment information (processed securely through third-party providers)</li>
            <li>Trip planning data and preferences</li>
            <li>Communication preferences</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">2. Geographic Scope</h2>
          <p>
            TerraTraks is intended for users located in the United States. If you access the service from outside the United States, you do so at your own risk and are responsible for compliance with local laws.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">3. Children&apos;s Privacy</h2>
          <p>
            TerraTraks does not knowingly collect, solicit, or store personal information from children under the age of 13. If you are under 13, you are not permitted to use TerraTraks or provide any personal information to us. If we become aware that personal data has been collected from a child under 13 without verifiable parental consent, we will delete such information as quickly as possible. If you believe we may have collected information from a child, please contact us immediately through{" "}
            <Link href="/support" className="text-primary hover:text-primary-dark underline">
              our support page
            </Link>
            .
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">4. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send you technical notices and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Monitor and analyze trends and usage</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">5. Information Sharing</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>With your consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and safety</li>
            <li>With service providers who assist us in operating our platform</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">6. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">7. Cookies and Tracking</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">8. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access and receive a copy of your personal data</li>
            <li>Rectify inaccurate personal data</li>
            <li>Request deletion of your personal data</li>
            <li>Object to processing of your personal data</li>
            <li>Request restriction of processing your personal data</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">9. Data Retention</h2>
          <p>
            We retain personal information only for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. Account information and trip data may be retained for a period after account closure unless deletion is requested. You may request deletion of your personal data at any time, subject to technical and legal limitations.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">10. Affiliate Disclosure</h2>
          <p>
            TerraTraks may contain affiliate links. This means that if you click on certain links and make a purchase, we may receive a small commission at no additional cost to you. We only recommend products and services that we believe will be valuable to our users. Your support helps us continue to provide free and valuable content.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">11. Changes to This Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">12. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at{" "}
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
