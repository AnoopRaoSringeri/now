import * as React from "react";
import { Label as LabelPrimitive } from "radix-ui";

import { cn } from "@now/utils";
import { cva, VariantProps } from "class-variance-authority";

const labelVariants = cva(
    "flex items-center gap-2 text-sm  font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 w-full overflow-hidden text-ellipsis",
    {
        variants: {
            varient: {
                small: "font-normal text-sm leading-tight"
            }
        }
    }
);

function Label({
    className,
    ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>) {
    return <LabelPrimitive.Root data-slot="label" className={cn(labelVariants(), className)} {...props} />;
}

export { Label };
