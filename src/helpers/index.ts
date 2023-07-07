import { API } from "aws-amplify";

export const gptResponse = (prompt: string) => {
  console.log("ENTRANDO A LA PETICION API");

  const apiName = "openai";
  const path = `/turbo`;
  const myInit = {
    body: {
      prompt
    }
  };

  return API.post(apiName, path, myInit);
};
