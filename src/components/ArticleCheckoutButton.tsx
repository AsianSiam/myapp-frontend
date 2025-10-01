import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User, AlertCircle } from 'lucide-react';

type Props = {
    children: React.ReactNode;
    disabled?: boolean;
};

const ArticleCheckoutButton = ({ children, disabled }: Props) => {
    const { isAuthenticated, loginWithRedirect } = useAuth0();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleCheckout = () => {
        if (isAuthenticated) {
            window.location.href = '/checkout';
        } else {
            setIsDialogOpen(true);
        }
    };

    return (
        <>
            <div onClick={handleCheckout} style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}>
                {children}
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 rounded-full">
                                <AlertCircle className="h-6 w-6 text-amber-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl text-amber-800">Connexion requise</DialogTitle>
                                <DialogDescription className="text-amber-700">
                                    Vous devez être connecté pour procéder au paiement
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        <div className="border border-amber-200 bg-amber-50 rounded-lg p-4 flex items-start gap-3">
                            <User className="h-4 w-4 text-amber-600 mt-0.5" />
                            <p className="text-amber-700 text-sm">
                                La connexion vous permet de suivre vos commandes et de sauvegarder vos informations de livraison.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button 
                                onClick={() => loginWithRedirect()}
                                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                            >
                                Se connecter
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={() => setIsDialogOpen(false)}
                                className="flex-1"
                            >
                                Annuler
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ArticleCheckoutButton;
