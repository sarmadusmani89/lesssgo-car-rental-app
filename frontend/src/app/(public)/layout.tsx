import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import Newsletter from '@/components/layout/Newsletter/Newsletter';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            <main className="main-content">{children}</main>
            <Newsletter />
            <Footer />
        </>
    );
}
