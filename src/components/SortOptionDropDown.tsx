import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type Props = {
    onChange: (value: string) => void;
    sortOption: string;
};
const SORT_OPTIONS = [
    {
        label: "Plus récent",
        value: "lastUpdate"
    },
    {
        label: "Prix croissant",
        value: "priceAsc"
    },
    {
        label: "Prix décroissant", 
        value: "priceDesc"
    },
    {
        label: "Note décroissante",
        value: "ratingDesc"
    },
    {
        label: "Note croissante",
        value: "ratingAsc"
    },
];

const SortOptionDropDown = ({ onChange, sortOption }: Props) => {

    const selectedSortLabel = SORT_OPTIONS.find(option => option.value === sortOption)?.label || SORT_OPTIONS[0].label;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer">
                <Button variant="outline" className="w-full justify-between">
                    Sort by: {selectedSortLabel}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {SORT_OPTIONS.map((option) => (
                <DropdownMenuItem key={option.value} className="cursor-pointer" onClick={() => onChange(option.value)}>
                    {option.label}
                </DropdownMenuItem>
            ))} 
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default SortOptionDropDown;