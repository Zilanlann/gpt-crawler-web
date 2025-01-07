"use client";

import { Button, Input, Textarea, Card, Spinner } from "@nextui-org/react";
import { useState, useRef, useEffect } from "react";
import type { CrawlerConfig, CrawlerResponse } from "../types";

export default function CrawlerForm() {
    const [formData, setFormData] = useState<CrawlerConfig>({
        url: "",
        match: "",
        selector: "",
        maxPagesToCrawl: 10,
        outputFileName: "output.json",
        maxFileSize: undefined,
        maxTokens: undefined,
        resourceExclusions: undefined,
    });
    const [responseData, setResponseData] = useState<CrawlerResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formHeight, setFormHeight] = useState<number>(0);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        const updateFormHeight = () => {
            if (formRef.current) {
                setFormHeight(formRef.current.offsetHeight);
            }
        };

        updateFormHeight();
        window.addEventListener('resize', updateFormHeight);

        return () => window.removeEventListener('resize', updateFormHeight);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setResponseData(null);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/crawl`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            setResponseData(data);
            console.log("Response:", data);
        } catch (error) {
            console.error("Error:", error);
            // TODO: Handle the error
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = () => {
        if (!responseData) return;

        const blob = new Blob([JSON.stringify(responseData, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = formData.outputFileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-4 w-full max-w-[90%] mx-auto p-4 justify-center">
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4 w-full lg:w-1/2">
                <Input
                    label="URL"
                    placeholder="https://example.com"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    required
                />
                <Input
                    label="Match Pattern"
                    placeholder="https://example.com/**"
                    value={formData.match}
                    onChange={(e) => setFormData({ ...formData, match: e.target.value })}
                    required
                />
                <Input
                    label="Selector"
                    placeholder="article"
                    value={formData.selector}
                    onChange={(e) => setFormData({ ...formData, selector: e.target.value })}
                    required
                />
                <Input
                    type="number"
                    label="Max Pages to Crawl"
                    value={formData.maxPagesToCrawl.toString()}
                    onChange={(e) => setFormData({ ...formData, maxPagesToCrawl: parseInt(e.target.value) })}
                    required
                />
                <Input
                    label="Output File Name"
                    value={formData.outputFileName}
                    onChange={(e) => setFormData({ ...formData, outputFileName: e.target.value })}
                    required
                />
                <Input
                    type="number"
                    label="Max File Size (MB)"
                    value={formData.maxFileSize?.toString() || ""}
                    onChange={(e) => setFormData({ ...formData, maxFileSize: e.target.value ? parseInt(e.target.value) : undefined })}
                />
                <Input
                    type="number"
                    label="Max Tokens"
                    value={formData.maxTokens?.toString() || ""}
                    onChange={(e) => setFormData({ ...formData, maxTokens: e.target.value ? parseInt(e.target.value) : undefined })}
                />
                <Textarea
                    label="Resource Exclusions"
                    placeholder="Enter file extensions to exclude (comma-separated)"
                    value={formData.resourceExclusions?.join(", ") || ""}
                    onChange={(e) => setFormData({ ...formData, resourceExclusions: e.target.value ? e.target.value.split(",").map(s => s.trim()) : undefined })}
                />
                <Button type="submit" color="primary">
                    Start Crawling
                </Button>
            </form>

            {(isLoading || responseData) && (
                <Card className="w-full lg:w-1/2" style={{ height: `${formHeight}px` }}>
                    <div className="flex justify-between items-center p-4">
                        <h2 className="text-xl font-bold">Crawling Results</h2>
                        {responseData && (
                            <Button color="secondary" onPress={handleDownload}>
                                Download JSON
                            </Button>
                        )}
                    </div>
                    <div className="p-4 h-[calc(100%-5rem)]">
                        {isLoading ? (
                            <div className="h-full flex items-center justify-center">
                                <div className="flex flex-col items-center gap-4">
                                    <Spinner size="lg" />
                                    <p className="text-default-500">Crawling in progress...</p>
                                </div>
                            </div>
                        ) : (
                            <pre className="bg-gray-100 p-4 rounded-lg h-full overflow-auto text-sm">
                                {JSON.stringify(responseData, null, 2)}
                            </pre>
                        )}
                    </div>
                </Card>
            )}
        </div>
    );
} 