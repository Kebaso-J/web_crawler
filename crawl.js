
/**
 * Three fucntions will be defined herein
 * 
 * normalizeURL- make the input URL in the format we require
 * getURLsFromHTML - to extract all the URLs from a given HTML page
 * crawlPage - to crawl all the pages that the URLs lead to, and repeat
 * the same process until a dead end is reached.
 */


const {JSDOM} = require('jsdom');

async function crawlPage(baseUrl, currentUrl, pages){
    const baseUrlObj = new URL(baseUrl)
    const currentUrlObj = new URL(currentUrl)

    if(baseUrlObj.hostname !== currentUrlObj.hostname){
        return pages
    }

const normalizedCurrentUrl = normalizeURL(currentUrl)
if(pages[normalizedCurrentUrl] > 0){
    pages[normalizedCurrentUrl]++
    return pages
}

pages[normalizedCurrentUrl] = 1;

console.log('Actively crawling: ${currentUrl}')

try{
    const resp = await fetch(currentUrl)

    if(resp.status > 399){
        console.log("Error in fetching with status code: ", resp.status, " on page: ", currentUrl)
        return pages
    }

    const contentType = resp.headers.get("content-type")
    if(!contentType.includes("text/html")){
        console.log("Non HTML response, content type: ", contentType, " on page: ", currentUrl)
        return pages
    }

    const htmlBody = await resp.text()

    const nextUrls = getURLsFromHTML(htmlBody, baseUrl)

    for(const nextUrl of nextUrls){
        pages = await crawlPage(baseUrl, nextUrl, pages)
    }
} catch(err){
    console.log("Error in fetching: ", currentUrl, err.message)
}

return pages
}


function getURLsFromHTML(htmlBody, baseUrl){
    const urls = [];
    const dom = new JSDOM(htmlBody)
    const linkElements = dom.window.document.querySelectorAll('a')
    for(linkElement of linkElements){
        if(linkElement.href.slice(0, 1) === '/'){
            //relative
            try{
                const urlObj = new URL(`${baseUrl}${linkElement.href}`)
                urls.push(urlObj.href)
            } catch(err){
                console.log("error with relative URL:", err.message);
            }
        }else {
        //absolute
        try{
            const urlObj = new URL(linkElement.href)
            urls.push(urlObj.href);
        }catch(err){
            console.log("error with absolute URL:", err.message);
        }
        }
    }
    return urls;
}



//the job of the normalizeURL fucntion is to take in the input urls and then return
//same output for the URLs that lead to the same page

function normalizeURL(urlString) {
    const urlObj = new URL(urlString);
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
    if(hostPath.length > 0 && hostPath.slice(-1) === '/'){
        return hostPath.slice(0, -1);
    }
    return hostPath;
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}




// This function takes the  output of the crawling process('pages' object) and
// generates a list of all the crwaled pages and their frequency


function printReport(pages){
    console.log("=================================")
    console.log("REPORT")
    console.log("=================================")
    const sortedPages = sortPages(pages)

    for(const sortedPage of sortedPages){
        const url = sortedPage[0]
        const hits = sortedPage[1]

        console.log(`Found ${hits} links on page: ${url}`)
    }

    console.log("=====================================")
    console.log("END REPORT")
    console.log("=====================================")
}

function sortPages(pages){
    const pagesArr = Object.entries(pages)
    pagesArr.sort((a, b) => {
        aHits = a[1]
        bHits = b[1]
        return b[1] - a[1]
    })
    return pagesArr
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage,
    sortPages,
    printReport
};


