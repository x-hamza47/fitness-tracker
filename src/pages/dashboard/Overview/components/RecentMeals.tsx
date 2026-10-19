import type { Icon } from "@tabler/icons-react";
import { IconApple, IconCoffee, IconSoup, IconToolsKitchen2 } from "@tabler/icons-react";
import { timeAgo } from "@/lib/time";
import type { MealType, RecentMeal } from "@/types/dashboard";
import RecentList, { RecentListItem } from "./RecentList";

type RecentMealsProps = {
    data?: RecentMeal[];
    isLoading?: boolean;
    isError?: boolean;
    onRetry?: () => void;
};

const MEAL: Record<MealType, { label: string; icon: Icon }> = {
    breakfast: { label: "Breakfast", icon: IconCoffee },
    lunch: { label: "Lunch", icon: IconToolsKitchen2 },
    dinner: { label: "Dinner", icon: IconSoup },
    snack: { label: "Snack", icon: IconApple },
};

export default function RecentMeals({ data, isLoading, isError, onRetry }: RecentMealsProps) {
    return (
        <RecentList
            title="Recent meals"
            viewAllTo="/dashboard/nutrition"
            items={data}
            getKey={(m) => m.id}
            isLoading={isLoading}
            isError={isError}
            onRetry={onRetry}
            emptyTitle="No meals logged"
            emptyMessage="Log a meal and it will show up here."
            renderItem={(m) => {
                const { label, icon } = MEAL[m.mealType];

                return (
                    <RecentListItem
                        icon={icon}
                        title={m.name}
                        subtitle={`${label} · ${Math.round(m.macros.protein)} g protein`}
                        value={`${m.calories} kcal`}
                        meta={timeAgo(m.loggedAt)}
                    />
                );
            }}
        />
    );
}