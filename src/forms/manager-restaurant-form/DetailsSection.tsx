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
                <FormField control={control} name="phoneNumber" render={({ field }) => (                    
                    <FormItem className='w-full md:w-1/2'>
                        <FormLabel>Numéro de téléphone</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="number"
                                value={field.value ?? ""}
                                onChange={e => field.onChange(e.target.value === "" ? undefined : +e.target.value)}
                                className='bg-white'
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />  
                <FormField control={control}            
                    name="website"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                                <Input {...field} className="bg-white" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>                    
                    )}
                />
                <FormField control={control}            
                    name="emailRestaurant"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormLabel>Email</FormLabel>
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
            <div className="flex flex-wrap -mx-3 mb-2">
                 <FormField control={control}
                name="city"
                render={({ field }) => (
                    <FormItem className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <FormLabel>City</FormLabel>
                        <FormControl>
                            <Input {...field} className="bg-white" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField control={control} name="zipCode" render={({ field }) => (
                    <FormItem className='w-full md:w-1/3 px-3 mb-6 md:mb-0'>
                        <FormLabel>Code postal</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="number"
                                value={field.value ?? ""}
                                onChange={e => field.onChange(e.target.value === "" ? undefined : +e.target.value)}
                                className='bg-white'
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            <FormField control={control}
                name="state"
                render={({ field }) => (
                    <FormItem className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <FormLabel>State</FormLabel>
                        <FormControl>
                            <Input {...field} className="bg-white" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            </div>
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
            <div className="flex gap-4">
                 <FormField control={control}
                name="deliveryPrice"
                render={({ field }) => (
                    <FormItem className="max-w-[25%]">
                        <FormLabel>Delivery Price (CHF)</FormLabel>
                        <FormControl>
                            <Input {...field} type="number" className="bg-white" placeholder="1.50" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
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