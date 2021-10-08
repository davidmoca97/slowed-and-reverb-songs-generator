import { getSongLength } from "./getSongLength"

it("works", () => {
    expect(getSongLength(100, 0.5)).toBe(200);
});
