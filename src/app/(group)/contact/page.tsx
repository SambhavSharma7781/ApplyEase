import { Container } from "@/components/ui/container";
import { Mail, Phone, Clock, MessageSquare, Bug, Briefcase, Users } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — ApplyEase",
  description: "Get in touch with the ApplyEase team for support, inquiries, or collaboration.",
};

export default function ContactPage() {
  return (
    <div className="pb-24 pt-16 md:pt-24">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 mb-4 md:mb-6">
              Get in Touch
            </h1>
            <p className="text-base md:text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed">
              Whether you have a question about features, need technical support, or want to explore a partnership, our team is here to help.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
            {/* Contact Info Cards */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-zinc-200 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow duration-200">
              <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-indigo-50 flex items-center justify-center mb-5 md:mb-6 shrink-0">
                <Mail className="h-5 w-5 md:h-6 md:w-6 text-[#4F46E5]" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-zinc-900 mb-2">Email Us</h2>
              <p className="text-sm md:text-base text-zinc-600 mb-4 md:mb-6">For general inquiries and support.</p>
              <a href="mailto:sambhav7717@gmail.com" className="text-base md:text-lg font-semibold text-[#4F46E5] hover:text-[#4338CA] transition-colors break-all">
                sambhav7717@gmail.com
              </a>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl border border-zinc-200 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow duration-200">
              <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-indigo-50 flex items-center justify-center mb-5 md:mb-6 shrink-0">
                <Phone className="h-5 w-5 md:h-6 md:w-6 text-[#4F46E5]" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-zinc-900 mb-2">Call Us</h2>
              <p className="text-sm md:text-base text-zinc-600 mb-4 md:mb-6">We usually respond within 24–48 business hours.</p>
              <a href="tel:+917302282300" className="text-base md:text-lg font-semibold text-[#4F46E5] hover:text-[#4338CA] transition-colors break-all">
                +91 7302282300
              </a>
            </div>
          </div>

          {/* Support Information */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden mb-12 md:mb-16">
            <div className="p-6 md:p-8 lg:p-10 border-b border-zinc-100 bg-zinc-50/50">
              <h2 className="text-xl md:text-2xl font-bold text-zinc-900 mb-2">How Can We Help?</h2>
              <p className="text-sm md:text-base text-zinc-600">Direct your inquiry to the right department for faster resolution.</p>
            </div>
            
            <div className="grid sm:grid-cols-2 p-6 md:p-8 lg:p-10 gap-6 md:gap-8">
              <div className="flex gap-3 md:gap-4">
                <div className="mt-1 shrink-0">
                  <MessageSquare className="h-4 w-4 md:h-5 md:w-5 text-zinc-400" />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-semibold text-zinc-900 mb-1">General Support</h3>
                  <p className="text-xs md:text-sm text-zinc-600 leading-relaxed">Account assistance, feature questions, and general guidance on using the platform.</p>
                </div>
              </div>
              
              <div className="flex gap-3 md:gap-4">
                <div className="mt-1 shrink-0">
                  <Bug className="h-4 w-4 md:h-5 md:w-5 text-zinc-400" />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-semibold text-zinc-900 mb-1">Bug Reports</h3>
                  <p className="text-xs md:text-sm text-zinc-600 leading-relaxed">Found a glitch? Let us know so our engineering team can fix it quickly.</p>
                </div>
              </div>

              <div className="flex gap-3 md:gap-4">
                <div className="mt-1 shrink-0">
                  <Briefcase className="h-4 w-4 md:h-5 md:w-5 text-zinc-400" />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-semibold text-zinc-900 mb-1">Business Inquiries</h3>
                  <p className="text-xs md:text-sm text-zinc-600 leading-relaxed">Questions about posting multiple jobs or employer account support.</p>
                </div>
              </div>

              <div className="flex gap-3 md:gap-4">
                <div className="mt-1 shrink-0">
                  <Users className="h-4 w-4 md:h-5 md:w-5 text-zinc-400" />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-semibold text-zinc-900 mb-1">Collaboration</h3>
                  <p className="text-xs md:text-sm text-zinc-600 leading-relaxed">Partnerships, press inquiries, and marketing collaboration opportunities.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Response Time Notice */}
          <div className="bg-[#4F46E5]/10 rounded-xl p-5 md:p-6 flex items-start gap-3 md:gap-4">
            <div className="bg-[#4F46E5]/20 p-2 rounded-lg shrink-0 mt-0.5">
              <Clock className="h-4 w-4 md:h-5 md:w-5 text-[#4F46E5]" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-semibold text-indigo-900 mb-1">Expected Response Time</h3>
              <p className="text-xs md:text-sm text-indigo-800/80 leading-relaxed">
                We value your time. Our team strives to respond to all inquiries within <strong>24–48 business hours</strong>.
              </p>
            </div>
          </div>
          
        </div>
      </Container>
    </div>
  );
}
