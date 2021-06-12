// ==UserScript==
// @name     Скрипт БезИмени 843191
// @version  1
// @grant    none
// ==/UserScript==

console.log('userScr');


const execute = () => {
  console.log('start');
  let block = document.createElement("div");
  document.body.append(block);
  let string = `
		<style>
			.control-block {
				display: flex;
				justify-content: space-between;
        z-index: 1;
        position: fixed;
        background-color: white;
        width: 340px;
        top: 200px;
        left: 150px;
        padding: 20px;
				box-sizing: border-box;
			}

			.half-block {
				display: flex;
				flex-direction: column;
				width: calc(50% - 10px)
			}

			.btn-auto {
        width: 100%;
        border: 1px solid black;
        padding: 12px;
        cursor: pointer;
				box-sizing: border-box;
      }

			.input-auto {
				margin: 16px 0;
			}
		</style>
		<div class="control-block">
      <div class="half-block">
        <div class="js-buy-start btn-auto">
          buy
        </div>
        <input class="js-buy-input input-auto" type="text" id="buy" name="buy" placeholder="names separated by ;" />

        <div class="js-buy-stop btn-auto">
        stop buy
        </div>
      </div>
      <div  class="half-block">
        <div class="js-sell-start btn-auto">
          sell
        </div>
        <input class="js-sell-input input-auto" type="text" id="sell" name="sell" placeholder="names separated by ;" />

        <div class="js-sell-stop btn-auto">
        stop sell
        </div>
      </div>
		</div>



	`;
  
  block.innerHTML = string;
  
  let buyInterval;
  let sellInterval
  
  let buyStart = document.querySelector('.js-buy-start');
  let sellStart = document.querySelector('.js-sell-start');
  let buyInput = document.querySelector('.js-buy-input');
  let sellInput = document.querySelector('.js-sell-input');
  
  let buyUrl = 'https://nasfaq.biz/api/buyCoin/';
  let sellUrl = 'https://nasfaq.biz/api/sellCoin/';
  
  let buyingFlag = false;
  let sellingFlag = false;
  
  buyStart.addEventListener('click', async () => {
    if (buyingFlag) return;
    buyingFlag = true;
    console.log('buyCl', buyInput);
    
    let buyCoins = buyInput.value.split(';');
    console.log('buyCl', buyCoins);
    
  	let sendReq = async (coin) => {
    	console.log('buy', coin);
      let data = {coin: coin};
      
      await fetch(buyUrl, {
      	method: 'POST',
       	body: JSON.stringify(data),
       	"credentials": "include",
       	"headers": {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
          "Accept": "*/*",
          "Accept-Language": "ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3",
          "Content-Type": "application/json"
    		},
      })
      .then(response => response.json())
      .then(data => console.log('sucB', data))
      .catch(err => console.log('errB', err));
    };
    
    
    for (const el of buyCoins) {
      await sendReq(el);
    }
  	
    buyInterval = setInterval(() => {
      for (const el of buyCoins) {
        await sendReq(el);
      }
    }, 605000)
  });
  
  sellStart.addEventListener('click', async () => {
    if (sellingFlag) return;
    sellingFlag = true;
    
    let sellCoins = sellInput.value.split(';');
    console.log('sellCl', sellCoins);
    
  	let sendReq = async (coin) => {
      let data = {coin: coin};
    	console.log('sell', coin);
      
      await fetch(sellUrl, {
      	method: 'POST',
        body: JSON.stringify(data),
        "credentials": "include",
        "headers": {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
          "Accept": "*/*",
          "Accept-Language": "ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3",
          "Content-Type": "application/json"
    		},
      })
      .then(response => response.json())
      .then(data => console.log('sucS', data))
      .catch(err => console.log('errS', err));
    };
    
    for (const el of sellCoins) {
      await sendReq(el);
    }
  	
    sellInterval = setInterval(() => {
      for (const el of sellCoins) {
        await sendReq(el);
      }
    }, 605000)
  });
  
  
  
  const stopBuy = document.querySelector('.js-buy-stop');  
  const stopSell = document.querySelector('.js-sell-stop');

  stopBuy.addEventListener('click', () => {
    buyingFlag = false;
    
    if (buyInterval) {
      clearInterval(buyInterval);
    }
  });

  stopSell.addEventListener('click', () => {
    sellingFlag = false;
    
    if (sellInterval) {
      clearInterval(sellInterval);
    }
  });
}

execute();

// document.addEventListener('DOMContentLoaded', () => {
//   console.log('domread');
// });
