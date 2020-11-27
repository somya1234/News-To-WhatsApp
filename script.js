let output = [];

let cheerio = require("cheerio");
let request = require("request");
let puppeteer = require("puppeteer");
let whatsapp = require("./whatsapp");

console.log("*sending request*");

async function takeScreenshot(url,idx,browser){
    console.log("in take screenshot fuction");
    let page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.goto(url);
    await page.waitForSelector(".Normal",{timeout:0});
    let ele = await page.$(".clearfix.title");
    await page.evaluate(function(el){
        return el.scrollIntoView()
    },ele);
    await page.screenshot({path:`${idx}.png`});
    console.log("screenshot taken");
}

request("https://economictimes.indiatimes.com/news/latest-news/most-shared",function(err,res,html){
    if(err==null && res.statusCode==200){
        console.log("Received Data");
        parseHtml(html);
    } else if(res.statusCode == 404){
        console.log("Invalid URL");
    } else{
        console.log(err);
        console.log(res.statusCode);
    }
});

let idx = 0;

async function parseHtml(html){
    let $ = cheerio.load(html);
    let cards = $(".data li a");
    //taking 5 news out 
    let arr = [];
    let browser = await puppeteer.launch({headless:false,
        args:["--no-sandbox", "--disable-setuid-sandbox","--start-maximized","--disable-notifications"],
        defaultViewport:null});
        for(let i=0;i<5;i++){
            let newsObj = [];
            let heading = $(cards[i]).text();
            newsObj[0] = heading;       
            let link = $(cards[i]).attr("href");
            let postLink = `https://economictimes.indiatimes.com${link}`;
            console.log(postLink);
            console.log(newsObj)
            // let ele = takeScreenshot(postLink,idx,browser);
            // arr.push(ele);
            goToEachPost(postLink,newsObj);
            idx++;
        }
        await Promise.all(arr);
        await browser.close();
}

function goToEachPost(postLink,newsObj){
    request(postLink,function(err,res,html){
        if(err==null && res.statusCode==200){
            handleNews(html,newsObj);
        } else if(res.statusCode==404){
            console.log("Invalid Url");
        } else {
            console.log(err);
        }
    })
}
let count = 0;
async function handleNews(html,newsObj){
    count++;
    let $ = cheerio.load(html);
    let content = $(".artSyn.tac.font_mon p").text(); 
    if(content==""){
        content+=$(".artSyn h2").text();
    }
    console.log(content);
    // let content = $(".Normal").html().split("<br>")[0];
    // content += $(".Normal").html().split("<br>")[1];
    // content += $(".Normal").html().split("<br>")[2];
    // content = $(content).text().replace(/\n/g,'');
    newsObj[1] = content;
    output.push(newsObj);
    if(count == 5){
        console.log(output);
        whatsapp.sendMessage(output);
    }
    console.log("content achieved");
}

console.log("*parsing html*");