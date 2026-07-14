import streamlit as st
import plotly.express as px

st.title("Weather Forecast App")
place = st.text_input("place: ")
days = st.slider("days",min_value=1, max_value=5,help="Select the number of days for the weather forecast")
option = st.selectbox("Select the data to view",("Temperature","Sky"))

st.subheader(f"{option} of {place} for the next {days} days")

def get_data(days):

    dates = ["2024-06-01", "2024-06-02", "2024-06-03", "2024-06-04", "2024-06-05"]
    temperatures = [20, 22, 21, 23, 24]
    temperatures = [days * temp for temp in temperatures]
    return dates, temperatures

dates, temperatures = get_data(days)
figure = px.line(x=dates, y=temperatures, labels={"x": "Date", "y": "Temperature (°C)"}, title=f"Temperature Forecast for {place}")

st.plotly_chart(figure)