import { useEffect, useState } from "react";

export function useGithubToken() {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("github_token");
        setToken(storedToken);
    }, []);

    return token;
}
