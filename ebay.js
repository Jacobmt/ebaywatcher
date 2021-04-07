const playwright = require('playwright');
const fs = require('fs')
var random = require('random-name')
var figlet = require('figlet');
const chalk = require('chalk');
var inquirer = require('inquirer');


var isheadless = true




var catchAll = 'ebaywatcherman.com'
var passWord = 'pD-ZT4aB3%28jz&e'


console.log(
  chalk.yellowBright(
      figlet.textSync('EbayWatcher', {horizontalLayout: 'fitted' })
  )
)
console.log(
  chalk.blue('powered by Jake$')
)
console.log(
  chalk.grey('--------------------------------------------------------------------------')
)


start()
function start(){

  inquirer.prompt([
    {
        type: 'input',
        name: 'ebayLink',
        message: chalk.blue('Please enter ebay link to watch:'),    
    }
  ]).then(answers => {
    var ebayLink = answers.ebayLink
    inquirer.prompt([
      {
          type: 'input',
          name: 'howmanyWatchers',
          message: chalk.blue('Please enter how many watchers you want added:'),    
      }
    ]).then(answers => {

      var howmanyWatchers = answers.howmanyWatchers

      getProxy(ebayLink,howmanyWatchers)

    })

  })


}

var i = 1
var browser;
var proxy;
function  getProxy(ebayLink,howmanyWatchers){

    console.log('Adding watchers...')
fs.readFile('./proxies.txt', function(err, data){
    var proxyNum = Math.floor(Math.random() * data.toString().split("\n").length);  

    proxy = {
            host: data.toString().split("\n")[proxyNum].split(':')[0],
            port: data.toString().split("\n")[proxyNum].split(':')[1],
            username: data.toString().split("\n")[proxyNum].split(':')[2],
            password:data.toString().split("\n")[proxyNum].split(':')[3]
        }



    //'http://my-user:my-pass@proxy-url:port'


    signIn(proxy,ebayLink,howmanyWatchers)
})
}


async function signIn(proxy,ebayLink,howmanyWatchers){
    try {
  //console.log(proxy)
  if(proxy.password == undefined){
    browser = await playwright['firefox'].launch({
      headless: isheadless,
      proxy: {
        server: `http://${proxy.host}:${proxy.port}`,
      }
  });
  }else{
      browser = await playwright['firefox'].launch({
        headless: isheadless,
        proxy: {
          server: `http://${proxy.host}:${proxy.port}`,
          username: proxy.username,
          password: proxy.password
        }
    });
  }


    const context = await browser.newContext({
       timezoneId: 'America/New_York',
    });
    
    
    await context.grantPermissions(['geolocation']);
    context.clearCookies()
  
    
    const page = await context.newPage()

    await page.addInitScript(() => {
         // store the existing descriptor
         const elementDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');
         
         // redefine the property with a patched descriptor
         Object.defineProperty(HTMLDivElement.prototype, 'offsetHeight', {
           ...elementDescriptor,
           get: function() {
             if (this.id === 'modernizr') {
                 return 1;
             }
             return elementDescriptor.get.apply(this);
           },
         });

         ['height', 'width'].forEach(property => {
             // store the existing descriptor
             const imageDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, property);
           
             // redefine the property with a patched descriptor
             Object.defineProperty(HTMLImageElement.prototype, property, {
               ...imageDescriptor,
               get: function() {
                 // return an arbitrary non-zero dimension if the image failed to load
                 if (this.complete && this.naturalHeight == 0) {
                   return 20;
                 }
                 // otherwise, return the actual dimension
                 return imageDescriptor.get.apply(this);
               },
             });
           });

           const originalQuery = window.navigator.permissions.query;
           return window.navigator.permissions.query = (parameters) => (
             parameters.name === 'notifications' ?
               Promise.resolve({ state: Notification.permission }) :
               originalQuery(parameters)
           );

    })

    await page.goto('https://reg.ebay.com/reg/PartialReg', {timeout: 150000})

    var myFunc = function() { 
        console.log('Captcha found! Changing proxy...')
        newPage() 
    };
    await page.exposeFunction("myFunc", myFunc); 
    await page.evaluate(() => {
        if(document.querySelector('#areaTitle > h1:nth-child(1)') == null){
            return true
        }else{
            myFunc()
            return true
        }
    })

    var randomFirst = random.first()
    var randomLast = random.first()

    await page.waitForTimeout(3000)

    await page.type('#firstname',random.first())
    await page.type('#lastname',random.last())
    await page.type('#Email',`${randomFirst+randomLast+Math.floor(Math.random() * 99999) + 1000}@${catchAll}`)
    await page.type('#password',passWord)

    await page.waitForTimeout(7000)

    await page.click('#EMAIL_REG_FORM_SUBMIT')

    await page.waitForTimeout(5000)
    await page.goto(ebayLink, {timeout: 150000})

    await page.click('#vi-atl-lnk > a:nth-child(1) > span:nth-child(2)')

    await page.waitForTimeout(5000)
    console.log('Watchers added: '+i)
    newPage()

    function newPage(){
        if(i==1&&howmanyWatchers==1){
            console.log("Watchers have been added. You're very welcome.")
        }else if(i+1==howmanyWatchers){
            console.log("Watchers have been added. You're very welcome.")
        }else{
          i++
          browser.close()
          getProxy(ebayLink,howmanyWatchers)
        }
    }
}
catch (e) {}
}