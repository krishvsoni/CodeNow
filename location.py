from flask import Flask, jsonify
import requests

app = Flask(__name__)

@app.route('/get_location')
def get_location():
    try:
        latitude = float(request.args.get('lat'))
        longitude = float(request.args.get('lon'))

        opencage_api_key = 'YOUR_OPENCAGE_API_KEY'
        opencage_url = f'https://api.opencagedata.com/geocode/v1/json?q={latitude}+{longitude}&key={opencage_api_key}'

        response = requests.get(opencage_url)
        data = response.json()

        if 'results' in data and data['results']:
            address = data['results'][0]['formatted']
            return jsonify({'address': address})

        return jsonify({'error': 'Unable to fetch address'})

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
