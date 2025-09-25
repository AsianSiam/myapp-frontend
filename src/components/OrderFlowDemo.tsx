import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, CreditCard, Package, ShoppingCart, Zap } from "lucide-react";

/**
 * Composant de démonstration du flux complet de commande
 * Montre le processus d'automatisation des webhooks
 */
const OrderFlowDemo = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [testData, setTestData] = useState<any>(null);

    const steps = [
        {
            id: 1,
            title: "Création de la commande",
            description: "Utilisateur sélectionne des articles et procède au checkout",
            icon: ShoppingCart,
            color: "text-blue-600",
            details: "Status: 'placed' - En attente de paiement"
        },
        {
            id: 2,
            title: "Session Stripe créée",
            description: "Redirection vers Stripe pour le paiement sécurisé",
            icon: CreditCard,
            color: "text-purple-600",
            details: "URL de paiement générée avec métadonnées"
        },
        {
            id: 3,
            title: "Paiement confirmé",
            description: "Stripe confirme le paiement et envoie webhook",
            icon: CheckCircle,
            color: "text-green-600",
            details: "Événement 'checkout.session.completed' reçu"
        },
        {
            id: 4,
            title: "Mise à jour automatique",
            description: "OrderService traite le webhook et met à jour la commande",
            icon: Zap,
            color: "text-yellow-600",
            details: "Status: 'placed' → 'paid', stock réduit automatiquement"
        },
        {
            id: 5,
            title: "Processus terminé",
            description: "Commande confirmée, client notifié, stock à jour",
            icon: Package,
            color: "text-green-600",
            details: "Système prêt pour la préparation et livraison"
        }
    ];

    const simulateOrderFlow = async () => {
        setIsRunning(true);
        setCurrentStep(0);
        setTestData({
            orderId: "demo_" + Date.now(),
            startTime: new Date(),
            steps: []
        });

        for (let i = 0; i < steps.length; i++) {
            setCurrentStep(i + 1);
            
            // Simuler le temps de traitement de chaque étape
            const stepTime = i === 2 ? 3000 : 1500; // Paiement prend plus de temps
            await new Promise(resolve => setTimeout(resolve, stepTime));
            
            setTestData((prev: any) => ({
                ...prev,
                steps: [...(prev?.steps || []), {
                    step: i + 1,
                    name: steps[i].title,
                    timestamp: new Date().toLocaleTimeString(),
                    success: true
                }]
            }));
        }

        setIsRunning(false);
    };

    const resetDemo = () => {
        setCurrentStep(0);
        setTestData(null);
        setIsRunning(false);
    };

    const progress = (currentStep / steps.length) * 100;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-blue-600" />
                        Démonstration du Flux de Commande Automatisé
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                        Simulation du processus complet de commande avec webhooks Stripe automatiques
                    </p>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <Button 
                            onClick={simulateOrderFlow}
                            disabled={isRunning}
                            className="flex items-center gap-2"
                        >
                            {isRunning ? (
                                <>
                                    <Clock className="h-4 w-4 animate-pulse" />
                                    Simulation en cours...
                                </>
                            ) : (
                                <>
                                    <Zap className="h-4 w-4" />
                                    Démarrer la simulation
                                </>
                            )}
                        </Button>

                        {testData && !isRunning && (
                            <Button 
                                variant="outline"
                                onClick={resetDemo}
                                className="flex items-center gap-2"
                            >
                                Recommencer
                            </Button>
                        )}
                    </div>

                    {/* Barre de progression */}
                    {(isRunning || testData) && (
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span>Progression</span>
                                <span>{currentStep}/{steps.length} étapes</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                        </div>
                    )}

                    {/* Étapes du processus */}
                    <div className="space-y-4">
                        {steps.map((step) => {
                            const StepIcon = step.icon;
                            const isActive = currentStep >= step.id;
                            const isCurrent = currentStep === step.id && isRunning;
                            
                            return (
                                <div 
                                    key={step.id}
                                    className={`flex items-start gap-4 p-4 rounded-lg border transition-all ${
                                        isActive 
                                            ? "border-green-200 bg-green-50" 
                                            : "border-gray-200 bg-gray-50"
                                    } ${isCurrent ? "ring-2 ring-blue-300 ring-opacity-50" : ""}`}
                                >
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                                        isActive 
                                            ? "bg-green-100 text-green-600" 
                                            : "bg-gray-100 text-gray-400"
                                    }`}>
                                        {isCurrent ? (
                                            <Clock className="h-5 w-5 animate-pulse" />
                                        ) : isActive ? (
                                            <CheckCircle className="h-5 w-5" />
                                        ) : (
                                            <StepIcon className="h-5 w-5" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h4 className={`font-medium ${isActive ? "text-green-900" : "text-gray-700"}`}>
                                            {step.title}
                                        </h4>
                                        <p className={`text-sm mt-1 ${isActive ? "text-green-700" : "text-gray-500"}`}>
                                            {step.description}
                                        </p>
                                        <p className={`text-xs mt-2 font-mono ${isActive ? "text-green-600" : "text-gray-400"}`}>
                                            {step.details}
                                        </p>

                                        {testData?.steps?.find((s: any) => s.step === step.id) && (
                                            <Badge variant="outline" className="mt-2 text-xs bg-green-100 text-green-700 border-green-200">
                                                ✓ Terminé à {testData.steps.find((s: any) => s.step === step.id)?.timestamp}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Résultats */}
                    {testData && !isRunning && (
                        <Alert className="border-green-200 bg-green-50">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-800">
                                <strong>Simulation terminée avec succès !</strong>
                                <br />
                                Commande {testData.orderId} traitée automatiquement en{" "}
                                {Math.round((new Date().getTime() - testData.startTime.getTime()) / 1000)} secondes.
                                <br />
                                <span className="text-sm text-green-600">
                                    Dans un scénario réel, le webhook Stripe déclencherait automatiquement la mise à jour du statut.
                                </span>
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Informations techniques */}
                    <Alert className="border-blue-200 bg-blue-50">
                        <AlertDescription className="text-blue-800">
                            <strong>Points clés de l'optimisation :</strong>
                            <ul className="mt-2 space-y-1 text-sm list-disc list-inside">
                                <li><strong>OrderService centralisé</strong> - Élimine la duplication de code</li>
                                <li><strong>Webhook sécurisé</strong> - Vérification de signature Stripe</li>
                                <li><strong>Mise à jour automatique</strong> - Status et stock mis à jour sans intervention</li>
                                <li><strong>Gestion d'erreurs robuste</strong> - Logging détaillé et fallbacks</li>
                                <li><strong>Interface administrative</strong> - Suivi en temps réel des commandes</li>
                            </ul>
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </div>
    );
};

export default OrderFlowDemo;