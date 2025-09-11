import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";


type Props = {
  index: number;
  removeMenuItem: () => void;
};


const MenuItemInput = ({ index, removeMenuItem }: Props) => {  
    const { control } = useFormContext();
    return (
        <div className="flex flex-row items-end gap-2">
            <FormField control={control} name={`menuItems.${index}.name`} render={({ field }) => 
                <FormItem>
                    <FormLabel className="flex items-center gap-1">Item Name<FormMessage /></FormLabel>
                    <FormControl>
                        <input {...field} className="bg-white p-2 rounded-md border border-gray-300 w-48" placeholder="Item Name" />
                    </FormControl>
                </FormItem>
            } />
            <FormField control={control} name={`menuItems.${index}.price`} render={({ field }) => 
                <FormItem>
                    <FormLabel className="flex items-center gap-1">Item Price (CHF)<FormMessage /></FormLabel>
                    <FormControl>
                        <input {...field} className="bg-white p-2 rounded-md border border-gray-300 w-48" placeholder="Item Price" />
                    </FormControl>
                </FormItem>
            } />
            <Button type="button" onClick={removeMenuItem} className="bg-red-500 text-white p-2 rounded-md">
                Remove Item
            </Button>
        </div>


    )};
export default MenuItemInput;