'use client';
import { Suspense, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { formatTextToHTML } from "../../utils";

const API_KEY = 'AIzaSyAToJYIarf5AcYs09uppYeZYeSuAhw4msw';//process.env.API_KEY || '';

export default function Home() {
  const [result, setResult] = useState<string>("Empty");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("Tạo 3 số ngẫu nhiên từ 1 đến 78. Tiếp theo, tra cứu các lá bài tarot tương ứng và ý nghĩa của chúng. Cuối cùng, đưa ra một giải bài tổng thể cho tôi, dựa trên 3 lá bài.");

  const handleSendPromptToGemini = async (prompt: string) => {
    setIsLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(API_KEY)
      const model = genAI.getGenerativeModel({ model: "gemini-pro" })

      const result = await model.generateContent(prompt)
      const response = result.response
      const text = response.text()

      setResult(formatTextToHTML(text))
    } catch (error) {
      setResult('Failed to fetch response.')
    }
    setIsLoading(false)
  }

  const handleReadCards = async () => {
    await handleSendPromptToGemini(prompt);
  }

  return (
    <main className="content">
      <h1 className="heading">Demo Tarot</h1>

      <section className="features">
        <article className="card">
          <h2>Kết quả trải bài từ Gemini API</h2>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: result }} />
          )}
        </article>
      </section>

      <button disabled={isLoading} onClick={handleReadCards}>Trải bài</button>
    </main>
  );
}
