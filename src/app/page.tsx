"use client";

import { Amplify, Storage } from "aws-amplify";
import awsconfig from "../aws-exports";
import { useEffect, useState } from "react";
import Image from "next/image";
import AudioBtn from "./AudioBtn";
Amplify.configure(awsconfig);

export default function HomePage() {
    const [image, setImage] = useState("");
    const [audio, setAudio] = useState("");
    const [gptText, setGptText] = useState(["", ""]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
    };

    const onClickButton = async () => {
        const value = inputValue;
        setInputValue("");
        setIsLoading(true);
        setImage("");
        setAudio("");

        try {
            const response = await fetch("http://localhost:3000/api/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt: value }),
            });

            const data = await response.json();
            console.log("DATA:", data);

            const [animal, sound] = data.split(",");
            setGptText([animal, sound]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const getAudio = async () => {
        const s3Audio = await Storage.get(`sounds/${gptText[1]}`, {
            level: "public",
        });

        console.log("GET AUDIO:", s3Audio);
        setAudio(s3Audio);
    };

    const getImage = async () => {
        const s3Image = await Storage.get(`images/${gptText[0]}`, {
            level: "public",
        });
        console.log("GET IMAGE:", s3Image);
        setImage(s3Image);
    };

    useEffect(() => {
        if (gptText[0]?.trim()) {
            getImage();
        }

        if (gptText[1]?.trim()) {
            getAudio();
        }
    }, [gptText]);

    return (
        <main className="p-10">
            <input
                type="text"
                className="outline-none border-b border-l-gray-700"
                placeholder="Escribe algo..."
                autoFocus
                value={inputValue}
                onChange={onChangeInput}
            />
            {isLoading && <p>Cargando...</p>}
            {image && <Image src={image} height={200} width={200} alt="imagen-ia" />}
            {audio && <AudioBtn voice={audio} />}
            {!isLoading && <button onClick={onClickButton}>Enviar</button>}
        </main>
    );
}
