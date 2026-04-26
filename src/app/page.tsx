import { Hero } from "@/components/sections/Hero";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { BrandStory } from "@/components/sections/BrandStory";
import { FragranceNotes } from "@/components/sections/FragranceNotes";
import { Quiz } from "@/components/sections/Quiz";
import ReviewSection from "@/components/sections/ReviewSection";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <BrandStory />
      <FragranceNotes />
      <Quiz />
      <ReviewSection />
    </>
  );
}
