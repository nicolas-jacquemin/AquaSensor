export type fetR = {
    ret : any;
    code: number;
}

export async function fet(input: RequestInfo | URL, init?: RequestInit | undefined): Promise<fetR> {
    let r: fetR = {
        ret: null,
        code: 0
    }
    let res = await fetch(input, init);
    r.ret = await res.json();
    r.code = res.status;
    return r;
}

describe("Basic", () => {
    it("Basic", async () => {
      const result = await fet(`http://localhost:${process.env.PORT}/`);
      expect(result.code).toEqual(404);
    });
});