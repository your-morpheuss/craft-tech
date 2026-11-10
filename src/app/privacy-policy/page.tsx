import { site } from "@/content/site";
import { LegalPage } from "@/components/sections/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Privacy Policy", description: `How ${site.name} collects and uses information on this website.`, path: "/privacy-policy" });

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" path="/privacy-policy" updated="10 November 2026">
      <p>This policy explains what information {site.name} (“we”) collects through this website, why, and what choices you have. Questions: <a href={`mailto:${site.email}`}>{site.email}</a>.</p>

      <h2>Information you give us</h2>
      <p>When you use the contact form, project brief, demo request or estimator enquiry, we receive the details you enter: typically your name, email address, and optionally company, country, phone number, preferred contact method, project description, selected services, timeline, budget range, website address and your estimator selections. We use this only to respond to your enquiry and, if we work together, to prepare and deliver a proposal.</p>

      <h2>The website assistant</h2>
      <p>If you use the “Ask Craft Tech Labs” assistant, the messages you type are sent to our server to find relevant answers from this website’s content. When the AI mode is enabled, your messages and the matching website content are processed by our AI provider to generate a reply. We do not store assistant conversations on our servers. Please don’t enter sensitive personal information in the assistant.</p>

      <h2>Information stored in your browser</h2>
      <ul>
        <li><strong>Region and currency preference</strong> (local storage) — so pricing stays in your chosen currency.</li>
        <li><strong>Intro animation flag</strong> (session storage) — so the opening animation plays once per visit.</li>
        <li><strong>Form and estimator drafts</strong> (session storage) — so you don’t lose progress; cleared when you close the tab or after a successful submission.</li>
        <li><strong>Offline copies of pages you’ve visited</strong> (browser cache) — so previously viewed pages work without a connection. Form submissions and assistant messages are never cached.</li>
      </ul>
      <p>This website does not currently use advertising or analytics cookies.</p>

      <h2>Country suggestion</h2>
      <p>To suggest a currency, our hosting provider may tell us the country your connection appears to come from. We use only the country code, do not store it, and you can change the suggestion at any time. We never request your precise location.</p>

      <h2>Service providers</h2>
      <p>We use trusted providers to run this site: our hosting provider; <strong>Web3Forms</strong>, which receives form submissions directly from your browser and emails them to us (and, if enabled, hCaptcha for spam protection); an exchange-rate service for indicative currency conversion (no personal data is sent); and, where enabled, an AI provider for the assistant. They process data only for these purposes.</p>

      <h2>Retention</h2>
      <p>Enquiries are kept for as long as needed to respond and manage any resulting work, then deleted or anonymised. You can ask us to delete your enquiry at any time.</p>

      <h2>Your choices and rights</h2>
      <p>You can ask to access, correct or delete the personal information you’ve sent us by emailing <a href={`mailto:${site.email}`}>{site.email}</a>. Depending on where you live, you may have additional rights under local law.</p>

      <h2>Security</h2>
      <p>Forms are validated on our server and protected against automated abuse. No method of transmission or storage is completely secure, but we take reasonable measures to protect your information.</p>

      <h2>Changes</h2>
      <p>We’ll update this page if our practices change and revise the date above.</p>
    </LegalPage>
  );
}
