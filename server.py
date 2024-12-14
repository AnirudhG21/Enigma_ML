from flask import Flask, request, jsonify, render_template, send_file
import joblib
import numpy as np
import requests
import pandas as pd
import matplotlib.pyplot as plt
import io
import os

app = Flask(__name__)

# Load the model and scaler
model_long = joblib.load(r'D:/NIRVANA/flask-server/model_scaler/xgb_model_long.pkl')
scaler = joblib.load(r'D:/NIRVANA/flask-server/model_scaler/scaler.pkl')
model_short = joblib.load(r'D:/NIRVANA/flask-server/model_scaler/xgb_model_short.pkl')

# Function to fetch and preprocess stock data
def fetch_stock_data(symbol, api_key):
    url = f'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&apikey={api_key}'
    response = requests.get(url)
    data = response.json()
    
    # Check for errors in the response
    if 'Time Series (Daily)' not in data:
        raise ValueError(data.get('Note', 'Unexpected response format from Alpha Vantage'))

    # Create DataFrame for processing
    df = pd.DataFrame.from_dict(data['Time Series (Daily)'], orient='index', dtype=float)
    df = df.rename(columns={
        '1. open': 'open',
        '2. high': 'high',
        '3. low': 'low',
        '4. close': 'close',
        '5. volume': 'volume'
    })
    df = df.sort_index()

    # Calculate additional features
    df['5_day_ma'] = df['close'].rolling(window=5).mean()
    df['10_day_ma'] = df['close'].rolling(window=10).mean()
    df['20_day_ma'] = df['close'].rolling(window=20).mean()

    df['change'] = df['close'].diff()
    df['gain'] = df['change'].apply(lambda x: x if x > 0 else 0)
    df['loss'] = df['change'].apply(lambda x: -x if x < 0 else 0)
    df['avg_gain'] = df['gain'].rolling(window=14).mean()
    df['avg_loss'] = df['loss'].rolling(window=14).mean()
    df['rs'] = df['avg_gain'] / df['avg_loss']
    df['rsi'] = 100 - (100 / (1 + df['rs']))

    df['26_ema'] = df['close'].ewm(span=26, adjust=False).mean()
    df['12_ema'] = df['close'].ewm(span=12, adjust=False).mean()
    df['macd'] = df['12_ema'] - df['26_ema']

    return df

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    symbol = data.get('symbol')
    api_key = data.get('api_key')

    try:
        # Fetch and preprocess the stock data
        df = fetch_stock_data(symbol, api_key)
        latest_data = df.iloc[-1]

        features = [
            latest_data['open'],
            latest_data['high'],
            latest_data['low'],
            latest_data['close'],
            latest_data['volume'],
            latest_data['5_day_ma'],
            latest_data['10_day_ma'],
            latest_data['20_day_ma'],
            latest_data['rsi'],
            latest_data['macd']
        ]
        
        # Convert features to a numpy array and scale it
        data_array = np.array(features).reshape(1, -1)
        scaled_data = scaler.transform(data_array)

        # Predict using the model
        prediction = model.predict(scaled_data)

        # Generate chart
        img = io.BytesIO()
        plt.figure(figsize=(10, 5))
        plt.plot(df.index, df['close'], label='Close Price')
        plt.plot(df.index, df['5_day_ma'], label='5 Day MA')
        plt.plot(df.index, df['10_day_ma'], label='10 Day MA')
        plt.plot(df.index, df['20_day_ma'], label='20 Day MA')
        plt.legend()
        plt.title(f'Stock Prices for {symbol}')
        plt.savefig(img, format='png')
        img.seek(0)

        return send_file(img, mimetype='image/png')
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

from flask import Flask, jsonify, request, send_file
import joblib
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import io
import os

app = Flask(__name__)

# Load the model and scaler
model = joblib.load(os.path.join('model_scaler', 'best_xgb_model.pkl'))
scaler = joblib.load(os.path.join('model_scaler', 'scaler.pkl'))

def preprocess_data(data):
    # Implement your preprocessing steps
    return data

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        content = request.get_json()
        data = content['data']  # Adjust this based on your input format
        data = preprocess_data(data)
        
        # Use the model to make predictions
        predictions = model.predict(data)

        # Generate the graph
        plt.figure(figsize=(10, 6))
        plt.plot(predictions, label='Predictions')
        plt.title('Model Predictions')
        plt.legend()

        img = io.BytesIO()
        plt.savefig(img, format='png')
        img.seek(0)

        return send_file(img, mimetype='image/png')

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
