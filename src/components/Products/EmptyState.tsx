import { ShoppingBasket } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="relative col-span-full h-80 bg-accent rounded-2xl w-full p-12 flex flex-col items-center justify-center">
      <ShoppingBasket className=" h-10 w-10 mb-4 " />
      <h3 className="font-semibold text-xl">No products found</h3>
      <p className="text-zinc-300 text-sm">
        We found no search results for these filters.
      </p>
    </div>
  );
};

export default EmptyState;
