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
    adresseLine1: z.string().min(1, { message: "Adress is Required" }).max(50, { message: "Adress Line 1 must be at most 50 characters." }),
    city: z.string().min(1, { message: "City is Required" }).max(30, { message: "City must be at most 30 characters." }),
    state: z.string().min(1, { message: "State is Required" }).max(30, { message: "State must be at most 30 characters." }),
    country: z.string().min(1, { message: "Country is Required" }).max(30, { message: "Country must be at most 30 characters." }),
});

export type UserFormData = z.infer<typeof formSchema>;

type Props = {
    currentUser: User;
    onSave: (userProfileData: UserFormData) => void;
    isLoading: boolean;
};

const UserProfileForm = ({ onSave, isLoading, currentUser }: Props) => {
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
                    <h2 className="text-2xl font-bold mb-4">User Profile</h2>
                    <FormDescription> Update your user profile information below.</FormDescription>                    
                </div>
                <FormField control={form.control} name="email" render={({ field }) => (                    
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input {...field} disabled className='bg-white' />
                        </FormControl>
                    </FormItem>
                )} />  
                <FormField control={form.control} name="name" render={({ field }) => (                    
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input {...field}  className='bg-white' />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <div className='flex flex-col md:flex-row gap-4'>
                    <FormField control={form.control} name="adresseLine1" render={({ field }) => (                    
                    <FormItem className='flex-1'>
                        <FormLabel>Adresse Line 1</FormLabel>
                        <FormControl>
                            <Input {...field} className='bg-white' />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )} />
                <FormField control={form.control} name="city" render={({ field }) => (                    
                    <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                            <Input {...field} className='bg-white' />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="state" render={({ field }) => (                    
                    <FormItem className='flex-1'>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                            <Input {...field} className='bg-white' />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="country" render={({ field }) => (                    
                    <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                            <Input {...field} className='bg-white' />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                </div>
                {isLoading ? (<LoadingButton />) : (<Button type="submit" className='bg-orange-500'>Submit</Button>)}
            </form>
        </Form>
    );

};

export default UserProfileForm;