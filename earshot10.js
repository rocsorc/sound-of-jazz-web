// THIS IS A SCRIPT, CAN'T BE USED IN HTML (yet)

// ??? does this need to be imported for every DOM content load -nmw ???
import puppeteer from "puppeteer";

const getEvents = async () => {
    // starting a puppeteer browser
    // headless: false; will make the browser visible for debug
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });

    // Open a new page
    const page = await browser.newPage();
    // and on this page... we open toscrape.com site, wait until DOM is ready
    await page.goto("https://www.earshot.org/jazz-around-the-sound/", {
        waitUntil: "domcontentloaded",
    });

    // getting the page data
    const eventInfos = await page.evaluate(() => {
        // fetching first element with .quote
        const eventInfosList = document.querySelectorAll(".community-events_ecs_category");

        // converting quoteList to an iterable array
        // for each quote, fetch the text and author
        return Array.from(eventInfosList).map((eventInfo) => {
            // fetch sub elements from the fetched quote element
            const eventDate = eventInfo.querySelector(".tribe-event-date-start").innerText;
            const eventName = eventInfo.querySelector(".entry-title").innerText;
            const eventLocation = eventInfo.querySelector(".venue").innerText;
            return { eventDate, eventName, eventLocation };
        });
    });

    // display quotes
    var i;
    console.log("[\n");
    for (i = 0; i < eventInfos.length; i++)
        {
       console.log( "\t{\n"
     + "\t\teventDate: \"" + eventInfos[i]['eventDate'] + "\",\n"
     + "\t\teventName: \"" + eventInfos[i]['eventName'] + "\",\n"
     + "\t\teventLocation: \"" + eventInfos[i]['eventLocation'] + "\"\n" 
     + "\t},\n");
        }
    console.log("\n]\n");

    // -nmw console.log(eventInfos);    

    // close the browser
    await browser.close();

};

// start the scraping
getEvents();
