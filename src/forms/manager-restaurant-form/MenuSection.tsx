import { FormDescription, FormField, FormItem } from "@/components/ui/form";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import MenuItemInput from "./MenuItemInput";
import { ObjectId } from "bson";


const MenuSection = () => {  
    const { control } = useFormContext();
    
    const { fields, append, remove } = useFieldArray({
        control,
        name: "menuItems",
    });

    return (
        <div className="space-y-2">
            <div>
                <h2 className="text-lg font-medium">Menu Items</h2>
                <FormDescription>
                    <p>Add, remove, and reorder menu items for your restaurant.</p>
                </FormDescription>
            </div>
            <FormField control={control} name="menuItems" render={({  }) => (
                <FormItem className="flex flex-col gap-2">
                    {fields.map((_, index) => (
                        <MenuItemInput key={index} index={index} removeMenuItem={() => remove(index)} />
                    ))}                
                </FormItem>
            )} />
            <Button type="button" onClick={() => append({ _id: new ObjectId().toString(), name: "", description: "", price: 0 })} >
                Add Menu Item
            </Button>
        </div>
    );
};

export default MenuSection;