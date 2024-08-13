
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
app.get("/fuckemup", async (req, res)=>{
    console.log('we are finna fuck em up')
    try {
        const data = await getfuck();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }

})
const getfuck = async () => {
    console.log('Browser launched...');
    const browser = await puppeteer.launch({
        headless: 'chrome',
        defaultViewport: {
            width: 1920,
            height: 1080,
        
        },
        args: [
            '--incognito',
          ],
        
        
    });

    const page = await browser.newPage();
    console.log('New page opened...');
    await page.goto('https://connections.hoopgrids.com/', {
        waitUntil: "networkidle2",
        
    });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3 WAIT_UNTIL=load');

    console.log('Page loaded...');
   
    await page.waitForSelector('.close-button')
    console.log('swaggin')
    const closeButton = await page.$(".close-button");
    console.log('aaa')
    await closeButton.click()
    console.log('clicked button')
    const giveupbootn = '/html/body/app-root/div/div[3]/div[2]/app-game/app-game-board/div/div/div[8]/div[1]/button[5]'
    const lowergiveupbootn = '/html/body/div[2]/div[2]/div/mat-dialog-container/div/div/app-confirm-action/mat-dialog-content/button'
    const fullgrid = '/html/body/app-root/div/div[3]/div[2]/app-game/app-game-board/div/div/div[2]'
    const grid1 = '/html/body/app-root/div/div[3]/div[2]/app-game/app-game-board/div/div/div[2]/div[1]'
    const grid_ = '/html/body/app-root/div/div[3]/div[2]/app-game/app-game-board/div/div/div[2]'
    const submitButton = '/html/body/app-root/div/div[3]/div[2]/app-game/app-game-board/div/div/div[8]/div[1]/button[3]'
    const wingrid = '/html/body/app-root/div/div[3]/div[2]/app-game/app-game-board/div/div/div[1]'


    const playerImgMap = new Map();
    await page.waitForSelector(`::-p-xpath(${fullgrid})`)
    const elements = await page.$$(`::-p-xpath(${fullgrid}) > div`)
    for (let i = 0; i < 16; i++){
    const names = await elements[i].$eval('div p', p => p.innerText);
    const img = await elements[i].$eval('div img', img => img.getAttribute('src'));
    if (playerImgMap.has(img)) {
        playerImgMap.get(img).push(names);
    } else {
        playerImgMap.set(img, [names]);
    }
    console.log(names, img)
    }
    for (let i = 1; i < 5; i++){
        await page.waitForSelector(`::-p-xpath(${fullgrid})`)
        await page.waitForSelector(`::-p-xpath(${grid_}/div[${i}])`)
        const element = await page.$(`::-p-xpath(${grid_}/div[${i}])`)
        await element.click({delay: 1000})
    }
    await page.waitForSelector(`::-p-xpath(${submitButton})`)
    const submit = await page.$(`::-p-xpath(${submitButton})`)
    await submit.click({delay: 1000})
    
    await delay(3000);
    for (let i = 4; i < 6; i++){
        await page.waitForSelector(`::-p-xpath(${fullgrid})`)
        await page.waitForSelector(`::-p-xpath(${grid_}/div[${i}])`)
        const element = await page.$(`::-p-xpath(${grid_}/div[${i}])`)
        await element.click({delay: 1000})
    }
    await page.waitForSelector(`::-p-xpath(${submitButton})`)
    const submit2 = await page.$(`::-p-xpath(${submitButton})`)
    await submit2.click({delay: 1000})
    await page.waitForSelector(`::-p-xpath(${fullgrid})`)
    await page.waitForSelector(`::-p-xpath(${giveupbootn})`)
    console.log('einstein')
    const element = await page.$(`::-p-xpath(${giveupbootn})`)
    await element.click({delay: 1000})
    
    console.log('clicked element')
    await page.waitForSelector(`::-p-xpath(${lowergiveupbootn})`)
    const mcSwag = await page.$(`::-p-xpath(${lowergiveupbootn})`)
    await mcSwag.click({delay: 1000})
    await mcSwag.click({delay: 1000})
    await delay(2000)
    await delay(5000)
  
    await page.waitForSelector(`::-p-xpath(${wingrid})`)
    const wingrids = await page.$$(`::-p-xpath(${wingrid}) > div`)
    for (let i = 0; i < 4; i++){
        const names = await wingrids[i].$eval('span', p => p.innerText);
        const imgs = await wingrids[i].$$eval('img', imgs => imgs.map(img => img.getAttribute('src')));
        console.log(names)
        for (let i = 0; i < imgs.length; i++){
            console.log(playerImgMap.get(imgs[i]));
        
        }
        
        }


    for(let i = 75; i > 0; i--){

    
   
    await page.goto(`https://connections.hoopgrids.com/archive/${i}`, {
        waitUntil: "networkidle2",
        
    });

    try{

    
    let test = await fail2(page, i);
    console.log(test)

    }
    catch (err){
        console.log(err)
    }

    }   
}




const fail2 = async (page, num) => {
    const giveupbootn = '/html/body/app-root/div/div[3]/div[2]/app-archive/app-game-board/div/div/div[8]/div[2]/button[5]'
    const lowergiveupbootn = '/html/body/div[5]/div[2]/div/mat-dialog-container/div/div/app-confirm-action/mat-dialog-content/button'
    const fullgrid = '/html/body/app-root/div/div[3]/div[2]/app-archive/app-game-board/div/div/div[2]'
    const grid1 = '/html/body/app-root/div/div[3]/div[2]/app-game/app-game-board/div/div/div[2]/div[1]'
    const grid_ = '/html/body/app-root/div/div[3]/div[2]/app-archive/app-game-board/div/div/div[2]'
    const submitButton = '/html/body/app-root/div/div[3]/div[2]/app-archive/app-game-board/div/div/div[8]/div[2]/button[3]'
    const wingrid = '/html/body/app-root/div/div[3]/div[2]/app-archive/app-game-board/div/div/div[1]'
                    

    const playerImgMap = new Map();
    await page.waitForSelector(`::-p-xpath(${fullgrid})`)
    const elements = await page.$$(`::-p-xpath(${fullgrid}) > div`)
    for (let i = 0; i < 16; i++){
    const names = await elements[i].$eval('div p', p => p.innerText);
    const img = await elements[i].$eval('div img', img => img.getAttribute('src'));
    if (playerImgMap.has(img)) {
        playerImgMap.get(img).push(names);
    } else {
        playerImgMap.set(img, [names]);
    }
    console.log(names, img)
    }
    for (let i = 1; i < 5; i++){
        await page.waitForSelector(`::-p-xpath(${fullgrid})`)
        await page.waitForSelector(`::-p-xpath(${grid_}/div[${i}])`)
        const element = await page.$(`::-p-xpath(${grid_}/div[${i}])`)
        await element.click({delay: 1000})
    }
    await page.waitForSelector(`::-p-xpath(${submitButton})`)
    const submit = await page.$(`::-p-xpath(${submitButton})`)
    await submit.click({delay: 1000})
    
    await delay(3000);
    for (let i = 4; i < 6; i++){
        await page.waitForSelector(`::-p-xpath(${fullgrid})`)
        await page.waitForSelector(`::-p-xpath(${grid_}/div[${i}])`)
        const element = await page.$(`::-p-xpath(${grid_}/div[${i}])`)
        await element.click({delay: 1000})
    }
    await page.waitForSelector(`::-p-xpath(${submitButton})`)
    const submit2 = await page.$(`::-p-xpath(${submitButton})`)
    await submit2.click({delay: 1000})
    await page.waitForSelector(`::-p-xpath(${fullgrid})`)
    await page.waitForSelector(`::-p-xpath(${giveupbootn})`)
    console.log('einstein')
    const element = await page.$(`::-p-xpath(${giveupbootn})`)
    await element.click({delay: 1000})
    
    console.log('clicked element')
    await page.waitForSelector(`::-p-xpath(${lowergiveupbootn})`)
    const mcSwag = await page.$(`::-p-xpath(${lowergiveupbootn})`)
    await mcSwag.click({delay: 1000})
    await mcSwag.click({delay: 1000})
    await delay(2000)
    await delay(5000)
  
    await page.waitForSelector(`::-p-xpath(${wingrid})`)
    const wingrids = await page.$$(`::-p-xpath(${wingrid}) > div`)
    const group = []
    for (let i = 0; i < 4; i++){
        
        let title = await wingrids[i].$eval('span', p => p.innerText);
        title = title.replace('/', ' '  )
        const imgs = await wingrids[i].$$eval('img', imgs => imgs.map(img => img.getAttribute('src')));
        let players = []
        for (let i = 0; i < imgs.length; i++){
            let player;
            if (playerImgMap.get(imgs[i]).length > 1){
                
                player = {
                    firstName: playerImgMap.get(imgs[i]),
                    lastName: `DUPLICATE ${num}`,
                    img: imgs[i]
                }
                title = `DUPLICATE${num} `+ title
            }
            else{
                let nameParts = playerImgMap.get(imgs[i])[0].split(' ');
                let firstName = nameParts[0];
                let lastName = nameParts[1];
                
                player = {
                    firstName: firstName,
                    lastName: lastName,
                    img: imgs[i]
                }
            }
           
            players.push(player);

        
        }
        group.push({title, players})
        console.log(group)
    }


        
        
    
        await publishData(group);

        
        
    return playerImgMap;

}

app.get("/test", async (req, res) => {
    console.log('we are at least in here')
    try {
        const data = 
        [
            {
              "title": "PLAYED FOR '06 HEAT",
              "players": [
                {
                  "firstName": "Jason",
                  "lastName": "Williams",
                  "img": "https://cdn.nba.com/headshots/nba/latest/1040x760/1715.png"
                },
                {
                  "firstName": "Shaquille",
                  "lastName": "O'Neal",
                  "img": "https://cdn.nba.com/headshots/nba/latest/1040x760/406.png"
                },
                {
                  "firstName": "Dwyane",
                  "lastName": "Wade",
                  "img": "https://cdn.nba.com/headshots/nba/latest/1040x760/2548.png"
                },
                {
                  "firstName": "Antoine",
                  "lastName": "Walker",
                  "img": "https://cdn.nba.com/headshots/nba/latest/1040x760/952.png"
                }
              ]
            },
            {
              "title": "SHORTEST PLAYERS OF ALL TIME 2",
              "players": [
                {
                  "firstName": "Muggsy",
                  "lastName": "Bogues",
                  "img": "https://imgix.ranker.com/user_node_img/82/1627536/original/muggsy-bogues-photo-u6?auto=format&q=60&fit=crop&fm=pjpg&dpr=2&crop=faces&h=125&w=125"
                },
                {
                  "firstName": "Spud",
                  "lastName": "Webb",
                  "img": "https://www.athletespeakers.com/storage/celebrities/1532533680_spud-webb.jpg"
                },
                {
                  "firstName": "Mel",
                  "lastName": "Hirsch",
                  "img": "https://imgix.ranker.com/user_node_img/50073/1001452870/original/mel-hirsch-photo-u1?auto=format&q=60&fit=crop&fm=pjpg&dpr=2&crop=faces&h=125&w=125"
                },
                {
                  "firstName": "Earl",
                  "lastName": "Boykins",
                  "img": "https://cdn.nba.com/headshots/nba/latest/1040x760/1863.png"
                }
              ]
            },
            {
              "title": "DRAFTED 11TH OVERALL",
              "players": [
                {
                  "firstName": "Klay",
                  "lastName": "Thompson",
                  "img": "https://cdn.nba.com/headshots/nba/latest/1040x760/202691.png"
                },
                {
                  "firstName": "Malik",
                  "lastName": "Monk",
                  "img": "https://cdn.nba.com/headshots/nba/latest/1040x760/1628370.png"
                },
                {
                  "firstName": "Shai",
                  "lastName": "Gilgeous-Alexander",
                  "img": "https://cdn.nba.com/headshots/nba/latest/1040x760/1628983.png"
                },
                {
                  "firstName": "Domantas",
                  "lastName": "Sabonis",
                  "img": "https://cdn.nba.com/headshots/nba/latest/1040x760/1627734.png"
                }
              ]
            },
            {
              "title": "BORN ON CHRISTMAS",
              "players": [
                {
                  "firstName": "Chris",
                  "lastName": "Richard",
                  "img": "https://floridagators.com/images/2006/1/1/_basketball_men_images_bioimg2006_10.jpg"
                },
                {
                  "firstName": "Eric",
                  "lastName": "Gordon",
                  "img": "https://cdn.nba.com/headshots/nba/latest/1040x760/201569.png"
                },
                {
                  "firstName": "Markquis",
                  "lastName": "Nowell",
                  "img": "https://cdn.nba.com/headshots/nba/latest/1040x760/1641806.png"
                },
                {
                  "firstName": "Bernie",
                  "lastName": "Fryer",
                  "img": "https://upload.wikimedia.org/wikipedia/commons/d/d9/Bernie_Fryer.png"
                }
              ]
            }
            
          ]
        
        await publishData(data);
        res.json({message: 'success'});
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
    console.log(playerMap)
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
        let players = imgs.map(img => {
            let player = playerMap.get(img);
            return {
              firstName: player.firstName,
              lastName: player.lastName,
              img: img
            };
          });
        const title = await success[i].$eval('h2', i => i.innerText);
        data.push({title, players});
    }
    
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
    let playerMap = new Map();

   
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
        await page.screenshot({path: `${i}screenshot_before_toggle_in_loop.png`});
        await toggle.click({delay: 1000});
        await page.screenshot({path: `${i}screenshot_after_toggle_in_loop.png`});
        await delay(60000);
        await page.screenshot({path: `waiting_for_player_${i}.png`});
        await page.waitForSelector(playerSelector);

        
        
        await page.waitForSelector('.card-img');
        const img = await players[i].$eval('.card-img', img => img.getAttribute('src'));
        console.log(`image for player ${i} is ${img}`)
        await toggle.click({delay: 1000});
        playerMap.set(img, {firstName, lastName});
        
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
