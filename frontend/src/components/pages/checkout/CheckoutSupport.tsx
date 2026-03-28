import SupportCard from '@/components/ui/SupportCard';

export default function CheckoutSupport() {
    return (
        <SupportCard 
            variant="primary" 
            title="Need assistance?"
            description='"Safe and secure payments powered by Stripe."'
            buttonText="Registry Support"
            className="p-8 rounded-[2.5rem]"
        />
    );
}
