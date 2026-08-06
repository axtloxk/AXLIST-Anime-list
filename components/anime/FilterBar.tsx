"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpDown, ChevronDown, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type AnimeType = "all" | "tv" | "movie";
type SortOption = "popular" | "newest";

const TYPE_LABELS: Record<AnimeType, string> = {
  all: "All",
  tv: "TV Series",
  movie: "Movies",
};

const SORT_LABELS: Record<SortOption, string> = {
  popular: "Most Popular",
  newest: "Newest Anime",
};

interface FilterBarProps {
  onTypeChange?: (type: AnimeType) => void;
  onSortChange?: (sort: SortOption) => void;
}

const FilterBar = ({ onTypeChange, onSortChange }: FilterBarProps) => {
  const [type, setType] = useState<AnimeType>("all");
  const [sort, setSort] = useState<SortOption>("popular");

  // Track the open state for each dropdown menu
  const [typeOpen, setTypeOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const handleTypeChange = (value: string) => {
    const next = value as AnimeType;
    setType(next);
    onTypeChange?.(next);
    setTypeOpen(false); // Closes the Type dropdown
  };

  const handleSortChange = (value: string) => {
    const next = value as SortOption;
    setSort(next);
    onSortChange?.(next);
    setSortOpen(false); // Closes the Sort dropdown
  };

  return (
    <motion.div
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center justify-end gap-3"
    >
      {/* Type Dropdown */}
      <DropdownMenu open={typeOpen} onOpenChange={setTypeOpen}>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              className="gap-2 cursor-pointer border-border/60 bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <ListFilter className="h-4 w-4 text-muted-foreground" />
              {TYPE_LABELS[type]}
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          }
        />
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={type}
              onValueChange={handleTypeChange}
            >
              <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="tv">
                TV Series
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="movie">
                Movies
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Sort Dropdown */}
      <DropdownMenu open={sortOpen} onOpenChange={setSortOpen}>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              className="gap-2 cursor-pointer border-border/60 bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              {SORT_LABELS[sort]}
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          }
        />
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={sort}
              onValueChange={handleSortChange}
            >
              <DropdownMenuRadioItem value="popular">
                Most Popular
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="newest">
                Newest Anime
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
};

export default FilterBar;
