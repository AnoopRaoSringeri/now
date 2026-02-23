import { Button, Icon, Label, LucideIcons, Popover, PopoverArrow, PopoverContent, PopoverTrigger } from "@now/ui";
import { ElementEnum } from "@now/utils";
import { observer } from "mobx-react";
import { useParams } from "react-router";
import { useCanvas } from "../hooks/use-canvas";
interface Option {
    icon: LucideIcons;
    value: ElementEnum;
    description: string;
}

const LeftOptionLists: Option[] = [
    {
        icon: "Move",
        value: ElementEnum.Move,
        description: "Select and drag elements to move or click and drag to select multiple elements"
    },
    {
        icon: "Hand",
        value: ElementEnum.Pan,
        description: "Click and drag to move canvas, scroll to zoom-in or zoom-out"
    },
    {
        icon: "Pencil",
        value: ElementEnum.Pencil,
        description: ""
    },
    {
        icon: "RectangleHorizontal",
        value: ElementEnum.Rectangle,
        description: ""
    },
    {
        icon: "Circle",
        value: ElementEnum.Circle,
        description: ""
    },
    {
        icon: "Square",
        value: ElementEnum.Square,
        description: ""
    },
    {
        icon: "Minus",
        value: ElementEnum.Line,
        description: ""
    },
    {
        icon: "Type",
        value: ElementEnum.Text,
        description: ""
    },
    {
        icon: "ImagePlus",
        value: ElementEnum.Image,
        description: "Click anywhere on the screen to insert image"
    },
    {
        icon: "Table",
        value: ElementEnum.Chart,
        description: "Click and drag to draw a file input, upload file to add a table"
    },
    {
        icon: "Sparkles",
        value: ElementEnum.AiPrompt,
        description: "Click and drag to draw a textarea, type your prompt"
    },
    {
        icon: "Link",
        value: ElementEnum.Link,
        description: "Select 2 elements to link"
    }
];

const VISIBLE_ELEMENTS = 8;

const ElementSelector = observer(function ElementSelector({ onChange }: { onChange: (value: ElementEnum) => unknown }) {
    const { id } = useParams<{ id: string }>();
    const { canvasBoard } = useCanvas(id ?? "new");

    const selectedOption = LeftOptionLists.find((o) => o.value === canvasBoard.ElementType);

    return (
        <div className="absolute top-5 z-10 flex flex-col items-center gap-1">
            <div className="-mt-[20px] h-4 flex items-center justify-center">
                {selectedOption ? <Label className="text-xs">{selectedOption.description}</Label> : null}
            </div>
            <div className=" flex flex-row items-center gap-1">
                <Button
                    size="sm"
                    variant={canvasBoard.IsElementSelectorLocked ? "default" : "secondary"}
                    onClick={() => {
                        canvasBoard.IsElementSelectorLocked = !canvasBoard.IsElementSelectorLocked;
                    }}
                >
                    {canvasBoard.IsElementSelectorLocked ? (
                        <Icon name="Lock" size="20px" />
                    ) : (
                        <Icon name="LockOpen" size="20px" />
                    )}
                </Button>
                <Icon name="Minus" className="rotate-90" size="30px" />
                {LeftOptionLists.slice(0, VISIBLE_ELEMENTS).map((o) => (
                    <Button
                        size="sm"
                        variant={canvasBoard.ElementType === o.value ? "default" : "secondary"}
                        key={o.value}
                        onClick={() => {
                            onChange(o.value);
                        }}
                    >
                        <Icon name={o.icon} size="20px" />
                    </Button>
                ))}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button size="sm" variant="secondary">
                            <Icon name="Ellipsis" size="20px" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        onInteractOutside={(e) => e.preventDefault()}
                        onPointerDownOutside={(e) => e.preventDefault()}
                        align="end"
                        alignOffset={0}
                        className=" flex flex-row items-center gap-1 w-min"
                    >
                        {LeftOptionLists.slice(VISIBLE_ELEMENTS).map((o) => (
                            <Button
                                size="sm"
                                variant={canvasBoard.ElementType === o.value ? "default" : "secondary"}
                                key={o.value}
                                onClick={() => {
                                    onChange(o.value);
                                }}
                            >
                                <Icon name={o.icon} size="20px" />
                            </Button>
                        ))}
                        <PopoverArrow />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
});

export default ElementSelector;
