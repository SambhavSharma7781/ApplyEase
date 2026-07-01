import { Container } from "@/components/ui/container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — ApplyEase",
  description: "Learn how ApplyEase collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <div className="pb-24 pt-16 md:pt-24">
      <Container>
        <div className="max-w-3xl mx-auto bg-white p-6 md:p-8 lg:p-12 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="mb-8 md:mb-10 border-b border-zinc-100 pb-6 md:pb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-zinc-900 mb-3 md:mb-4">
              Privacy Policy
            </h1>
            <p className="text-xs md:text-sm text-zinc-500">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <div className="space-y-6 md:space-y-8 text-sm md:text-base text-zinc-600 leading-relaxed">
            <section>
              <h2 className="text-lg md:text-xl font-semibold text-zinc-900 mb-2 md:mb-3">1. Information We Collect</h2>
              <p className="mb-3">
                To provide our services as a job platform in India, we collect information that you voluntarily provide when creating an account, setting up a profile, or posting jobs. The information we collect includes:
              </p>
              <ul className="list-disc pl-5 space-y-1 md:space-y-2">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Resume and professional history</li>
                <li>Profile information (skills, education, and experience)</li>
                <li>Job applications you submit</li>
                <li>Employer and company information (if you are hiring on the platform)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-semibold text-zinc-900 mb-2 md:mb-3">2. How We Use Your Information</h2>
              <p className="mb-3">The information we collect is used to:</p>
              <ul className="list-disc pl-5 space-y-1 md:space-y-2">
                <li>Authenticate users and manage accounts.</li>
                <li>Match candidates with relevant job opportunities.</li>
                <li>Improve our job search functionality and recommendations.</li>
                <li>Maintain platform security and prevent unauthorized access.</li>
                <li>Operate platform features, such as application tracking and employer dashboards.</li>
                <li>Communicate with you regarding account updates, support requests, and platform changes.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-semibold text-zinc-900 mb-2 md:mb-3">3. Data Sharing and Disclosure</h2>
              <p>
                If you apply for a job on ApplyEase, we will share your profile, resume, and application details with the respective employer. We do not sell your personal information to third parties for marketing purposes. We may share information with trusted service providers who assist us in operating our platform, subject to strict confidentiality agreements. We may also disclose information if required to do so by applicable Indian laws or valid legal processes.
              </p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-semibold text-zinc-900 mb-2 md:mb-3">4. Security</h2>
              <p>
                We take reasonable measures to protect your personal information from loss, theft, misuse, and unauthorized access. However, no internet transmission is entirely secure, and we cannot guarantee the absolute security of your data.
              </p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-semibold text-zinc-900 mb-2 md:mb-3">5. Your Account Information</h2>
              <p>
                You may update, correct, or delete your account information at any time by logging into your account settings. Keep in mind that employers who have received your job applications may have already saved a copy of your resume and profile data outside of our platform.
              </p>
            </section>

            <section>
              <h2 className="text-lg md:text-xl font-semibold text-zinc-900 mb-2 md:mb-3">6. Contact Us</h2>
              <p>
                If you have any questions or concerns about this Privacy Policy or how we handle your data, please reach out to us at:
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
