export function AiGenerator({ value, onChange }: { value: string; onChange: (value: string) => unknown }) {
    return (
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            id="canvas-text"
            className=" size-full z-[3] m-0 block resize-none overflow-auto border-white border bg-slate-900  py-[2px] px-[10px] text-xl  focus:ring-0 focus:ring-offset-0 focus-visible:border-none focus-visible:ring-0 focus-visible:ring-offset-0 "
        />
    );
}
