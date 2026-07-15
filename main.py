import streamlit as st
import plotly.express as px
from backend import get_data

st.title("Weather Forecast App")
place = st.text_input("place: ")
days = st.slider("days",min_value=1, max_value=5,help="Select the number of days for the weather forecast")
option = st.selectbox("Select the data to view",("Temperature","Sky"))


st.subheader(f"{option} of {place} for the next {days} days")


if place:
    try:
        filtered_data = get_data(place,days)
        if isinstance(filtered_data,list):
            if option == 'Temperature':
                dates = [item['dt_txt'] for item in filtered_data]
                temperatures = [dict["main"]["temp"]/10 for dict in filtered_data]
                print(filtered_data)
                
                figure = px.line(x=dates, y=temperatures, labels={"x": "Date", "y": "Temperature (°C)"}, title=f"Temperature Forecast for {place}")
                st.plotly_chart(figure)
            if option == 'Sky':
                images = {"Clear":"images/clear.png","Clouds":"images/cloud.png",
                        "Rain":"images/rain.png","Snow":"images/snow.png"}

                sky_conditions = [dict["weather"][0]["main"] for dict in filtered_data]
                image_paths = [images[condition] for condition in sky_conditions]
                st.image(image_paths,width=115)

    except KeyError:
        st.error('Enter a valid city to get the info')
    
        
