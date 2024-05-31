import { Product } from "@/db";
import Image from "next/image";
import { Card } from "../ui/card";

const ProductItem = ({ product }: { product: Product }) => {
  return (
    <Card className="group p-4 relative">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md lg:aspect-none group-hover:opacity-75 lg:h-80">
        <Image
          src={product.imageId}
          alt="product image"
          className="h-full w-full object-cover object-center"
          height={400}
          width={400}
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm ">{product.name}</h3>
          <p className="mt-1 text-xs text-gray-400">
            Size {product.size.toUpperCase()}, {product.color}
          </p>
        </div>

        <p className="text-sm font-medium ">${product.price}</p>
      </div>
    </Card>
  );
};

export default ProductItem;
