import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import LoadingButton from '@/components/LoadingButton';
import { Button } from '@/components/ui/button';
import type { User } from '@/types';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronsUpDown, Check } from 'lucide-react';
import { languages } from '@/config/language-config';
import { useState } from 'react';
import { indicatifTelList } from '@/config/indicatif-phone-config';

const formSchema = z.object({
    email: z.string().optional(),
    nickname: z.string().optional(),
    name: z.string().min(1, { message: "Name is Required" }).max(50, { message: "Name must be at most 50 characters." }),
    firstname: z.string().min(1, { message: "Firstname is Required" }).max(50, { message: "Firstname must be at most 50 characters." }),
    birthdate: z.string().optional(),
    addressLine1: z.string().min(1, { message: "Address is Required" }).max(50, { message: "Address Line 1 must be at most 50 characters." }),
    city: z.string().min(1, { message: "City is Required" }).max(30, { message: "City must be at most 30 characters." }),
    state: z.string().min(1, { message: "State is Required" }).max(30, { message: "State must be at most 30 characters." }),
    country: z.string().min(1, { message: "Country is Required" }).max(30, { message: "Country must be at most 30 characters." }),
    zipCode: z.number().min(1, { message: "Zip Code is Required" }).max(99999, { message: "Zip Code must be at most 5 digits." }),
    phoneNumber: z.number().min(1, { message: "Phone Number is Required" }).max(999999999999999, { message: "Phone Number must be at most 15 digits." }),
    indicatifTel: z.string().min(1, { message: "Indicatif is Required" }).max(10, { message: "Indicatif must be at most 10 characters." }),
    language: z.string({ message: "Please select a language." }),
  })


export type UserFormData = z.infer<typeof formSchema>;

type Props = {
    currentUser: User;
    onSave: (userProfileData: UserFormData) => void;
    onCancel?: () => void;
    isLoading: boolean;
    buttonText?: string;
    title?: string;
};

const mapUserToFormData = (user: User | undefined): Partial<UserFormData> => {
    if (!user) return {
        name: "",
        firstname: "",
        birthdate: "",
        addressLine1: "",
        city: "",
        state: "",
        country: "",
        zipCode: 0,
        phoneNumber: 0,
        indicatifTel: "+41", 
        email: "",
        language: "fr", 
        nickname: ""
    };
    
    return {
        name: user.name || "",
        firstname: user.firstname || "",
        birthdate: user.birthdate || "",
        addressLine1: user.addressLine1 || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
        zipCode: user.zipCode || 0,
        phoneNumber: user.phoneNumber || 0,
        indicatifTel: user.indicatifTel || "+41",
        email: user.email || "",
        language: user.language || "fr",
        nickname: user.nickname || ""

    };
};

const UserProfileForm = ({ onSave, onCancel, isLoading, currentUser, buttonText = "Enregistrer", title = "Profil Utilisateur" }: Props) => {
    const [languageOpen, setLanguageOpen] = useState(false);
    const [indicatifOpen, setIndicatifOpen] = useState(false);

    const defaultFormData = {
        name: currentUser?.name || "",
        firstname: currentUser?.firstname || "",
        birthdate: currentUser?.birthdate || "",
        addressLine1: currentUser?.addressLine1 || "",
        city: currentUser?.city || "",
        state: currentUser?.state || "",
        country: currentUser?.country || "",
        zipCode: currentUser?.zipCode || 0,
        phoneNumber: currentUser?.phoneNumber || 0,
        indicatifTel: currentUser?.indicatifTel || "+41",
        email: currentUser?.email || "",
        language: currentUser?.language || "fr",
        nickname: currentUser?.nickname || ""
    };

    const form = useForm<UserFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultFormData
    });

    useEffect(() => {        
        if (currentUser && currentUser._id) {
            form.reset(mapUserToFormData(currentUser));
        }
    }, [currentUser?._id, form]);

    console.log("🔵 Current user:", currentUser);
    console.log("🔵 Form values:", form.watch());
    console.log("🔵 IndicatifTel value:", form.watch("indicatifTel"));
    console.log("🔵 Language value:", form.watch("language"));

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSave)} className="space-y-4 modern-black-bg rounded-lg md:p-10">
                <div>
                    <h2 className="text-2xl font-bold mb-4 text-app-primary">{title}</h2>                   
                </div>
                <h2 className='font-bold text-app-primary'>Données personnelles</h2>
                <div className='flex space-x-4 md:flex-row flex-col'>
                    <FormField control={form.control} name="email" render={({ field }) => (                    
                        <FormItem className='w-full md:w-1/2'>
                            <FormLabel className="text-app-primary">Email</FormLabel>
                            <FormControl>
                                <Input {...field} disabled className='modern-black-card border-app text-app-primary' />
                            </FormControl>
                    </FormItem>
                )} />
                    <FormField control={form.control} name="nickname" render={({ field }) => (                    
                        <FormItem className='w-full md:w-1/2'>
                            <FormLabel className="text-app-primary">Pseudo</FormLabel>
                            <FormControl>
                                <Input {...field} className='modern-black-card border-app text-app-primary hover:bg-app-surface transition-colors' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                                    
                </div>
                <div className='flex space-x-4 md:flex-row flex-col'>
                    <FormField control={form.control} name="name" render={({ field }) => (                    
                    <FormItem className='w-full md:w-1/2'>
                        <FormLabel className="text-app-primary">Nom</FormLabel>
                        <FormControl>
                            <Input {...field} className='modern-black-card border-app text-app-primary hover:bg-app-surface transition-colors' />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="firstname" render={({ field }) => (                    
                    <FormItem className='w-full md:w-1/2'>
                        <FormLabel className="text-app-primary">Prénom</FormLabel>
                        <FormControl>
                            <Input {...field} className='modern-black-card border-app text-app-primary hover:bg-app-surface transition-colors' />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                </div>                
                <div className='flex space-x-4 md:flex-row flex-col'>
                <FormField control={form.control} name="indicatifTel" render={({ field }) => {
                    const [searchTerm, setSearchTerm] = useState("");
                    
                    // ✅ Filtrer la liste en fonction de la recherche
                    const filteredIndicatifs = indicatifTelList.filter((indicatif) =>
                        indicatif.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        indicatif.value.includes(searchTerm)
                    );

                    return (
                        <FormItem className='w-full md:w-1/3'>
                            <FormLabel className="text-app-primary">Indicatif de téléphone</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full justify-between modern-black-card border-app text-app-primary hover:bg-app-surface transition-colors"
                                        onClick={() => {
                                            console.log("🟢 Manual button clicked!");
                                            console.log("🟢 Before toggle:", indicatifOpen);
                                            setIndicatifOpen(!indicatifOpen);
                                            console.log("🟢 After toggle:", !indicatifOpen);
                                        }}
                                    >
                                        {field.value
                                            ? `${indicatifTelList.find((indicatif) => indicatif.value === field.value)?.label} (${field.value})`
                                            : "Indicatif..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                    
                                    {/* Menu déroulant manuel avec recherche */}
                                    {indicatifOpen && (
                                        <>
                                            {/* ✅ Overlay pour fermer en cliquant à côté */}
                                            <div 
                                                className="fixed inset-0 z-40" 
                                                onClick={() => setIndicatifOpen(false)}
                                            />
                                            <div 
                                                className="absolute top-full left-0 right-0 dropdown-menu animate-fade-in max-h-60 overflow-hidden"
                                                style={{ zIndex: 9999 }}
                                            >
                                                <div className="p-2">
                                                    <Input
                                                        placeholder="Rechercher un pays..."
                                                        className="mb-2 modern-black-card border-app text-app-primary"
                                                        value={searchTerm}
                                                        onChange={(e) => {
                                                            console.log("🟢 Search term:", e.target.value);
                                                            setSearchTerm(e.target.value);
                                                        }}
                                                        onClick={(e) => e.stopPropagation()} // ✅ Empêcher la fermeture du menu
                                                    />
                                                </div>
                                                <div className="max-h-48 overflow-auto">
                                                    {filteredIndicatifs.length === 0 ? (
                                                        <div className="px-4 py-2 text-app-tertiary text-center">
                                                            Aucun pays trouvé
                                                        </div>
                                                    ) : (
                                                        filteredIndicatifs.map((indicatif) => (
                                                            <div
                                                                key={indicatif.value}
                                                                className="flex items-center px-2 py-2 hover:bg-app-surface cursor-pointer text-app-primary select-item-enhanced"
                                                                onClick={() => {
                                                                    console.log("🟢 Manual selected:", indicatif.value);
                                                                    field.onChange(indicatif.value);
                                                                    setIndicatifOpen(false);
                                                                    setSearchTerm(""); // ✅ Reset search term
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        field.value === indicatif.value ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                {indicatif.label} ({indicatif.value})
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    );
                }} />
                <FormField control={form.control} name="phoneNumber" render={({ field }) => (                    
                    <FormItem className='w-full md:w-1/2'>
                        <FormLabel className="text-app-primary">Numéro de téléphone</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="number"
                                value={field.value ?? ""}
                                onChange={e => field.onChange(e.target.value === "" ? undefined : +e.target.value)}
                                className='modern-black-card border-app text-app-primary hover:bg-app-surface transition-colors'
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                </div>                                
                <FormField control={form.control} name="birthdate" render={({ field }) => (                    
                    <FormItem className='w-full md:w-1/2'>
                        <FormLabel className="text-app-primary">Date de naissance</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="date"
                                className='modern-black-card border-app text-app-primary hover:bg-app-surface transition-colors'
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="language" render={({ field }) => {
                    const [languageSearchTerm, setLanguageSearchTerm] = useState("");                                        
                    const filteredLanguages = languages.filter((language) =>
                        language.label.toLowerCase().includes(languageSearchTerm.toLowerCase()) ||
                        language.value.toLowerCase().includes(languageSearchTerm.toLowerCase())
                    );
                
                    return (
                        <FormItem className='w-full md:w-1/2'>
                            <FormLabel className="text-app-primary">Langue de communication</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full justify-between modern-black-card border-app text-app-primary hover:bg-app-surface transition-colors"
                                        onClick={() => {
                                            console.log("🟢 Language manual button clicked!");
                                            setLanguageOpen(!languageOpen);
                                        }}
                                    >
                                        {field.value
                                            ? languages.find((language) => language.value === field.value)?.label
                                            : "Sélectionner une langue"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                    
                                    {/* Menu déroulant manuel pour les langues */}
                                    {languageOpen && (
                                        <>
                                            {/* Overlay pour fermer */}
                                            <div 
                                                className="fixed inset-0 z-40" 
                                                onClick={() => setLanguageOpen(false)}
                                            />
                                            <div 
                                                className="absolute top-full left-0 right-0 dropdown-menu animate-fade-in max-h-60 overflow-hidden"
                                                style={{ zIndex: 9999 }}
                                            >
                                                <div className="p-2">
                                                    <Input
                                                        placeholder="Rechercher une langue..."
                                                        className="mb-2 modern-black-card border-app text-app-primary"
                                                        value={languageSearchTerm}
                                                        onChange={(e) => {
                                                            console.log("🟢 Language search:", e.target.value);
                                                            setLanguageSearchTerm(e.target.value);
                                                        }}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </div>
                                                <div className="max-h-48 overflow-auto">
                                                    {filteredLanguages.length === 0 ? (
                                                        <div className="px-4 py-2 text-app-tertiary text-center">
                                                            Aucune langue trouvée
                                                        </div>
                                                    ) : (
                                                        filteredLanguages.map((language) => (
                                                            <div
                                                                key={language.value}
                                                                className="flex items-center px-2 py-2 hover:bg-app-surface cursor-pointer text-app-primary select-item-enhanced"
                                                                onClick={() => {
                                                                    console.log("🟢 Language selected:", language.value);
                                                                    field.onChange(language.value);
                                                                    setLanguageOpen(false);
                                                                    setLanguageSearchTerm(""); // Reset search
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        field.value === language.value ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                {language.label}
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    );
                }} />
                <h2 className='font-bold text-app-primary'>Adresse</h2>
                <FormField control={form.control} name="addressLine1" render={({ field }) => (                    
                    <FormItem className='flex-1'>
                        <FormLabel className="text-app-primary">Rue et numéro</FormLabel>
                        <FormControl>
                            <Input {...field} className='modern-black-card border-app text-app-primary hover:bg-app-surface transition-colors' />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )} />            
                <div className='flex space-x-4 md:flex-row flex-col'>
                <FormField control={form.control} name="zipCode" render={({ field }) => (                    
                    <FormItem className=''>
                        <FormLabel className="text-app-primary">Code postal</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="number"
                                value={field.value ?? ""}
                                onChange={e => field.onChange(e.target.value === "" ? undefined : +e.target.value)}
                                className='modern-black-card border-app text-app-primary hover:bg-app-surface transition-colors'
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="city" render={({ field }) => (                    
                    <FormItem className='w-full md:w-1/2'>
                        <FormLabel className="text-app-primary">Ville</FormLabel>
                        <FormControl>
                            <Input {...field} className='modern-black-card border-app text-app-primary hover:bg-app-surface transition-colors' />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />                                
                </div>                
                <div className='flex space-x-4 md:flex-row flex-col'>
                    <FormField control={form.control} name="state" render={({ field }) => (                    
                    <FormItem>
                        <FormLabel className="text-app-primary">Canton</FormLabel>
                        <FormControl>
                            <Input {...field} className='modern-black-card border-app text-app-primary hover:bg-app-surface transition-colors' />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                    <FormField control={form.control} name="country" render={({ field }) => (                    
                    <FormItem className='w-full md:w-1/2'>
                        <FormLabel className="text-app-primary">Pays</FormLabel>
                        <FormControl>
                            <Input {...field} className='modern-black-card border-app text-app-primary hover:bg-app-surface transition-colors' />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />                
                </div>                
                <div className="flex space-x-4 pt-4">
                    {isLoading ? (
                        <LoadingButton />
                    ) : (
                        <>
                            {onCancel && (
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={onCancel}
                                    className="border-app hover:bg-app-muted hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    Annuler
                                </Button>
                            )}
                            <Button type="submit" className='search-button'>
                                {buttonText}
                            </Button>                            
                        </>
                    )}
                </div>
            </form>
        </Form>
    );

};

export default UserProfileForm;