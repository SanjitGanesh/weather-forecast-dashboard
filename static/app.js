// AeroForecast Front-End Application Logic

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const searchForm = document.getElementById('search-form');
    const cityInput = document.getElementById('city-input');
    const daysSlider = document.getElementById('days-slider');
    const daysSliderVal = document.getElementById('days-slider-val');

    const welcomeState = document.getElementById('welcome-state');
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const dashboardContent = document.getElementById('dashboard-content');

    const currentCity = document.getElementById('current-city');
    const currentDate = document.getElementById('current-date');
    const currentTemp = document.getElementById('current-temp');
    const currentIcon = document.getElementById('current-icon');
    const currentDesc = document.getElementById('current-desc');
    const detailHumidity = document.getElementById('detail-humidity');
    const detailWind = document.getElementById('detail-wind');
    const detailPressure = document.getElementById('detail-pressure');

    const forecastGrid = document.getElementById('forecast-grid');

    // Global App State
    let forecastDataList = [];
    let currentPlace = '';
    let chartInstance = null;

    // Initial Icon Render
    lucide.createIcons();

    // Map weather conditions to animated Meteocons SVG urls from CDN
    function getWeatherImage(condition, description = '', pod = 'd') {
        const isDay = pod === 'd';
        const desc = description.toLowerCase();

        if (condition === 'Clouds') {
            if (desc.includes('overcast') || desc.includes('broken')) {
                return 'https://cdn.jsdelivr.net/npm/@meteocons/svg@latest/fill/overcast.svg';
            }
            return `https://cdn.jsdelivr.net/npm/@meteocons/svg@latest/fill/${isDay ? 'partly-cloudy-day' : 'partly-cloudy-night'}.svg`;
        }

        const mapping = {
            'Clear': isDay ? 'clear-day' : 'clear-night',
            'Rain': 'rain',
            'Snow': 'snow',
            'Drizzle': 'drizzle',
            'Thunderstorm': 'thunderstorms-rain',
            'Mist': 'fog',
            'Smoke': 'smoke',
            'Haze': 'haze',
            'Dust': 'dust',
            'Fog': 'fog',
            'Sand': 'dust',
            'Ash': 'dust',
            'Squall': 'wind',
            'Tornado': 'tornado'
        };

        const iconName = mapping[condition] || 'cloudy';
        return `https://cdn.jsdelivr.net/npm/@meteocons/svg@latest/fill/${iconName}.svg`;
    }

    // Submit handler
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const city = cityInput.value.trim();
        if (city) {
            fetchForecast(city);
        }
    });

    // Slider handler
    daysSlider.addEventListener('input', (e) => {
        const val = e.target.value;
        daysSliderVal.textContent = val;
        if (forecastDataList.length > 0) {
            renderDashboard(currentPlace, val);
        }
    });

    // Autocomplete Suggestions with Debounce
    let suggestDebounceTimer;
    cityInput.addEventListener('input', (e) => {
        clearTimeout(suggestDebounceTimer);
        const query = e.target.value.trim();
        
        if (query.length < 2) {
            return;
        }

        suggestDebounceTimer = setTimeout(async () => {
            try {
                const response = await fetch(`/api/suggest?query=${encodeURIComponent(query)}`);
                if (response.ok) {
                    const suggestions = await response.json();
                    const datalist = document.getElementById('cities-list');
                    if (datalist && suggestions.length > 0) {
                        datalist.innerHTML = '';
                        suggestions.forEach(city => {
                            const option = document.createElement('option');
                            option.value = city;
                            datalist.appendChild(option);
                        });
                    }
                }
            } catch (error) {
                console.error('Autocomplete fetch error:', error);
            }
        }, 300);
    });
    // Fetch API
    async function fetchForecast(city) {
        showState('loading');

        try {
            // We fetch the full 5-day forecast, then slice on client side based on slider value
            const response = await fetch(`/api/forecast?place=${encodeURIComponent(city)}`);

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || 'Failed to fetch weather data');
            }

            const data = await response.json();

            if (!data.list || data.list.length === 0) {
                throw new Error('No weather forecast points found.');
            }

            forecastDataList = data.list;
            currentPlace = data.city_name || city;

            // Render dashboard
            renderDashboard(currentPlace, daysSlider.value);
            showState('dashboard');

        } catch (error) {
            console.error('Fetch error:', error);
            document.getElementById('error-message').textContent = error.message;
            showState('error');
        }
    }

    // Display state manager
    function showState(state) {
        welcomeState.classList.add('hidden');
        loadingState.classList.add('hidden');
        errorState.classList.add('hidden');
        dashboardContent.classList.add('hidden');

        if (state === 'welcome') welcomeState.classList.remove('hidden');
        else if (state === 'loading') loadingState.classList.remove('hidden');
        else if (state === 'error') errorState.classList.remove('hidden');
        else if (state === 'dashboard') dashboardContent.classList.remove('hidden');
    }

    // Render Dashboard Panels
    function renderDashboard(city, days) {
        // 8 data points per day (every 3 hours)
        const totalPoints = 8 * parseInt(days);
        const activeData = forecastDataList.slice(0, totalPoints);

        // 1. Render Current Weather Panel (first point is the closest forecast)
        const currentData = activeData[0];
        currentCity.textContent = city;

        // Parse date
        const dateObj = new Date(currentData.dt * 1000);
        currentDate.textContent = dateObj.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        currentTemp.textContent = Math.round(currentData.main.temp);
        currentDesc.textContent = currentData.weather[0].description;

        const mainCondition = currentData.weather[0].main;
        const mainDesc = currentData.weather[0].description;
        const mainPod = currentData.sys ? currentData.sys.pod : 'd';
        currentIcon.src = getWeatherImage(mainCondition, mainDesc, mainPod);
        currentIcon.alt = mainCondition;

        detailHumidity.textContent = `${currentData.main.humidity}%`;
        detailWind.textContent = `${Math.round(currentData.wind.speed * 3.6)} km/h`; // convert m/s to km/h
        detailPressure.textContent = `${currentData.main.pressure} hPa`;

        // 2. Render Forecast Cards Grid
        forecastGrid.innerHTML = '';
        activeData.forEach((item, index) => {
            const itemDate = new Date(item.dt * 1000);
            const weekday = itemDate.toLocaleDateString('en-US', { weekday: 'short' });
            const dayNum = itemDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
            const timeStr = itemDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

            const card = document.createElement('div');
            card.className = 'forecast-card';
            card.style.animationDelay = `${index * 0.03}s`; // staggered entry animation

            const cond = item.weather[0].main;
            const desc = item.weather[0].description;
            const pod = item.sys ? item.sys.pod : 'd';
            const imgSrc = getWeatherImage(cond, desc, pod);

            card.innerHTML = `
                <span class="forecast-time">${timeStr}</span>
                <span class="forecast-date">${weekday}, ${dayNum}</span>
                <img src="${imgSrc}" alt="${cond}" class="forecast-img">
                <span class="forecast-temp">${Math.round(item.main.temp)}°C</span>
                <span class="forecast-desc">${item.weather[0].description}</span>
            `;
            forecastGrid.appendChild(card);
        });

        // 3. Render Chart
        renderChart(activeData);

        // Refresh icons just in case we dynamically added any Lucide tag
        lucide.createIcons();
    }

    // Render interactive chart
    function renderChart(dataPoints) {
        const temperatures = dataPoints.map(item => Math.round(item.main.temp));
        const timestamps = dataPoints.map(item => {
            const dateObj = new Date(item.dt * 1000);
            return dateObj.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        });

        const options = {
            series: [{
                name: 'Temperature',
                data: temperatures
            }],
            chart: {
                type: 'area',
                height: 280,
                toolbar: {
                    show: false
                },
                zoom: {
                    enabled: false
                },
                background: 'transparent',
                foreColor: '#94a3b8',
                fontFamily: 'Outfit, sans-serif'
            },
            colors: ['#6366f1'],
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.45,
                    opacityTo: 0.05,
                    stops: [0, 95]
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth',
                width: 3
            },
            markers: {
                size: 0,
                hover: {
                    size: 6
                }
            },
            grid: {
                borderColor: 'rgba(255, 255, 255, 0.05)',
                xaxis: {
                    lines: {
                        show: false
                    }
                },
                yaxis: {
                    lines: {
                        show: true
                    }
                }
            },
            xaxis: {
                categories: timestamps,
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                },
                labels: {
                    style: {
                        fontSize: '11px'
                    }
                }
            },
            yaxis: {
                labels: {
                    formatter: function (value) {
                        return value + '°C';
                    },
                    style: {
                        fontSize: '11px'
                    }
                }
            },
            tooltip: {
                theme: 'dark',
                x: {
                    show: true
                },
                y: {
                    title: {
                        formatter: function () {
                            return 'Temp: ';
                        }
                    }
                }
            }
        };

        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new ApexCharts(document.querySelector("#temp-chart"), options);
        chartInstance.render();
    }
});
