import Link from "next/link";

export default function AffiliatePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-8">Affiliate Disclosure</h1>
      
      <div className="prose prose-lg max-w-none space-y-6 text-text-secondary">
        <p className="text-sm text-text-secondary mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">What Are Affiliate Links?</h2>
          <p>
            TerraTraks may contain affiliate links. This means that if you click on certain links and make a purchase, we may receive a small commission at no additional cost to you. These affiliate links help us maintain and improve our platform while keeping it free for users.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">Our Commitment to You</h2>
          <p>
            We only recommend products and services that we believe will be valuable to our users. Our recommendations are based on:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Quality and reliability of the product or service</li>
            <li>Relevance to national park travel and outdoor activities</li>
            <li>Positive user experiences and reviews</li>
            <li>Alignment with our values and mission</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">Transparency</h2>
          <p>
            We believe in transparency and want you to know when we may earn a commission. Affiliate relationships do not influence our editorial content or recommendations. We maintain editorial independence and only recommend products and services we genuinely believe will benefit our users.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">Your Support</h2>
          <p>
            When you use our affiliate links, you&apos;re supporting TerraTraks and helping us continue to provide free and valuable content. Your support enables us to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Maintain and improve our platform</li>
            <li>Develop new features and tools</li>
            <li>Keep our services accessible to all users</li>
            <li>Continue providing high-quality trip planning resources</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">No Additional Cost to You</h2>
          <p>
            Using our affiliate links does not increase the price you pay for products or services. The commission we receive comes from the merchant, not from you. You pay the same price whether you use our affiliate link or go directly to the merchant&apos;s website.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-primary">Questions or Concerns</h2>
          <p>
            If you have any questions about our affiliate relationships or this disclosure, please contact us at{" "}
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








