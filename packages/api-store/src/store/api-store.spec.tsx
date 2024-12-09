import { render } from "@testing-library/react";

import ApiStore from "./api-store";

describe("ApiStore", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<ApiStore />);
        expect(baseElement).toBeTruthy();
    });
});
