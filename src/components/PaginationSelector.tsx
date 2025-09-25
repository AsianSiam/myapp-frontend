import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext, PaginationEllipsis } from "./ui/pagination";

type Props = {
    page: number;
    pages: number;
    onPageChange: (page: number) => void;
};

const PaginationSelector = ({ page, pages, onPageChange }: Props) => {
    // Gérer le cas où il n'y a qu'une seule page
    if (pages <= 1) return null;

    const handlePageClick = (pageNumber: number, event: React.MouseEvent) => {
        event.preventDefault();
        onPageChange(pageNumber);
    };

    const handlePrevious = (event: React.MouseEvent) => {
        event.preventDefault();
        if (page > 1) {
            onPageChange(page - 1);
        }
    };

    const handleNext = (event: React.MouseEvent) => {
        event.preventDefault();
        if (page < pages) {
            onPageChange(page + 1);
        }
    };

    // Logique pour afficher les numéros de page avec ellipses
    const getVisiblePages = () => {
        const delta = 2; // Nombre de pages à afficher de chaque côté de la page courante
        const range = [];
        const rangeWithDots = [];

        // Toujours inclure la première page
        range.push(1);

        // Ajouter les pages autour de la page courante
        for (let i = Math.max(2, page - delta); i <= Math.min(pages - 1, page + delta); i++) {
            range.push(i);
        }

        // Toujours inclure la dernière page (si elle existe et n'est pas déjà incluse)
        if (pages > 1) {
            range.push(pages);
        }

        // Supprimer les doublons et trier
        const uniqueRange = [...new Set(range)].sort((a, b) => a - b);

        // Ajouter les ellipses si nécessaire
        let prev = 0;
        for (const current of uniqueRange) {
            if (current - prev === 2) {
                rangeWithDots.push(prev + 1);
            } else if (current - prev !== 1) {
                rangeWithDots.push('ellipsis');
            }
            rangeWithDots.push(current);
            prev = current;
        }

        return rangeWithDots;
    };

    const visiblePages = getVisiblePages();

    return (
        <Pagination>
            <PaginationContent>
                {/* Bouton Précédent */}
                {page > 1 && (
                    <PaginationItem>
                        <PaginationPrevious 
                            href="#" 
                            onClick={handlePrevious}
                            className="cursor-pointer"
                        />
                    </PaginationItem>
                )}

                {/* Pages avec ellipses */}
                {visiblePages.map((pageNumber, index) => (
                    <PaginationItem key={index}>
                        {pageNumber === 'ellipsis' ? (
                            <PaginationEllipsis />
                        ) : (
                            <PaginationLink 
                                href="#" 
                                onClick={(e) => handlePageClick(pageNumber as number, e)}
                                isActive={page === pageNumber}
                                className="cursor-pointer"
                            >
                                {pageNumber}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}

                {/* Bouton Suivant */}
                {page < pages && (
                    <PaginationItem>
                        <PaginationNext 
                            href="#" 
                            onClick={handleNext}
                            className="cursor-pointer"
                        />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
};

export default PaginationSelector;