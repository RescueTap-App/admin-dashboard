import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface SearchProps {
    value: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (e: any) => void;
    placeholder?: string
}

export default function SearchInput({ value, placeholder = " ", onChange }: SearchProps) {
    return (
        <div className="relative w-full">
            <Input
                type="text"
                placeholder={`Search ${placeholder}`}
                value={value}
                onChange={onChange}
                className="w-full max-w-sm pl-8 pr-3 py-2 text-sm rounded font-lato"
            />
            <Search size={19} className="absolute top-2 left-1.5 text-gray-600" />
        </div>
    )
}
