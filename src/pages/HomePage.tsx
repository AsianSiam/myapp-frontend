import landingImage from "../assets/landing.png";
import appDownloadImage from "../assets/appDownload.png";
import SearchBar, { type SearchForm } from "@/components/SearchBar";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();

    const handleSearchSubmit = (searchFormValues: SearchForm) => {
        // Redirection vers ShopPage avec paramètre de recherche
        navigate({
            pathname: '/shop',
            search: `?q=${encodeURIComponent(searchFormValues.searchQuery)}`
        });
    };

    return (
        <div className="app-container py-8 modern-black-bg">
            <div className="flex flex-col gap-16">
                <div className="modern-black-card py-16 px-8 flex flex-col gap-8 text-center animate-fade-in">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                        Découvrez notre boutique
                    </h1>
                    <p className="text-xl text-app-secondary max-w-2xl mx-auto">
                        Vos produits préférés à portée de clic ! Explorez notre sélection unique et trouvez exactement ce que vous cherchez.
                    </p>
                    <div className="max-w-2xl mx-auto w-full mt-4">
                        <SearchBar 
                            placeholder="Rechercher par nom, description, catégorie ou ID" 
                            onSubmit={handleSearchSubmit} 
                        />
                    </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="modern-black-card p-2 overflow-hidden animate-slide-up">
                        <img 
                            src={landingImage} 
                            alt="Découvrez nos produits" 
                            className="w-full h-auto object-cover rounded-lg" 
                        />
                    </div>
                    
                    <div className="flex flex-col items-center justify-center gap-8 text-center modern-black-card p-8 animate-slide-up">
                        <h2 className="font-bold text-3xl tracking-tight text-app-primary">
                            Commandez encore plus facilement !
                        </h2>
                        <p className="max-w-xl text-lg text-app-secondary">
                            Téléchargez notre application mobile pour une expérience d'achat optimisée
                        </p>   
                        <div className="modern-black-surface p-2 max-w-sm rounded-lg border border-app">
                            <img 
                                src={appDownloadImage} 
                                alt="Télécharger l'application" 
                                className="w-full h-auto rounded-lg" 
                            />   
                        </div>          
                    </div>            
                </div>
            </div>
        </div>     
    )
}

export default HomePage;