import { useState } from "react";
import { useFoodSearch } from "@/features/nutrition/useFoodSearch";
import type { FoodResult } from "@/services/foodService";

type FoodNameInputProps = {
    value: string;
    onChange: (value: string) => void;
    onBlur: () => void;
    onPick: (food: FoodResult) => void;
    className: string;
};

export default function FoodNameInput({ value, onChange, onBlur, onPick, className }: FoodNameInputProps) {
    const [open, setOpen] = useState(false);

    const { foods, isLoading, isError, searched } = useFoodSearch(open ? value : "");

    return (
        <div className="relative">
            <input
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                    setOpen(true);
                }}
                onBlur={() => {
                    onBlur();
                    setOpen(false);
                }}
                placeholder="Search food, e.g. egg"
                autoComplete="off"
                className={className}
            />

            {open && searched && (
                <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-sm border border-white/15 bg-neutral-950 shadow-lg">
                    {isLoading && <li className="px-3 py-2 text-xs text-white/50">Searching...</li>}

                    {isError && (
                        <li className="px-3 py-2 text-xs text-red-300">
                            Search unavailable. You can type the values manually.
                        </li>
                    )}

                    {!isLoading && !isError && foods.length === 0 && (
                        <li className="px-3 py-2 text-xs text-white/50">
                            No match. You can type the values manually.
                        </li>
                    )}

                    {foods.map((food) => (
                        <li key={food.fdcId}>
                            <button
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    onPick(food);
                                    setOpen(false);
                                }}
                                className="block w-full cursor-pointer px-3 py-2 text-left hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-none"
                            >
                                <span className="block text-sm text-white">{food.name}</span>
                                <span className="block text-[10px] text-white/50 tabular-nums">
                                    {food.calories} kcal · P {food.protein} · C {food.carbs} · F {food.fat} per 100g
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}