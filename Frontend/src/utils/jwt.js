export const decodeJwtPayload = (
    token
) => {
    try {
        const payload =
            token.split(".")[1];

        const decodedPayload =
            atob(
                payload
                    .replace(/-/g, "+")
                    .replace(/_/g, "/")
            );

        return JSON.parse(
            decodedPayload
        );
    } catch (error) {
        return null;
    }
};

export const isTokenExpired = (
    token
) => {
    const payload =
        decodeJwtPayload(token);

    if (!payload?.exp) {
        return true;
    }

    return (
        Date.now() >=
        payload.exp * 1000
    );
};