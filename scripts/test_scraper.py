import requests

def main():
    stop_id = "3543"
    url = "https://data.smartdublin.ie/cgi-bin/rtpi/realtimebusinformation?stopid={}&format=json".format(stop_id)
    result = requests.get(url)
    result = result.json()
    return result

print(main())


# 0 8220B007612
# 1785 8220VIR07491
# 4686 gen:57102:3542:0:1
# 4687 gen:57102:3543:0:1
# 4688 gen:57102:3606:0:1
# 4689 gen:57102:3607:0:1
# 4690 gen:57102:5245:0:1
