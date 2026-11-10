import Link from "next/link";
import { site } from "@/content/site";
import { LegalPage } from "@/components/sections/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Terms and Conditions", description: `Terms for using the ${site.name} website, its pricing information and estimator.`, path: "/terms-and-conditions" });

export default function TermsPage() {
  return (
    <LegalPage title="Terms and Conditions" path="/terms-and-conditions" updated="10 November 2026">
      <p>These terms cover your use of this website. Project work is governed by the written proposal and agreement we sign with each client, which take precedence over anything on this site.</p>

      <h2>Website content</h2>
      <p>We aim to keep information accurate and current, but the content is provided for general information and may change without notice.</p>

      <h2>Pricing and estimates</h2>
      <p>Prices shown on the <Link href="/pricing">pricing page</Link> and results from the <Link href="/estimate">estimator</Link> are indicative and do not constitute an offer. Prices may change based on scope, integrations, project complexity and final requirements. Converted prices are references based on recorded exchange rates. Taxes and third-party costs are not included unless stated. A binding price is only set in a written proposal you accept.</p>

      <h2>No guaranteed outcomes</h2>
      <p>We don’t guarantee specific search rankings, follower numbers, traffic, sales or app-store approval. Any expectations will be set out in your proposal.</p>

      <h2>Website assistant</h2>
      <p>The assistant answers from this website’s content and may occasionally be wrong or incomplete. Confirm anything important with us directly before relying on it.</p>

      <h2>Intellectual property</h2>
      <p>The {site.name} name, logo, website design and content belong to {site.name} unless otherwise stated. Product names shown in screenshots may use demo data.</p>

      <h2>Acceptable use</h2>
      <p>Don’t misuse the site — for example by submitting spam, attempting to access systems without permission, or overloading forms or the assistant.</p>

      <h2>Liability</h2>
      <p>To the extent permitted by law, we aren’t liable for losses arising from use of this website’s general information. Nothing in these terms limits liability that cannot be limited by law.</p>

      <h2>Governing law</h2>
      <p>Governing law and jurisdiction are to be confirmed by {site.name}’s legal adviser.</p>

      <h2>Contact</h2>
      <p><a href={`mailto:${site.email}`}>{site.email}</a></p>
    </LegalPage>
  );
}
