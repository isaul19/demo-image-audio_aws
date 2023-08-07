import { API } from "aws-amplify";

export const gptResponse = (prompt: string) => {
    console.log("ENTRANDO A LA PETICION API");

    const apiName = "api5bff1eb8";
    const path = `/openai`;
    const myInit = {
        body: {
            prompt,
        },
    };

    return API.post(apiName, path, myInit);
};
