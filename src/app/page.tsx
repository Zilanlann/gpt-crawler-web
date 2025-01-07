import CrawlerForm from "./components/CrawlerForm";
import { ThemeToggle } from "./components/ThemeToggle";

export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <ThemeToggle />
      <div className="container mx-auto min-h-screen">
        <h1 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 animate-gradient">
          Document Parse Tool
        </h1>
        <CrawlerForm />
      </div>
    </main>
  );
}
