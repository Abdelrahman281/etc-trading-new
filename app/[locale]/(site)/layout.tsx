import { Navbar } from '@/components/site/navbar';
import { Footer } from '@/components/site/footer';
import { WhatsAppButton } from '@/components/site/whatsapp-button';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
