import Link from 'next/link'
import {BookOpen} from 'lucide-react'

function Footer() {
    return(
        <footer className="w-full border-t py-6 md:py-8 bg-white">
            <div className="container flex flex-col md:flex-row items-center justify-center gap-4">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                    <Link href="/" className="flex items-center gap-4">
                        <BookOpen className="h-5 w-5">
                        </BookOpen>
                    </Link>
                    <p className="text-sm text-muted-foreground text-center md:text-left">
                        @Copyrigth 2025 Readibly.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
                        Tentang
                    </Link>
                    <Link href="/services" className="text-sm text-muted-foreground hover:text-primary">
                        Layanan
                    </Link>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                        Kontak
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;