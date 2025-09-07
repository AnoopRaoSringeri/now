import { SortConfig } from "@now/utils";
import { ArrowUpAZ, ArrowDownAZ, ChevronsUpDown } from "lucide-react";

export const SortIcon = ({ sort }: { sort: SortConfig | null }) => {
    if (!sort) {
        return <ChevronsUpDown />;
    }
    return sort.sort === "ASC" ? <ArrowUpAZ /> : <ArrowDownAZ />;
};
