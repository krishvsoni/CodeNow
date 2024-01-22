import requests
# CodeNow - Share & Compile
url = "https://codenow.vercel.app/"

payload = {}
headers = {}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)
