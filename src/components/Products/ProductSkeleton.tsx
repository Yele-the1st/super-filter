import { Card } from "../ui/card";

const ProductSkeleton = () => {
  return (
    <Card className="relative animate-pulse p-4">
      <div className="aspect-square w-full overflow-hidden rounded-md bg-accent lg:aspect-none lg:h-80">
        <div className="h-full w-full bg-accent" />
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <div className=" bg-accent rounded-md h-4 w-full" />
        <div className="bg-accent rounded-md h-4 w-full" />
      </div>
    </Card>
  );
};

export default ProductSkeleton;
