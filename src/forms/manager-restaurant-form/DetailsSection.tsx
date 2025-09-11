import { FormDescription, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";



const DetailsSection = () => {
    const { control } = useFormContext();
    return (
        <div className="space-y-2">
            <div>
                <h2 className="text-lg font-medium">Details</h2>
                <FormDescription>
                    Enter the details about your restaurant
                </FormDescription>
            </div>
                <FormField control={control}            
                    name="restaurantName"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} className="bg-white" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>                    
                    )}
                />  
            <div className="flex gap-4">
                 <FormField control={control}
                name="addressLine1"
                render={({ field }) => (
                    <FormItem className="flex-1">
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                            <Input {...field} className="bg-white" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            </div>
            <div className="flex gap-4">
                 <FormField control={control}
                name="city"
                render={({ field }) => (
                    <FormItem className="flex-1">
                        <FormLabel>City</FormLabel>
                        <FormControl>
                            <Input {...field} className="bg-white" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField control={control}
                name="state"
                render={({ field }) => (
                    <FormItem className="flex-1">
                        <FormLabel>State</FormLabel>
                        <FormControl>
                            <Input {...field} className="bg-white" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField control={control}
                name="country"
                render={({ field }) => (
                    <FormItem className="flex-1">
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                            <Input {...field} className="bg-white" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            </div>
            <div className="flex gap-4">
                 <FormField control={control}
                name="deliveryPrice"
                render={({ field }) => (
                    <FormItem className="max-w-[25%]">
                        <FormLabel>Delivery Price (CHF)</FormLabel>
                        <FormControl>
                            <Input {...field} className="bg-white" placeholder="1.50" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            </div>
            <div className="flex gap-4">
                 <FormField control={control}
                name="estimatedDeliveryTime"
                render={({ field }) => (
                    <FormItem className="max-w-[25%]">
                        <FormLabel>Delivery Time (minutes)</FormLabel>
                        <FormControl>
                            <Input {...field} type="number" min={1} step={1} className="bg-white" placeholder="30" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            </div>
           
        </div>
    );
}

export default DetailsSection;