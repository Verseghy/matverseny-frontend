export const baseFetchRequest: Request = {
    cache: "no-cache",
    credentials: "omit",
    headers: {
        // @ts-ignore
        "Content-Type": "application/json",
    },
    mode: "cors",
    redirect: "follow",
    referrerPolicy: "no-referrer",
}
