import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormDescription, FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import LoadingButton from '@/components/LoadingButton';
import { Button } from '@/components/ui/button';
import type { User } from '@/types';
import { useEffect } from 'react';

const formSchema = z.object({
    email: z.string().optional(),
    name: z.string().min(1, { message: "Name is Required" }).max(50, { message: "Name must be at most 50 characters." }),
    addressLine1: z.string().min(1, { message: "Address is Required" }).max(50, { message: "Address Line 1 must be at most 50 characters." }),
    city: z.string().min(1, { message: "City is Required" }).max(30, { message: "City must be at most 30 characters." }),
    state: z.string().min(1, { message: "State is Required" }).max(30, { message: "State must be at most 30 characters." }),
    country: z.string().min(1, { message: "Country is Required" }).max(30, { message: "Country must be at most 30 characters." }),
    zipCode: z.number().min(1, { message: "Zip Code is Required" }).max(99999, { message: "Zip Code must be at most 5 digits." }),
    phoneNumber: z.number().min(1, { message: "Phone Number is Required" }).max(999999999999999, { message: "Phone Number must be at most 15 digits." }),
});

export type UserFormData = z.infer<typeof formSchema>;

type Props = {
    currentUser: User;
    onSave: (userProfileData: UserFormData) => void;
    isLoading: boolean;
    buttonText?: string;
    title?: string;
};

const UserProfileForm = ({ onSave, isLoading, currentUser, buttonText = "Save", title = "User Profile" }: Props) => {
    const form = useForm<UserFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: currentUser,
    });

    useEffect(() => {
        form.reset(currentUser);
    }, [currentUser, form]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSave)} className="space-y-4 bg-gray rounded-lg md:p-10">
                <div>
                    <h2 className="text-2xl font-bold mb-4">{title}</h2>
                    <FormDescription> Update your user profile information below.</FormDescription>                    
                </div>
                <h2 className='font-bold'> Données personnelles</h2>
                    <FormField control={form.control} name="name" render={({ field }) => (                    
                    <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                            <Input {...field}  className='bg-white' />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (                    
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input {...field} disabled className='bg-white' />
                        </FormControl>
                    </FormItem>
                )} />  
                <FormField control={form.control} name="phoneNumber" render={({ field }) => (                    
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
                <h2 className='font-bold'> Adresse</h2>
                <FormField control={form.control} name="addressLine1" render={({ field }) => (                    
                    <FormItem className='flex-1'>
                        <FormLabel>Rue et numéro</FormLabel>
                        <FormControl>
                            <Input {...field} className='bg-white' />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )} />            
                <div className='flex flex-wrap -mx-3 mb-2'>
                <FormField control={form.control} name="zipCode" render={({ field }) => (                    
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
                <FormField control={form.control} name="city" render={({ field }) => (                    
                    <FormItem className='w-full md:w-1/3 px-3 mb-6 md:mb-0'>
                        <FormLabel>Ville</FormLabel>
                        <FormControl>
                            <Input {...field} className='bg-white' />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />                
                <FormField control={form.control} name="state" render={({ field }) => (                    
                    <FormItem className='w-full md:w-1/3 px-3 mb-6 md:mb-0'>
                        <FormLabel>Canton</FormLabel>
                        <FormControl>
                            <Input {...field} className='bg-white' />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                </div>                
                <FormField control={form.control} name="country" render={({ field }) => (                    
                    <FormItem className='w-full md:w-1/2'>
                        <FormLabel>Pays</FormLabel>
                        <FormControl>
                            <Input {...field} className='bg-white' />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />                
                {isLoading ? (<LoadingButton />) : (<Button type="submit" className='bg-orange-500'>{buttonText}</Button>)}
            </form>
        </Form>
    );

};

export default UserProfileForm;