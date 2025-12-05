import Link from "next/link";

export default function AccessibilityPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-8">Accessibility Statement</h1>
      
      <div className="prose prose-lg max-w-none space-y-6 text-text-secondary">
        <p className="text-sm text-text-secondary mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">Our Commitment</h2>
          <p>
            TerraTraks is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards to achieve these goals.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">Accessibility Standards</h2>
          <p>
            We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 level AA standards. These guidelines explain how to make web content more accessible for people with disabilities and user-friendly for everyone.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">Current Features</h2>
          <p>We have implemented the following accessibility features:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Semantic HTML structure for screen readers</li>
            <li>Alternative text for images</li>
            <li>Keyboard navigation support</li>
            <li>Sufficient color contrast ratios</li>
            <li>Resizable text without loss of functionality</li>
            <li>Focus indicators for interactive elements</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">Areas for Improvement</h2>
          <p>
            We recognize that accessibility is an ongoing effort. We are continuously working to improve the accessibility of our platform. If you encounter any accessibility barriers, please let us know.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">Feedback</h2>
          <p>
            We welcome your feedback on the accessibility of TerraTraks. If you encounter accessibility barriers, please contact us:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Via our{" "}
              <Link href="/support" className="text-primary hover:text-primary-dark underline">
                support page
              </Link>
            </li>
            <li>By describing the specific accessibility issue you encountered</li>
            <li>By suggesting improvements we could make</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">Third-Party Content</h2>
          <p>
            Some content on our platform may be provided by third parties. While we strive to ensure all content meets accessibility standards, we may not have full control over third-party content.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">Assistive Technologies</h2>
          <p>
            TerraTraks is designed to work with common assistive technologies, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Screen readers (JAWS, NVDA, VoiceOver)</li>
            <li>Screen magnification software</li>
            <li>Voice recognition software</li>
            <li>Keyboard-only navigation</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">Affiliate Disclosure</h2>
          <p>
            TerraTraks may contain affiliate links. This means that if you click on certain links and make a purchase, we may receive a small commission at no additional cost to you. We only recommend products and services that we believe will be valuable to our users. Your support helps us continue to provide free and valuable content.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">Updates to This Statement</h2>
          <p>
            We will review and update this accessibility statement regularly to reflect our ongoing commitment to accessibility.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">Contact Us</h2>
          <p>
            If you have any questions or concerns about accessibility on TerraTraks, please contact us at{" "}
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
