// Nextra
import { Head } from "nextra/components";

// Layout
import Layout from "@/Layout";

// =====================================================================================================================

export const metadata = {
  title: "Ioloco Auth | Nextjs auth library with custom backend",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head></Head>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
