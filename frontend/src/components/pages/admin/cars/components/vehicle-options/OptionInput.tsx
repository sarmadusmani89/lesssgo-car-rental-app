import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";

interface Props {
    value: string;
    onChange: (value: string) => void;
    onAdd: () => void;
    placeholder: string;
}

export default function OptionInput({ value, onChange, onAdd, placeholder }: Props) {
    return (
        <div className="flex gap-3 mb-8">
            <FormInput
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onAdd()}
                placeholder={placeholder}
            />
            <Button
                onClick={onAdd}
                disabled={!value.trim()}
                className="whitespace-nowrap"
            >
                <Plus size={18} className="mr-2" />
                Add
            </Button>
        </div>
    );
}
