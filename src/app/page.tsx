"use client";

import { FC } from "react";
import { FlipWords } from "@/components/ui/flip-words";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const words = ["Next.js", "Tailwind", "React Query", "Schema Validation"];

  return (
    <div className=" min-h-screen h-full flex-col w-full bg-black bg-dot-white/[0.2] relative flex items-center justify-center">
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className=" z-20 flex flex-col justify-center items-center mb-10 space-y-10">
        <p className="text-4xl sm:text-7xl font-bold relative bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
          Super Filter
        </p>

        <div className="text-2xl text-center font-normal text-neutral-600 dark:text-neutral-400">
          Full-Stack Filtering System with <br />
          <FlipWords words={words} />
        </div>
      </div>
      <Link href={`/browse`}>
        <Button size={"lg"}>Browse Catalog</Button>
      </Link>
    </div>
  );
};

export default page;
