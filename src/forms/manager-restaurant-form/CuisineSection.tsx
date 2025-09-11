import { FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { cuisineList } from "@/config/restaurant-option-config";
import { useFormContext } from "react-hook-form";
import CuisineCheckBox from "./CuisineCheckbox";

const CuisineSection = () => {
  const { control } = useFormContext();

    return (
        <div className="space-y-2">
            <div>
                <h2 className="text-2xl font-bold">Cuisine</h2>
            <FormDescription>
                Select the type of cuisine your restaurant specializes in.
            </FormDescription>
            </div>
            <FormField control={control} name="cuisines" render={({ field }) => (
                <FormItem>
                    <div className="grid md:grid-cols-5 gap-1">
                    {cuisineList.map((cuisineItem) => (
                        <CuisineCheckBox key={cuisineItem.value} cuisine={cuisineItem.value} field={field} />
                    ))}
                    </div>
                    <FormMessage />
                </FormItem>
)} />
        </div>
    );
};

export default CuisineSection;