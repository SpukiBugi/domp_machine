// ==UserScript==
// @name     Скрипт БезИмени 843191
// @version  1
// @grant    none
// ==/UserScript==

console.log('userScr');

const execute = () => {
  console.log('start');
  const block = document.createElement("div");
  document.body.append(block);
  const string = `
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

      .block-item:not(:first-child) {
        margin-top: 16px
      }
		</style>
		<div class="control-block">
      <div class="half-block">
        <div class="js-buy-start block-item btn-auto">
          buy
        </div>
        <input class="js-buy-input block-item" type="text" id="buy" name="buy" placeholder="names separated by ;" />
        <input class="js-buy-amount block-item" type="text" id="amount" name="amount" placeholder="amounts separated by ;" />

        <div class="js-buy-stop block-item btn-auto">
        stop buy
        </div>
      </div>
      <div  class="half-block">
        <div class="js-sell-start block-item btn-auto">
          sell
        </div>
        <input class="js-sell-input block-item" type="text" id="sell" name="sell" placeholder="names separated by ;" />
        <input class="js-sell-amount block-item" type="text" id="amount" name="amount" placeholder="amounts separated by ;" />

        <div class="js-sell-stop block-item btn-auto">
        stop sell
        </div>
      </div>
		</div>
	`;
  
  block.innerHTML = string;
  
  const starts = {
    buy: document.querySelector('.js-buy-start'),
    sell: document.querySelector('.js-sell-start')
  };

  const stops = {
    buy: document.querySelector('.js-buy-stop'),
    sell: document.querySelector('.js-sell-stop')
  };

  const inputs = {
    buy: document.querySelector('.js-buy-input'),
    sell: document.querySelector('.js-sell-input')
  };

  const amountInputs = {
    buy: document.querySelector('.js-buy-amount'),
    sell: document.querySelector('.js-sell-amount')
  };

  const flags = {
    buy: false,
    sell: false,
  };

  const urls = {
    buy: 'https://nasfaq.biz/api/buyCoin/',
    sell: 'https://nasfaq.biz/api/sellCoin/',
  };

  const intervals = {
    buy: null,
    sell: null,
  };

  for (const key in starts) {
      starts[key].addEventListener('click', () => {startHandler(key)});
      stops[key].addEventListener('click', () => {stopHandler(key)});
  }

  async function startHandler(operation) {
    if (flags[operation]) return;
    flags[operation] = true;
    
    const coins = inputs[operation].value.split(';');
    const amounts = amountInputs[operation].value.split(';');
    console.log(operation, coins);
    
  	const sendReq = async (coin) => {
    	console.log('req', coin);
      const data = {coin: coin};
      
      await fetch(urls[operation], {
      	method: 'POST',
       	body: JSON.stringify(data),
       	"credentials": "include",
      })
      .then(response => response.json())
      .then(data => console.log('succ' + operation, data))
      .catch(err => console.log('err ' + operation, err));
    };
    
    for (let i = 0; i < coins.length; i++) {
      await sendReq(coins[i]);

      amounts[i]--;
		}
    
    intervals[operation] = setInterval(async () => {
      if (!amounts.find(el => el > 0)) {
        clearInterval(intervals[operation]);
        flags[operation] = false;
      	return;
      }
      
      for (let i = 0; i < coins.length; i++) {
        if (amounts[i] > 0) {
          await sendReq(coins[i]);
          amounts[i]--;
        }
      }
    }, 605000)
  }

  function stopHandler(operation) {
    flags[operation] = false;
    
    if (intervals[operation]) {
      clearInterval(intervals[operation]);
    }
  }
}

execute();

// document.addEventListener('DOMContentLoaded', () => {
//   console.log('domread');
// });
