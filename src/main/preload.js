const { getAveragePrice } = require('../helpers/api');
const Chart = require('chart.js');

window.addEventListener('DOMContentLoaded', async () => {

    const table = document.getElementById('table-body');
    const list = document.getElementById('list');
    const inputUSD = document.getElementById('usd');
    const inputBTC = document.getElementById('btc');
    const chart = document.getElementById('chart').getContext('2d');

    const graph = new Chart(chart, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'BTC',
                data: [],
                borderColor: 'green'
            }, {
                label: 'MA30m',
                data: [],
                borderColor: 'red',
            }]
        },
        options: {
            scales: {
            }
        }
    });



    let counter = 0;
    let halfMobile = 0;
    let prices = [];
    let averagePrice = 0;
    let roundedAveragePrice = 0;
    let minValue = Infinity;
    let maxValue = 0;
    let usd = 100;
    let btc = 0;
    let state = 'buy';
    let MA30m = 0;

    const render = async () => {
        averagePrice = (await getAveragePrice()).price;
        roundedAveragePrice = Math.round(averagePrice / 100) * 100;

        counter++;
        if (!prices[roundedAveragePrice]) prices[roundedAveragePrice] = { counter: 0, percentage: 0 };
        prices[roundedAveragePrice].price = roundedAveragePrice;
        prices[roundedAveragePrice].counter++;

        //set halfMobile
        MA30m = counter > 1800 ? 60 : counter;
        halfMobile = ((halfMobile * (MA30m - 1)) + parseFloat(averagePrice)) / MA30m;
        const averageHalfMobile = Math.round(halfMobile / 100) * 100;

        //set max value
        if (averagePrice > maxValue) maxValue = roundedAveragePrice;

        //set min value
        if (averagePrice < minValue) minValue = roundedAveragePrice;

        //make transaction
        const distance = averageHalfMobile - roundedAveragePrice;
        const percentageDistance = (halfMobile / averagePrice) - 1;

        console.log(percentageDistance);


        //Buy by percentage distance
        if (percentageDistance >= 0.1 && state == 'buy') {
            state = 'sell';
            btc = (usd * 0.999) * averagePrice;
            list.innerHTML += `<li class="list-group-item">Se compraron ${btc} btc a ${averagePrice} usd</li>`;
            usd = 0;
        }
        if (percentageDistance <= 0.1 && state == 'sell') {
            state = 'buy';
            usd = (btc * 0.999) * averagePrice;
            list.innerHTML += `<li class="list-group-item">Se vendieron ${btc} btc a ${averagePrice} usd</li>`;
            btc = 0;
        }

        // Buy by range
        // if (distance > 500 && state == 'buy') {
        //     state = 'sell';
        //     btc = usd * averagePrice;
        //     list.innerHTML += `<li class="list-group-item">Se compraron ${btc} btc a ${averagePrice} usd</li>`;
        //     usd = 0;
        // }
        // if (distance <= 0 && state == 'sell') {
        //     state = 'buy';
        //     usd = btc * averagePrice;
        //     list.innerHTML += `<li class="list-group-item">Se vendieron ${btc} btc a ${averagePrice} usd</li>`;
        //     btc = 0;
        // }

        console.log();

        let html = '';

        Object.keys(prices).sort((a, b) => b - a).forEach(price => {

            html += `<tr><td>${price}</td><td>${price == averageHalfMobile ? '<--' : ''}</td><td>${roundedAveragePrice == price ? '<--' : ''}</td></tr>`;

        });

        table.innerHTML = html;
        inputUSD.value = usd;
        inputBTC.value = btc;

        //update chart
        // if (counter % 5 == 0) {
        const date = new Date();
        graph.data.labels.push('');
        graph.data.datasets[0].data.push(averagePrice);
        graph.data.datasets[1].data.push(halfMobile);

        if (graph.data.datasets[0].data.length > 60) {
            graph.data.labels.shift();
            graph.data.datasets[0].data.shift();
            graph.data.datasets[1].data.shift();
        }
        graph.update();
        // }
    };


    setInterval(render, 1000);

});