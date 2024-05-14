
import puppeteer from "puppeteer";
import express from "express";
import https from 'https';
import fs from 'fs';

const app = express();
app.use(express.json());
app.get("/get-connectionLinks", async (req, res) => {
    const data = await getConnections();
    res.json(data);
})
const successSelector = '.successful-card';
const getConnections = async () => {
    console.log('Starting getConnections...');
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args:['--incognito', '--no-sandbox', '--disable-setuid-sandbox'],
    });

    console.log('Browser launched...');
    const page = await browser.newPage();
    console.log('New page opened...');
    await page.goto('https://www.leconnections.app/', {
        waitUntil: "networkidle2",
    });

    console.log('Page loaded...');
    await startGame(page);
    const playerMap = await getNameImgMap(page);

    await failGame(page);
    console.log('Game failed...');
    await delay(100);
    const data = await getAnswers(page, playerMap);
    console.log('Answers obtained...');
    await browser.close();
    console.log('Browser closed...');
    return data;
}
async function getAnswers(page, playerMap){
    await page.waitForSelector(successSelector);
    const success = await page.$$(successSelector);
    let data = [];
    for(let i = 0; i < success.length; i++){
        const imgs = await success[i].$$eval('img', imgs => imgs.map(img => img.getAttribute('src')));
        let players = imgs.map(img => playerMap.get(img));
        const title = await success[i].$eval('h2', i => i.innerText);
        data.push({imgs, title, players});
    }
    await page.waitForSelector(".format-date");
    const date = await page.$eval(".format-date", i => i.innerText);
    data.push({date});    
    return data
    
    
}
function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }
 async function startGame(page){
    await page.waitForSelector(".started-button");
    console.log('clicking started button')
    const startButton = await page.$(".started-button");
    await startButton.click();
 }
 async function getNameImgMap(page){
    const toggleSelector = '.react-toggle';
    const playerSelector = '.shaking-container';
    await page.waitForSelector(toggleSelector);
    const toggle = await page.$(toggleSelector);
    console.log('clicking toggle')
    await toggle.click();
    console.log('toggled')
    let playerNames = [];
    await page.waitForSelector(playerSelector);
    const players = await page.$$(playerSelector);
    for(let i = 0; i < players.length; i++){

        const names = await players[i].$$eval('.player-name', ps => ps.map(p => p.innerText));
        const [firstName, lastName] = names;
        playerNames.push({ firstName, lastName });
        
    }
    await toggle.click();
    await page.waitForSelector(playerSelector);
    const playerImgs = await page.$$(playerSelector);
    let imgUrls = [];
    for(let i = 0; i < playerImgs.length; i++){

        const img = await playerImgs[i].$eval('img', img => img.getAttribute('src'));
       
        imgUrls.push(img);
        
    }
    
 
 
    let playerMap = new Map();
for(let i = 0; i < imgUrls.length; i++) {
    playerMap.set(imgUrls[i], playerNames[i]);
}
return playerMap;
  


 }
 async function failGame(page){
    // Make sure we fail
    // If the game guess is one away, it won't work.

    
    const searchResultSelector = '.shaking-container';
    const submitButtonSelector = 'button ::-p-text(Submit)'
    const successSelector = '.successful-card';

    await page.waitForSelector(searchResultSelector);
    const button = await page.$$(searchResultSelector);
     for (let i = 0; i < 4; i++) {
       await button[i].click();
     }

    await page.waitForSelector(submitButtonSelector);
    const submitButton = await page.$(submitButtonSelector);
    await submitButton.click();
    await delay(4000);

    await button[0].click();
    await button[5].click();
    await submitButton.click();
    await delay(4000);

    await button[5].click();
    await button[6].click();
    await submitButton.click();
    await delay(4000);

    await button[6].click();
    await button[7].click();
    await submitButton.click();

    let successfulCards = [];
    while (successfulCards.length !== 4) {
        await page.waitForSelector(successSelector);
        successfulCards = await page.$$(successSelector);
        console.log(`There are ${successfulCards.length} successful cards`);

        if (successfulCards.length !== 4) {
            await delay(1000);
        }
    }
    console.log('There are 4 successful cards');
}

async function checkWarning(page) {
    const warningSelector = '.warning ::-p-text(One Away)';
    try {
      // Wait for the warning to appear on the page for 3 seconds
      await page.waitForSelector(warningSelector, { timeout: 3000 });
      const warning = await page.$(warningSelector);
      console.log('WARNING IS HERE BOYY!')
      
    } catch (error) {
      console.log('Warning did not appear within 3 seconds');
    }
  }

async function buildimgNameMap(page){

}
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
