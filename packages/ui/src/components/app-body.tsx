import { ReactNode } from "react";
import { AppBreadcrumb, BreadcrumbActionType, BreadcrumbItemType } from "./app-breadcrumb";

export function AppBody({
    children,
    breadcrumbItems,
    breadcrumbActions
}: {
    breadcrumbItems?: BreadcrumbItemType[];
    breadcrumbActions?: BreadcrumbActionType[];
    children: ReactNode;
}) {
    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                <AppBreadcrumb items={breadcrumbItems ?? []} actions={breadcrumbActions ?? []} />
            </header>
            <div className="flex relative flex-1 flex-col gap-4 p-4 pt-0 overflow-hidden items-center">{children}</div>
        </>
    );
}
