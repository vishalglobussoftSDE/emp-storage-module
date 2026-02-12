import requests
from requests.auth import HTTPBasicAuth

APP_KEY = 'liy3zijm20uajb4'        # Replace with your App Key
APP_SECRET = 'vipfmmd7rb5pks1'     # Replace with your App Secret
CODE = 'Xtaoj0jfW7kAAAAAAAAAKMPiboHkBny9nX-kSpfUpAI'  # Replace with your authorization code
REDIRECT_URI = 'http://localhost'

response = requests.post(
    'https://api.dropboxapi.com/oauth2/token',
    auth=HTTPBasicAuth(APP_KEY, APP_SECRET),
    data={
        'code': CODE,
        'grant_type': 'authorization_code',
        'redirect_uri': REDIRECT_URI
    }
)

print(response.json())
