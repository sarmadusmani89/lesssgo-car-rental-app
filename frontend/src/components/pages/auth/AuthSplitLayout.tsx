import Image from 'next/image';

interface AuthSplitLayoutProps {
    children: React.ReactNode;
    imageSrc: string;
    imageAlt: string;
    heading: React.ReactNode;
    subheading: string;
}

export default function AuthSplitLayout({ children, imageSrc, imageAlt, heading, subheading }: AuthSplitLayoutProps) {
    return (
        <div className="min-h-screen bg-[#020617] relative overflow-hidden flex items-center justify-center lg:block p-4 lg:p-0">
            {/* Background Decorations */}
            <div className="absolute -top-[500px] -right-[500px] w-[1000px] h-[1000px] bg-[radial-gradient(circle,rgba(37,99,235,0.1)_0%,transparent_70%)] z-0" />
            <div className="absolute -bottom-[300px] -left-[300px] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(124,58,237,0.05)_0%,transparent_70%)] z-0" />

            <div className="relative z-10 w-full lg:min-h-screen flex flex-col lg:flex-row bg-white overflow-hidden max-w-[500px] lg:max-w-none rounded-[2.5rem] lg:rounded-none shadow-2xl lg:shadow-none">
                {/* Side Section */}
                <div className="hidden lg:flex flex-1 relative items-end p-24 text-white rounded-br-[80px] overflow-hidden">
                    <div className="absolute inset-0">
                        <Image src={imageSrc} alt={imageAlt} fill priority className="object-cover opacity-60" quality={100} />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/20 to-transparent" />
                    <div className="relative z-10">
                        <div className="animate-slide-up space-y-6">
                            <h2 className="text-[3.5rem] font-black leading-none tracking-tighter">{heading}</h2>
                            <p className="text-lg text-slate-400 max-w-md">{subheading}</p>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className="flex-1 flex items-center justify-center p-8 lg:p-12 lg:pt-32 bg-white">
                    <div className="w-full max-w-[380px] lg:mt-8 animate-fade-in auth-card-content">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
