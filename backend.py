import requests

API_KEY = "6d4d383df9be86666fd20a85a007d985"
def get_data(place,forecast_days=None,kind=None):
    url = f"https://api.openweathermap.org/data/2.5/forecast?q={place}&appid={API_KEY}"
    response = requests.get(url)
    data = response.json()
    filtered_data = data['list']
    nr_values = 8 * forecast_days
    filtered_data = filtered_data[:nr_values]
    if kind == "temperature":
        filtered_data = [dict["main"]["temp"] for dict in filtered_data]
    elif kind == "sky":
        filtered_data = [dict["weather"][0]["main"] for dict in filtered_data]
    return filtered_data

if __name__ == "__main__":
    print(get_data(place="Tokyo",forecast_days=2,kind='temperature'))