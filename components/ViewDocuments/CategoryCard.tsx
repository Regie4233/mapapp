
const CategoryCard = ({ category, onClick }: { category: string, onClick: () => void}) => {
    return (
        <section onClick={onClick} className="w-full p-4 text-lg rounded-xl font-semibold cursor-pointer bg-[#F5F7F8]">
            <h2>{category}</h2>
        </section>
    );
};

export default CategoryCard;