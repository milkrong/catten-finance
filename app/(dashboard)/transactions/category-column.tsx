import { useEditCategoryStore } from "@/features/categories/hooks/use-edit-category";
import { useNewCategoryStore } from "@/features/categories/hooks/use-new-category";
import { useEditTransactionStore } from "@/features/transactions/hooks/use-edit-transaction";
import { cn } from "@/lib/utils";
import { TriangleAlertIcon } from "lucide-react";

export const CategoryColumn = ({
  id,
  category,
  categoryId,
}: {
  id: string;
  category: string | null;
  categoryId: string | null;
}) => {
  const { onOpen: editCategory } = useEditCategoryStore();
  const { onOpen: openEditTransactionSheet } = useEditTransactionStore();
  const handleClick = () => {
    if (!categoryId) {
      openEditTransactionSheet(id);
    } else {
      editCategory(categoryId);
    }
  };
  return (
    <div
      className={cn("flex items-center cursor-pointer hover:underline", !category && "text-rose-500")}
      onClick={handleClick}
    >
      {!category && <TriangleAlertIcon className="w-4 h-4 mr-2 shrink-0" />}
      {category || "Uncategorized"}
    </div>
  );
};
