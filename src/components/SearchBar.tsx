import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Search, X } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useEffect } from "react";

const formSchema = z.object({
    searchQuery: z.string().trim(), // Supprime la contrainte min(1) pour permettre les recherches vides
});

export type SearchForm = z.infer<typeof formSchema>;

type Props = {
    onSubmit: (formData: SearchForm) => void;
    placeholder?: string;
    onReset?: () => void;
    searchQuery?: string;
};

/**
 * COMPOSANT BARRE DE RECHERCHE SIMPLE
 * 
 * Recherche unifiée par nom, description, catégorie, ou ID d'article.
 * Interface optimisée avec validation flexible et gestion d'état simplifiée.
 */
const SearchBar = ({ onSubmit, placeholder = "Rechercher par nom, description, catégorie ou ID", onReset, searchQuery }: Props) => {
    const form = useForm<SearchForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            searchQuery: searchQuery || "",
        },
    });

    // Synchronise la valeur externe avec le formulaire
    useEffect(() => {
        if (searchQuery !== form.getValues("searchQuery")) {
            form.reset({ searchQuery: searchQuery || "" });
        }
    }, [form, searchQuery]);

    const handleReset = () => {
        form.reset({ searchQuery: "" });
        if (onReset) {
            onReset();
        }
    };

    const currentSearchQuery = form.watch("searchQuery");
    const hasSearchQuery = currentSearchQuery && currentSearchQuery.trim().length > 0;

    return (
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)} 
                className={`flex items-center gap-3 justify-between flex-row border-2 rounded-full p-3 bg-app-background shadow-sm hover:shadow-md transition-shadow ${form.formState.errors.searchQuery ? "border-red-500" : "border-gray-200 hover:border-accent dark:border-accent dark:hover:border-accent"}`}
            >
                <Search strokeWidth={2.5} size={24} className="ml-1 text-accent flex-shrink-0" />               
                <FormField
                    control={form.control}
                    name="searchQuery"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormControl>
                                <Input
                                    placeholder={placeholder}
                                    {...field}
                                    className="border-none shadow-none text-lg focus-visible:ring-0 bg-transparent text-app-primary placeholder:text-app-secondary"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                
                {hasSearchQuery && (
                    <Button 
                        variant="ghost" 
                        size="sm"
                        className="rounded-full p-2 h-8 w-8 hover:bg-app-surface-elevated text-app-secondary hover:text-app-primary reset-button" 
                        type="button" 
                        onClick={handleReset}
                    >
                        <X size={16} />
                    </Button>
                )}
                
                <Button 
                    type="submit" 
                    className="rounded-full search-button px-6 py-2 font-medium transition-colors"
                >
                    Rechercher
                </Button>
            </form>
        </Form>
    );
};

export default SearchBar;