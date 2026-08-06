import React from "react";
import FilterBar from "./FilterBar";
import { Separator } from "../ui/separator";

const AnimeGrid = () => {
  return (
    <section className="mx-auto w-full  flex  flex-col max-w-7xl px-6">
      {/* Small top margin so the filter bar breathes below the sticky navbar */}
      <div className="mt-6 w-full">
        <FilterBar />
      </div>
      <Separator className="mt-3" />

      {/* Anime cards will map in here */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {/* <AnimeCard /> */}
      </div>
    </section>
  );
};

export default AnimeGrid;
