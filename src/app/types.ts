export interface CrawlerConfig {
    /** URL to start the crawl, if sitemap is provided then it will be used instead and download all pages in the sitemap */
    url: string;
    /** Pattern to match against for links on a page to subsequently crawl */
    match: string;
    /** Selector to grab the inner text from */
    selector: string;
    /** Don't crawl more than this many pages */
    maxPagesToCrawl: number;
    /** File name for the finished data */
    outputFileName: string;
    /** Optional resources to exclude */
    resourceExclusions?: string[];
    /** Optional maximum file size in megabytes to include in the output file */
    maxFileSize?: number;
    /** Optional maximum number tokens to include in the output file */
    maxTokens?: number;
} 