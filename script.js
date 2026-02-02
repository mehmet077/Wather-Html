/**
 * Hava Durumu Uygulaması - JavaScript Motoru
 * wttr.in servisini kullanarak API anahtarı olmadan veri çeker.
 */

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const btnText = document.getElementById("btnText");
const spinner = document.getElementById("spinner");

async function fetchWeather() {
    const city = cityInput.value.trim();
    
    // 1. Boş giriş kontrolü: Kullanıcı bir şey yazmadıysa işlemi durdur.
    if (!city) {
        alert("Lütfen bir şehir adı giriniz.");
        return;
    }

    /**
     * UI (Arayüz) Durum Yönetimi:
     * İstek başladığında butonu kilitle ve spinner'ı göster.
     * Bu, kullanıcının üst üste tıklamasını engelleyerek sunucuyu korur (Rate Limiting).
     */
    searchBtn.disabled = true;
    btnText.style.display = "none";
    spinner.style.display = "block";

    try {
        /**
         * Veri Çekme (Fetch):
         * format=j1 parametresi wttr.in servisinden veriyi JSON formatında almamızı sağlar.
         */
        const response = await fetch(`https://wttr.in/${city}?format=j1`);
        
        // HTTP 404 veya 500 gibi hataları yakalamak için kontrol
        if (!response.ok) throw new Error("Şehir bulunamadı veya sunucu hatası");
        
        const data = await response.json();
        
        // Servisten dönen verinin ilk indekslerini (güncel durumu) değişkenlere atıyoruz
        const current = data.current_condition[0];
        const area = data.nearest_area[0];

        /**
         * DOM Manipülasyonu: 
         * API'den gelen karmaşık JSON verisini HTML elementlerine yerleştiriyoruz.
         */
        document.getElementById("cityName").innerText = `${area.areaName[0].value}, ${area.country[0].value}`;
        document.getElementById("temp").innerText = current.temp_C + "°C";
        document.getElementById("desc").innerText = current.lang_tr?.[0]?.value || current.weatherDesc[0].value;
        
        // Detaylı Veriler (Grid yapısındaki kartlar)
        document.getElementById("feelsLike").innerText = current.FeelsLikeC + "°C";
        document.getElementById("humidity").innerText = "%" + current.humidity;
        document.getElementById("windSpeed").innerText = current.windspeedKmph + " km/s";
        document.getElementById("uvIndex").innerText = current.uvIndex;
        document.getElementById("precip").innerText = current.precipMM + " mm";
        document.getElementById("visibility").innerText = current.visibility + " km";

    } catch (error) {
        // Hata yakalama: Konsola teknik hata yazdırılır, kullanıcıya uyarı gösterilir.
        console.error("Hava durumu çekme hatası:", error);
        alert("Şehir adı doğru olduğundan emin olun veya daha sonra tekrar deneyin.");
    } finally {
        /**
         * Reset Durumu:
         * İstek başarılı olsa da olmasa da butonu ve spinner'ı eski haline getirir.
         */
        searchBtn.disabled = false;
        btnText.style.display = "block";
        spinner.style.display = "none";
    }
}

// Olay Dinleyicileri (Event Listeners)
searchBtn.addEventListener("click", fetchWeather);

// UX İyileştirmesi: Kullanıcı sadece butona basmak değil, 'Enter' tuşuna basarak da arama yapabilmeli.
cityInput.addEventListener("keypress", (e) => { 
    if(e.key === "Enter") fetchWeather(); 
});