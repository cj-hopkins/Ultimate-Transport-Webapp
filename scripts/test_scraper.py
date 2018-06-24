import requests

def main():
    stop_id = "564"
    url = "https://data.smartdublin.ie/cgi-bin/rtpi/realtimebusinformation?stopid={}&format=json".format(stop_id)
    result = requests.get(url)
    result = result.json()
    return result

print(main())
