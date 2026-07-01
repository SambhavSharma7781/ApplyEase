import { Container } from "@/components/ui/container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions — ApplyEase",
  description: "Read the Terms and Conditions for using the ApplyEase platform.",
};

export default function TermsPage() {
  return (
    <div className="pb-24 pt-16 md:pt-24">
      <Container>
        <div className="max-w-3xl mx-auto bg-white p-6 md:p-8 lg:p-12 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="mb-8 md:mb-10 border-b border-zinc-100 pb-6 md:pb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-zinc-900 mb-3 md:mb-4">
              Terms & Conditions
            </h1>
            <p className="text-xs md:text-sm text-zinc-500">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <div className="space-y-6 md:space-y-8 text-sm md:text-base text-zinc-600 leading-relaxed">
            <section>
              <h2 className="text-lg md:text-xl font-semibold text-zinc-900 mb-2 md:mb-3">1. Acceptance of Terms</h2>
              <p>
                Welcome to ApplyEase. By registering an account, accessing, or using our platform, you agree to comply with and be bound by these Terms and Conditions. These terms govern your use of ApplyEase, an Indian platform connecting job seekers with employers.
              </p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-semibold text-zinc-900 mb-2 md:mb-3">2. User Accounts & Accurate Information</h2>
              <p>
                To use certain features of ApplyEase, you must register for an account. You agree to provide true, accurate, current, and complete information about yourself or your company during registration and to maintain the accuracy of this information. You are responsible for all activities that occur under your account and for maintaining the confidentiality of your login credentials.
              </p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-semibold text-zinc-900 mb-2 md:mb-3">3. Job Seekers</h2>
              <p>
                If you are a job seeker, you agree to submit genuine applications for roles you are actually interested in. You must not misrepresent your qualifications, work history, or identity in your profile or resume. You acknowledge that ApplyEase does not guarantee employment or specific responses from employers.
              </p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-semibold text-zinc-900 mb-2 md:mb-3">4. Employers</h2>
              <p>
                If you are an employer, you agree to post only genuine, active job openings. You are responsible for the content of your job listings and must ensure they comply with applicable Indian labor and employment laws. You must use applicant data strictly for the purpose of recruitment for the specified roles.
              </p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-semibold text-zinc-900 mb-2 md:mb-3">5. Acceptable Use & Prohibited Activities</h2>
              <p className="mb-3">While using ApplyEase, you agree not to:</p>
              <ul className="list-disc pl-5 space-y-1 md:space-y-2">
                <li>Submit false, misleading, or deceptive information.</li>
                <li>Use the platform for any illegal purpose or in violation of any local, state, or national laws.</li>
                <li>Scrape, extract, or mine data from the platform using automated tools or software.</li>
                <li>Post content that is offensive, discriminatory, harassing, or otherwise inappropriate.</li>
                <li>Attempt to gain unauthorized access to other user accounts or platform infrastructure.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-semibold text-zinc-900 mb-2 md:mb-3">6. Intellectual Property</h2>
              <p>
                The ApplyEase platform, including its design, text, graphics, and software, is the property of ApplyEase and is protected by intellectual property laws. You may not copy, modify, distribute, or reproduce any part of the platform without our prior written consent. User-submitted content (like resumes and job descriptions) remains the property of the respective users.
              </p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-semibold text-zinc-900 mb-2 md:mb-3">7. Suspension or Termination</h2>
              <p>
                We reserve the right to suspend or terminate your account and access to the platform at our discretion, without prior notice, if we believe you have violated these Terms and Conditions or engaged in activities that harm ApplyEase, its users, or third parties.
              </p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-semibold text-zinc-900 mb-2 md:mb-3">8. Limitation of Liability</h2>
              <p>
                ApplyEase acts as a bridge between candidates and employers. We do not endorse any specific candidate or employer and are not responsible for employment decisions made by users. To the maximum extent permitted by applicable law, ApplyEase shall not be liable for any direct, indirect, incidental, or consequential damages resulting from your use of the platform.
              </p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-semibold text-zinc-900 mb-2 md:mb-3">9. Contact Information</h2>
              <p>
                If you have any questions regarding these Terms and Conditions, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-zinc-50 rounded-lg border border-zinc-100 overflow-hidden">
                <p className="font-medium text-zinc-900 text-sm md:text-base break-all sm:break-normal">
                  Email: <a href="mailto:sambhav7717@gmail.com" className="text-[#4F46E5] hover:underline">sambhav7717@gmail.com</a>
                </p>
                <p className="font-medium text-zinc-900 text-sm md:text-base mt-1 break-all sm:break-normal">
                  Phone: <a href="tel:+917302282300" className="text-[#4F46E5] hover:underline">+91 7302282300</a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
