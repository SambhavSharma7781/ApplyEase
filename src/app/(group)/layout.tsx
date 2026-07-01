import type { Metadata } from "next";
import { getUserFromCookies } from "@/helper";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ClientProviders from "@/components/client-providers";

export const metadata: Metadata = {
    title: "ApplyEase — Find Your Next Role",
    description: "Discover opportunities from top companies and take the next step in your career.",
};

export default async function GroupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getUserFromCookies();

    return (
        <>
            <Navbar user={user} />
            <ClientProviders initialUser={user}>
                <div className="min-h-[calc(100vh-4rem)] bg-[#F7F7F8]">
                    {children}
                </div>
            </ClientProviders>
            <Footer user={user} />
        </>
    );
}
