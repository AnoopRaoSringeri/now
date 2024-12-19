import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage
} from "./ui/breadcrumb";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";

export type BreadcrumbItemType = {
    link: string;
    title: string;
    onClick?: () => unknown;
};

export type BreadcrumbActionType =
    | {
          title: string;
          type: "button";
          onClick?: () => unknown;
      }
    | {
          title: string;
          type: "icon";
          onClick?: () => unknown;
      };

export function AppBreadcrumb({ items, actions }: { items: BreadcrumbItemType[]; actions: BreadcrumbActionType[] }) {
    return (
        <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb className="flex-1">
                <BreadcrumbList>
                    {items.map((i, ix) => (
                        <BreadcrumbItemContainer key={ix} {...i} hideSeparator={ix === items.length - 1} />
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
            {actions.map((a) => (
                <Button size="sm" key={a.title} onClick={a.onClick}>
                    {a.title}
                </Button>
            ))}
        </div>
    );
}

function BreadcrumbItemContainer({
    hideSeparator,
    link,
    title,
    onClick
}: BreadcrumbItemType & { hideSeparator?: boolean }) {
    return (
        <>
            <BreadcrumbItem>
                {hideSeparator ? (
                    <BreadcrumbPage> {title}</BreadcrumbPage>
                ) : (
                    <BreadcrumbLink href={link} onClick={onClick}>
                        {title}
                    </BreadcrumbLink>
                )}
            </BreadcrumbItem>
            {hideSeparator ? null : <BreadcrumbSeparator className="hidden md:block" />}
        </>
    );
}
