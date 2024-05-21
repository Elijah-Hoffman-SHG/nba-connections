
import puppeteer from "puppeteer";
import express from "express";
import https from 'https';
import fs from 'fs';
import { publishData } from "./functions/index.js";

const app = express();
app.use(express.json());
app.get("/get-connectionLinks", async (req, res) => {
    console.log('we are at least in here')
    try {
        const data = await getConnections();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
});
const successSelector = '.successful-card';
const getConnections = async () => {
    console.log('Starting getConnections...');
    const browser = await puppeteer.launch({
        headless: 'chrome',
        defaultViewport: {
            width: 1920,
            height: 1080,
        
        },
        
    });

    console.log('Browser launched...');
    const page = await browser.newPage();
    console.log('New page opened...');
    await page.goto('https://www.leconnections.app/', {
        waitUntil: "networkidle2",
    });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3 WAIT_UNTIL=load');

    console.log('Page loaded...');
    await page.screenshot({path: 'screenshot_out.png'});
    await page.reload({ waitUntil: ["networkidle2"] });
    await delay(30000);
   // await startGame(page);

    const playerMap = await getNameImgMap(page);

    await failGame(page);
    console.log('Game failed...');
    await delay(100);
    const data = await getAnswers(page, playerMap);
    console.log('Answers obtained...');
    await browser.close();
    try {
        const result = await publishData(data);
        console.log(result);
      } catch (error) {
        console.error('Error publishing data:', error);
      }
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
 
    await page.waitForSelector("#closeIconHit")
    const closeIcon = await page.$("#closeIconHit");
    await closeIcon.click();
    

   
    await toggle.click({delay: 1000});

    let playerNames = [];
    await page.waitForSelector(playerSelector);
    const players = await page.$$(playerSelector);
    console.log('players found, iterating through them to get names')
    for(let i = 0; i < players.length; i++){
        console.log(`getting name for player ${i}`)
        const names = await players[i].$$eval('.player-name', ps => ps.map(p => p.innerText));
        const [firstName, lastName] = names;
        playerNames.push({ firstName, lastName });
        console.log(`name for player ${i} is ${firstName} ${lastName}`)
        await toggle.click({delay: 1000});
        await delay(20000);
        await page.screenshot({path: 'screenshot_after_toggle_in_loop.png'});
        await delay(60000);
        await page.screenshot({path: `waiting_for_player_${i}.png`});
        await page.waitForSelector(playerSelector);

        
        
        await page.waitForSelector('.card-img');
        const img = await players[i].$eval('.card-img', img => img.getAttribute('src'));
        console.log(`image for player ${i} is ${img}`)
        await toggle.click({delay: 1000});
        
        
    }
  
    
    await page.waitForSelector(playerSelector);
    await toggle.click({delay: 1000});
    await delay(60000);
    const playerImgs = await page.$$(playerSelector);
    let imgUrls = [];
    console.log('players found, iterating through them to get images')
    console.log(playerImgs.length)
    await page.screenshot({path: 'screensho_after_second.png'});
    for(let i = 0; i < playerImgs.length; i++){
        console.log(`getting image for player ${i}`)
        await delay(2000)
        console.log('delayed')
        await page.waitForSelector('.card-img');
        const img = await playerImgs[i].$eval('.card-img', img => img.getAttribute('src'));
       
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
    await submitButton.click({delay: 1000});
    await delay(4000);

    await button[0].click({delay: 1000});
    await button[5].click({delay: 1000});
    await submitButton.click({delay: 1000});
    await delay(4000);

    await button[5].click({delay: 1000});
    await button[6].click({delay: 1000});
    await submitButton.click({delay: 1000});
    await delay(4000);

    await button[6].click({delay: 1000});
    await button[7].click({delay: 1000});
    await submitButton.click({delay: 1000});

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


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
