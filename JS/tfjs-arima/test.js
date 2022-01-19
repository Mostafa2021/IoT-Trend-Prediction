const tf = require("@tensorflow/tfjs");
const { ARIMA } = require("./arima");

// 1-D Time Series Dataset
const X = [
    35, 32, 30, 31, 44, 29, 45, 43, 38, 27, 38, 33, 55, 47, 45, 37, 50,
    43, 41, 52, 34, 53, 39, 32, 37, 43, 39, 35, 44, 38, 24, 23, 31, 44,
    38, 50, 38, 51, 31, 31, 51, 36, 45, 51, 34, 52, 47, 45, 46, 39, 48,
    37, 35, 52, 42, 45, 39, 37, 30, 35, 28, 45, 34, 36, 50, 44, 39, 32,
    39, 45, 43, 39, 31, 27, 30, 42, 46, 41, 36, 45, 46, 43, 38, 34, 35,
    56, 36, 32, 50, 41, 39, 41, 47, 34, 36, 33, 35, 38, 38, 34, 53, 34,
    34, 38, 35, 32, 42, 34, 46, 30, 46, 45, 54, 34, 37, 35, 40, 42, 58,
    51, 32, 35, 38, 33, 39, 47, 38, 52, 30, 34, 40, 35, 42, 41, 42, 38,
    24, 34, 43, 36, 55, 41, 45, 41, 37, 43, 39, 33, 43, 40, 38, 45, 46,
    34, 35, 48, 51, 36, 33, 46, 42, 48, 34, 41, 35, 40, 34, 30, 36, 40,
    39, 45, 38, 47, 33, 30, 42, 43, 41, 41, 59, 43, 45, 38, 37, 45, 42,
    57, 46, 51, 41, 47, 26, 35, 44, 41, 42, 36, 45, 45, 45, 47, 38, 42,
    35, 36, 39, 45, 43, 47, 36, 41, 50, 39, 41, 46, 64, 45, 34, 38, 44,
    48, 46, 44, 37, 39, 44, 45, 33, 44, 38, 46, 46, 40, 39, 44, 48, 50,
    41, 42, 51, 41, 44, 38, 68, 40, 42, 51, 44, 45, 36, 57, 44, 42, 53,
    42, 34, 40, 56, 44, 53, 55, 39, 59, 55, 73, 55, 44, 43, 40, 47, 51,
    56, 49, 54, 56, 47, 44, 43, 42, 45, 50, 48, 43, 40, 59, 41, 42, 51,
    49, 45, 43, 42, 38, 47, 38, 36, 42, 35, 28, 44, 36, 45, 46, 48, 49,
    43, 42, 59, 45, 52, 46, 42, 40, 40, 45, 35, 35, 40, 39, 33, 42, 47,
    51, 44, 40, 57, 49, 45, 49, 51, 46, 44, 52, 45, 32, 46, 41, 34, 33,
    36, 49, 43, 43, 34, 39, 35, 52, 47, 52, 39, 40, 42, 42, 53, 39, 40,
    38, 44, 34, 37, 52, 48, 55, 50
];

// Train-Test Split 
const trainSize = parseInt(0.8 * X.length);
const xTrain = X.slice(0, trainSize);
const xTest = X.slice(-1 * (X.length - trainSize));

// ARIMA Model Params
let params = {
    epochs: 2500,
    batchSize: parseInt(0.2 * xTrain.length),
    validationSplit: .2,
    callbacks: tf.callbacks.earlyStopping({ 
      monitor: 'val_loss', 
      patience: 3 
    }),
    shuffle: false,
    verbose: 1
};
let learningRate = 1e-2;

// ARIMA model instance
let arima = ARIMA(2, 2, 2);

console.time("Total Fit Time");

// Start ARIMA training
arima.fit(xTrain, params, learningRate).then((modelFit) => {
    console.log(`ARIMA(${arima.p}, ${arima.d}, ${arima.q}) Summary:\n----------------------`);
    console.timeEnd("Total Fit Time");
    console.log("AR stopped training after just: #", modelFit.history.loss.length, "epochs");
    
    // Start ARIMA forecasting
    return arima.predict(xTest.length);
}).then(preds => {
    console.time("Total Predict Time");
    console.log(
        "\nActual Test Data Sample:",
        xTest.slice(0, 5),
        "\nPredictions Sample:",
        preds.slice(0, 5)
    );
    console.timeEnd("Total Predict Time");
    
    // Start ARIMA evaluation
    console.log(
        "\nPrediction MSE Loss: ",
        arima.evaluate(xTest, preds, tf.metrics.meanSquaredError).mean().arraySync()
    );
}).catch(err =>
    console.error(err)
);
