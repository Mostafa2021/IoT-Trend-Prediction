#! /usr/bin/env node
/**
 *
 */
// "use strict";

const tf = require("@tensorflow/tfjs");
const { AR } = require("./arima");

let X = tf.linspace(1, 50, 50).arraySync();
let arima = AR(2);
let params = {
    epochs: 8192,
    batchSize: 10,
    validationSplit: .2,
    shuffle: false
};
arima.fit(X, params).then(() => {
    console.log(arima.predictSync(Array(5)));
}).catch(err =>
    console.error(err)
);