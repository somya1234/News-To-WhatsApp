let puppeteer = require("puppeteer");

let names = ["mygroup","mommy","sanuj"]
// let output = arguments[0];
module.exports.sendMessage = function(){
    console.log("we are in send message function.");
    console.log("*************************");
    sendMessage(arguments[0]);
}
async function sendMessage(output) {
    let browser = await puppeteer.launch({
        headless: false,
        userDataDir: '~/.config/google-chrome',
        args:["--start-maximized"],
        
        defaultViewport:null
        // slowMo:20
    });
    let pages = await browser.pages();
    let page = pages[0];
    await page.setDefaultNavigationTimeout(0);
    await page.goto("https://web.whatsapp.com/", { waitUntil: "networkidle2" });
    /***************search the name**************************** */
    for(let i=0;i<names.length;i++){
        await page.waitForSelector("._2S1VP",{timeout:0});
        await page.type("._2S1VP",names[i]);
     /********************search alternative************************ */
    await page.keyboard.press("Enter");
    /***************type message ***************************** */
    await page.waitForSelector("._1Plpp",{visible:true});
    let messgae = `Hhello ${names[i]}, how are you? 
                    Here, is the top5 news .
                    *News1* -> ${output[0][0]}
                    _Brief about the news_ -> 
                    ${output[0][1]}
                    **************************************************
                    *News2* -> ${output[1][0]}
                    _Brief about the news_ -> 
                    ${output[1][1]}
                    **************************************************
                    *News3* -> ${output[2][0]}
                    _Brief about the news_ -> 
                    ${output[2][1]}
                    **************************************************
                    *News4* -> ${output[3][0]}
                    _Brief about the news_ -> 
                    ${output[3][1]}
                    **************************************************
                    *News5* -> ${output[4][0]}
                    _Brief about the news_ -> 
                    ${output[4][1]}
                    **************************************************
                    I hope it was useful reading for you.
                    ❤️❤️
                    `
    await page.type("._1Plpp",messgae);
    await page.keyboard.press("Enter");
     }
     
    console.log("connected successfully")
    
}

// npm install puppeteer-core
// npm install