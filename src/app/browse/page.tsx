"use client";

import EmptyState from "@/components/Products/EmptyState";
import ProductItem from "@/components/Products/Product";
import Product from "@/components/Products/Product";
import ProductSkeleton from "@/components/Products/ProductSkeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import type { Product as TProduct } from "@/db";
import { cn } from "@/lib/utils";
import { ProductState } from "@/lib/validators/product-validator";
import { useQuery } from "@tanstack/react-query";
import { QueryResult } from "@upstash/vector";
import axios from "axios";
import debounce from "lodash.debounce";
import { ArrowLeft, ChevronDown, Filter } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";

const SORT_OPTIONS = [
  { name: "None", value: "none" },
  { name: "Price: Low to High", value: "price-asc" },
  { name: "Price: High to Low", value: "price-desc" },
] as const;

const COLOR_FILTERS = {
  id: "color",
  name: "Color",
  options: [
    { value: "white", label: "White" },
    { value: "beige", label: "Beige" },
    { value: "blue", label: "Blue" },
    { value: "green", label: "Green" },
    { value: "purple", label: "Purple" },
  ] as const,
};

const SIZE_FILTERS = {
  id: "size",
  name: "Size",
  options: [
    { value: "S", label: "S" },
    { value: "M", label: "M" },
    { value: "L", label: "L" },
  ],
} as const;

const PRICE_FILTERS = {
  id: "price",
  name: "Price",
  options: [
    { value: [0, 100], label: "Any price" },
    {
      value: [0, 20],
      label: "Under 20€",
    },
    {
      value: [0, 40],
      label: "Under 40€",
    },
    // custom option defined in JSX
  ],
} as const;

const SUBCATEGORIES = [
  { name: "T-Shirts", selected: true, href: "#" },
  { name: "Hoodies", selected: false, href: "#" },
  { name: "Sweatshirts", selected: false, href: "#" },
  { name: "Accessories", selected: false, href: "#" },
];

const DEFAULT_CUSTOM_PRICE = [0, 100] as [number, number];

export default function Home() {
  const [filter, setFilter] = useState<ProductState>({
    color: ["beige", "blue", "green", "purple", "white"],
    price: { isCustom: false, range: DEFAULT_CUSTOM_PRICE },
    size: ["L", "M", "S"],
    sort: "none",
  });

  const { data: products, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await axios.post<QueryResult<TProduct>[]>(
        "https://super-filter.vercel.app/api/products",
        {
          filter: {
            sort: filter.sort,
            color: filter.color,
            price: filter.price.range,
            size: filter.size,
          },
        }
      );

      return data;
    },
  });

  const onSubmit = () => refetch();

  const debouncedSubmit = debounce(onSubmit, 400);
  const _debouncedSubmit = useCallback(debouncedSubmit, [debouncedSubmit]);

  const applyArrayFilter = ({
    category,
    value,
  }: {
    category: keyof Omit<typeof filter, "price" | "sort">;
    value: string;
  }) => {
    const isFilterApplied = filter[category].includes(value as never);

    if (isFilterApplied) {
      setFilter((prev) => ({
        ...prev,
        [category]: prev[category].filter((v) => v !== value),
      }));
    } else {
      setFilter((prev) => ({
        ...prev,
        [category]: [...prev[category], value],
      }));
    }

    _debouncedSubmit();
  };

  const minPrice = Math.min(filter.price.range[0], filter.price.range[1]);
  const maxPrice = Math.max(filter.price.range[0], filter.price.range[1]);

  return (
    <div className=" min-h-screen h-full flex-col w-full bg-black bg-dot-white/[0.2] relative ">
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between border-b border-gray-100 pb-6 pt-24">
          <div className="z-10 flex items-center gap-4">
            <Link className="" href={`/`}>
              <Button className=" " size={"sm"}>
                <ArrowLeft />
              </Button>
            </Link>
            <h1 className="text-4xl font-bold tracking-tight ">
              High-quality cotton selection
            </h1>
          </div>

          <div className="flex items-center z-10">
            <DropdownMenu>
              <DropdownMenuTrigger className="group inline-flex justify-center text-sm font-medium ">
                Sort
                <ChevronDown className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 opacity-90 group-hover:opacity-100" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.name}
                    className={cn(
                      "text-left w-full rounded-2xl block px-4 py-2 text-sm",
                      {
                        " bg-primary": option.value === filter.sort,
                        " text-gray-300 ": option.value !== filter.sort,
                      }
                    )}
                    onClick={() => {
                      setFilter((prev) => ({
                        ...prev,
                        sort: option.value,
                      }));

                      _debouncedSubmit();
                    }}
                  >
                    {option.name}
                  </button>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <button className="-m-2 ml-4 p-2 sm:ml-6 lg:hidden">
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>

        <section className="pb-24 pt-6">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            {/* Filters */}
            <div className="hidden z-10 lg:block">
              <ul className="space-y-4 pb-6 text-sm font-medium ">
                {SUBCATEGORIES.map((category) => (
                  <li className="" key={category.name}>
                    <button
                      disabled={!category.selected}
                      className="disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>

              <Accordion type="multiple" className="animate-none">
                {/* Color filter */}
                <AccordionItem value="color">
                  <AccordionTrigger className="py-3 text-sm ">
                    <span className="font-medium ">Color</span>
                  </AccordionTrigger>

                  <AccordionContent className="pt-6 animate-none">
                    <ul className="space-y-4">
                      {COLOR_FILTERS.options.map((option, optionIdx) => (
                        <li key={option.value} className="flex items-center">
                          <Checkbox
                            id={`color-${optionIdx}`}
                            onCheckedChange={() => {
                              applyArrayFilter({
                                category: "color",
                                value: option.value,
                              });
                            }}
                            checked={filter.color.includes(option.value)}
                          />
                          <label
                            htmlFor={`color-${optionIdx}`}
                            className="ml-3 text-sm text-gray-300"
                          >
                            {option.label}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                {/* Size filters */}
                <AccordionItem value="size">
                  <AccordionTrigger className="py-3 text-sm ">
                    <span className="font-medium ">Size</span>
                  </AccordionTrigger>

                  <AccordionContent className="pt-6 animate-none">
                    <ul className="space-y-4">
                      {SIZE_FILTERS.options.map((option, optionIdx) => (
                        <li key={option.value} className="flex items-center">
                          <Checkbox
                            id={`size-${optionIdx}`}
                            onCheckedChange={() => {
                              applyArrayFilter({
                                category: "size",
                                value: option.value,
                              });
                            }}
                            checked={filter.size.includes(option.value)}
                          />
                          <label
                            htmlFor={`size-${optionIdx}`}
                            className="ml-3 text-sm text-gray-300"
                          >
                            {option.label}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                {/* Price filter */}
                <AccordionItem value="price">
                  <AccordionTrigger className="py-3 text-sm ">
                    <span className="font-medium">Price</span>
                  </AccordionTrigger>

                  <AccordionContent className="pt-6 animate-none">
                    <RadioGroup
                      className="space-y-4"
                      value={
                        filter.price.isCustom
                          ? "custom"
                          : `${filter.price.range[0]}-${filter.price.range[1]}`
                      }
                      onValueChange={(value) => {
                        if (value === "custom") {
                          setFilter((prev) => ({
                            ...prev,
                            price: {
                              isCustom: true,
                              range: [0, 100],
                            },
                          }));
                        } else {
                          const [min, max] = value.split("-").map(Number);
                          setFilter((prev) => ({
                            ...prev,
                            price: {
                              isCustom: false,
                              range: [min, max],
                            },
                          }));
                        }

                        _debouncedSubmit();
                      }}
                    >
                      {PRICE_FILTERS.options.map((option, optionIdx) => (
                        <div key={option.label} className="flex items-center">
                          <RadioGroupItem
                            id={`price-${optionIdx}`}
                            value={`${option.value[0]}-${option.value[1]}`}
                          />
                          <label
                            htmlFor={`price-${optionIdx}`}
                            className="ml-3 text-sm text-gray-300"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                      <div className="flex justify-center flex-col gap-2">
                        <div className="flex items-center">
                          <RadioGroupItem
                            id={`price-${PRICE_FILTERS.options.length}`}
                            value="custom"
                          />
                          <label
                            htmlFor={`price-${PRICE_FILTERS.options.length}`}
                            className="ml-3 text-sm text-gray-300"
                          >
                            Custom
                          </label>
                        </div>

                        <div className="flex mb-2 mt-4 justify-between">
                          <p className="font-medium">Price</p>
                          <div>
                            {filter.price.isCustom
                              ? minPrice.toFixed(0)
                              : filter.price.range[0].toFixed(0)}{" "}
                            € -{" "}
                            {filter.price.isCustom
                              ? maxPrice.toFixed(0)
                              : filter.price.range[1].toFixed(0)}{" "}
                            €
                          </div>
                        </div>

                        <Slider
                          className={cn({
                            "opacity-50": !filter.price.isCustom,
                          })}
                          disabled={!filter.price.isCustom}
                          onValueChange={(range) => {
                            const [newMin, newMax] = range;

                            setFilter((prev) => ({
                              ...prev,
                              price: {
                                isCustom: true,
                                range: [newMin, newMax],
                              },
                            }));

                            _debouncedSubmit();
                          }}
                          value={
                            filter.price.isCustom
                              ? filter.price.range
                              : DEFAULT_CUSTOM_PRICE
                          }
                          min={DEFAULT_CUSTOM_PRICE[0]}
                          defaultValue={DEFAULT_CUSTOM_PRICE}
                          max={DEFAULT_CUSTOM_PRICE[1]}
                          step={5}
                        />
                      </div>
                    </RadioGroup>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Product grid */}
            <ul className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {products && products.length === 0 ? (
                <EmptyState />
              ) : products ? (
                products.map((product, index) => (
                  <ProductItem key={index} product={product.metadata!} />
                ))
              ) : (
                new Array(12)
                  .fill(null)
                  .map((_, i) => <ProductSkeleton key={i} />)
              )}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
