// ==UserScript==
// @name     Скрипт Nasfaq
// @version  1
// @grant    none
// ==/UserScript==

const execute = () => {
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
				overflow: hidden;
				box-sizing: border-box;
			}

			.control-block._min {
				width: 40px;
				height: 40px;
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

			.expander {
				position: absolute;
				top: 0;
				left: 0;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 20px;
				height: 20px;
				font-size: 24px;
				cursor: pointer;
			}
		</style>
		<div class="control-block js-control-block">
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

			<div class="js-expander expander">-</div>
		</div>
	`;
  
  block.innerHTML = string;
  
  const controlBlock = block.querySelector('.js-control-block');

  const operations = [
    {
      name: 'buy',
      startBtn: block.querySelector('.js-buy-start'),
      stopBtn: block.querySelector('.js-buy-stop'),
      input: block.querySelector('.js-buy-input'),
      amountInput: block.querySelector('.js-buy-amount'),
      active: false,
      url: 'https://nasfaq.biz/api/buyCoin/',
      interval: null
    },

    {
      name: 'sell',
      startBtn: block.querySelector('.js-sell-start'),
      stopBtn: block.querySelector('.js-sell-stop'),
      input: block.querySelector('.js-sell-input'),
      amountInput: block.querySelector('.js-sell-amount'),
      active: false,
      url: 'https://nasfaq.biz/api/sellCoin/',
      interval: null
    }
  ];
  
  activateExpander();

  operations.forEach(el => {
    el.startBtn.addEventListener('click', () => {startHandler(el)});
    el.stopBtn.addEventListener('click', () => {stopHandler(el)});
  });

  async function startHandler(operation) {
    if (operation.active) return;
    operation.active = true;
    
    const coins = operation.input.value.split(';');
    const amounts = operation.amountInput.value.split(';');
    
  	const sendReq = async (coin) => {
      const data = {coin: coin};
      
      await fetch(operation.url, {
      	method: 'POST',
       	body: JSON.stringify(data),
       	"credentials": "include",
      })
      .then(response => response.json())
      .then(data => console.log('succ' + operation.name, data))
      .catch(err => console.log('err ' + operation.name, err));
    };
    
    for (let i = 0; i < coins.length; i++) {
      await sendReq(coins[i]);
      amounts[i]--;
		}
    
    operation.interval = setInterval(async () => {
      if (!amounts.find(el => el > 0)) {
        clearInterval(operation.interval);
        operation.active = false;
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
    operation.active = false;
    
    if (operation.interval) {
      clearInterval(operation.interval);
    }
  }
  
  
  function activateExpander() {
  	const expander = block.querySelector('.js-expander');
    
    const expanderClick = () => {
    	if (expander.classList.contains('_min')) {
      	expander.classList.remove('_min');
      	expander.innerHTML = '-';
        controlBlock.classList.remove('_min');
      } else {
      	expander.classList.add('_min');
      	expander.innerHTML = '+';
        controlBlock.classList.add('_min');
      }
    }
    
    expander.addEventListener('click', expanderClick);
  }
}

execute();

// document.addEventListener('DOMContentLoaded', () => {
//   console.log('domread');
// });
