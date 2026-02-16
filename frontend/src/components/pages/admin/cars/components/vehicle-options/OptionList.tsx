"use client";

import { Plus } from "lucide-react";
import OptionItem from "./OptionItem";

interface Props {
    items: string[];
    onDeleteItem: (index: number) => void;
}

export default function OptionList({ items, onDeleteItem }: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-8">
            {items?.map((item, index) => (
                <OptionItem
                    key={`${item}-${index}`}
                    item={item}
                    onDelete={() => onDeleteItem(index)}
                />
            ))}

            {(!items || items.length === 0) && (
                <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                    <Plus size={32} className="mb-2 opacity-20" />
                    <p className="text-sm font-medium">No items added yet</p>
                </div>
            )}
        </div>
    );
}
