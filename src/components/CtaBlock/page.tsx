"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CtaBlock() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/products");
  };

  return (
    <section className="text-center py-20 bg-gray-900">
      <h3 className="text-4xl font-bold mb-6 text-white">Start Your 3D Journey Today</h3>
      <p className="text-white mb-8">Browse thousands of assets and bring your vision to life.</p>
      <Button className="text-sm" variant="secondary" onClick={handleClick}>
        Get Started
      </Button>
    </section>
  );
}
