import streamlit as st

st.title("Weather Forecast App")
place = st.text_input("place: ")
days = st.slider("days",min_value=1, max_value=5,help="Select the number of days for the weather forecast")
option = st.selectbox("Select the data to view",("Temperature","Sky"))

st.subheader(f"{option} of {place} for the next {days} days")