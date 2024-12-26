export interface IObjectStyle {
    strokeStyle: string;
    fillColor: string;
    strokeWidth: number;
    opacity: number;
    font: Font | null;
}

export interface Font {
    color: string;
    style: string;
    varient: string;
    weight: number | string;
    size: number | string;
    family:
        | string
        | "caption"
        | "icon"
        | "menu"
        | "message-box"
        | "small-caption"
        | "status-bar"
        | "initial"
        | "inherit";
}
