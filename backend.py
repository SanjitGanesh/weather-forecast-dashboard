API_KEY = "6d4d383df9be86666fd20a85a007d985"
def get_data(place,forecast_days,kind):
    url = f"http://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API_KEY}"
    return url