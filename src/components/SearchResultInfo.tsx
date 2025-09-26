type Props = {
    total: number;
    category: string;
    articleShopId: string;
}

const SearchResultInfo = ({ total }: Props) => {
    return (
        <div className="text-xl font-bold text-app-primary flex flex-col gap-3 justify-between lg:flex-row">
            <span>
                {total} produits 
            </span>
        </div>
    );
}

export default SearchResultInfo;