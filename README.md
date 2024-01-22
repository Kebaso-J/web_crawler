# Web Crawler

This is a simple web crawler built in Node.js. It starts from a base URL and crawls all linked pages within the same domain.

## Features

- Crawls all pages within a domain
- Counts the number of links on each page
- Prints a report of all crawled pages and their link counts

## Usage

1. Install Node.js and npm if you haven't already.
2. Clone this repository.
3. Navigate to the project directory and run `npm install` to install dependencies.
4. Run the crawler with the command `node index.js [baseURL]`, replacing `[baseURL]` with the URL you want to start crawling from.

## Code Structure

- `index.js`: The main file that runs the crawler.
- `crawl.js`: Contains the functions for crawling pages, sorting pages by link count, and printing the report.

## Limitations

- This crawler does not respect robots.txt files or other directives intended to limit crawling.
- It does not handle dynamic content (e.g., content loaded via JavaScript after the initial page load).
- It only crawls pages within the same domain as the base URL.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
