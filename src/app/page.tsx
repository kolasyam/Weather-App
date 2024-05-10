"use client";
import Navbar from "@/components/navbar";
import { useQuery } from "react-query";
import axios from "axios";
import { format, parseISO ,fromUnixTime} from "date-fns";
import Container from "@/components/Container";
import converKelvintoCelsius from "@/utils/convertKelvintoCelsius";
import WeatherIcon from "@/components/WeatherIcon";
import { getDayOrNightIcon } from "@/utils/getDayOrNightIcon";
import WeatherDetails from "@/components/weatherDetails";
import { metersToKilometers } from "@/utils/metersToKilmeters";
import { convertWindSpeed } from "@/utils/covertWindSpeed";
import ForcastWeatherDatail from "@/components/ForcastWeatherDetail";
interface WeatherDetailimport
 {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
}

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherDetail[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}
export default function Home() {

  const { isLoading, error, data } = useQuery<WeatherData>('repoData', async () =>
    {
      const {data}=await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=delhi&appid=0f25db4edbd306fff3e6a2036655fe27&cnt=56`
    );
      return data;
    }
  )
  console.log("data",data);
  const firstdata=data?.list[0];
  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    )
  ];

  // Filtering data to get the first entry after 6 AM for each unique date
  const firstDataForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    });
  });
  if (isLoading){
    return(
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Loading....</p>
      </div>
    );
  } 
  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar/>
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="flex gap-1 text-2xl items-end">
              <p>{format(parseISO(firstdata?.dt_txt ?? ''),'EEEE')}</p>
              <p className="text-lg">({format(parseISO(firstdata?.dt_txt ?? ''),'dd.MM.yyyy')})</p>
            </h2>
            <Container className="gap-10 px-6 items-center" >

              <div className="flex flex-col px-4">
                <span className="text-5xl">
                {converKelvintoCelsius(firstdata?.main.temp ?? 296.37)}°
                </span>
                <p className="text-xs space-x-l whitespace-nowrap">
                  <span>Feels like</span>
                  <span>
                {converKelvintoCelsius(firstdata?.main.feels_like ?? 0)}°
                </span>
                </p>
                <p className="text-xs space-x-2">
                <span>
                  {converKelvintoCelsius(firstdata?.main.temp_min?? 0)}°↓{" "}
                </span>                
                <span>
                  {" "}
                  {converKelvintoCelsius(firstdata?.main.temp_max?? 0)}°↑
                </span>
                </p>
              </div>
              <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
               {data?.list.map((d,i)=>
                <div key={i} className="flex flex-col justify-between gap-2 items-center text-xs font-semibold">
                  <p className="whitespace-nowrap">
                    {format(parseISO(d.dt_txt),'h:mm a')}
                  </p>
                  {/* <WeatherIcon iconName={d.weather[0].icon}></WeatherIcon> */}
                  <WeatherIcon iconName={getDayOrNightIcon(d.weather[0].icon,d.dt_txt)}></WeatherIcon>
                    <p>{converKelvintoCelsius(d?.main.temp?? 0)}°</p>
                </div>
               )}
              </div>
            </Container>
          </div>
          <div className="flex gap-4">
            <Container className="w-fit justify-center flex-col px-4 items-center">
              <p className="capitalize text-center">{firstdata?.weather[0].description}</p>
              <WeatherIcon iconName={getDayOrNightIcon(firstdata?.weather[0].icon,firstdata?.dt_txt ?? "")}></WeatherIcon>
            </Container>
            <Container className="bg-yellow-300/80 px-6 gap-4 justify-between mx-auto">
              <WeatherDetails visability={metersToKilometers(firstdata?.visibility?? 10000)} airPressure={`${firstdata?.main.pressure}hPa`} humidity={`${firstdata?.main.humidity}%`} sunrise={format(fromUnixTime(data?.city.sunrise ?? 1702949452),'h:mm')} sunset={format(fromUnixTime(data?.city.sunset ?? 1702949452),'H:mm')}windSpeed={convertWindSpeed(firstdata?.wind.speed ?? 1.64)}></WeatherDetails>
            </Container>
          </div>
        </section>
        <section className="flex w-full flex-col gap-4">
          <p className="text-2xl">
            Forcast (7 days)
          </p>
          {firstDataForEachDate.map((d,i)=>(
          <ForcastWeatherDatail key={i}description={d?.weather[0].description ?? ""}
          weatehrIcon={d?.weather[0].icon ?? "01d"}
          date={d ? format(parseISO(d.dt_txt), "dd.MM") : ""}
          day={format(parseISO(d.dt_txt ?? ''),'EEEE')}
          feels_like={d?.main.feels_like ?? 0}
          temp={d?.main.temp ?? 0}
          temp_max={d?.main.temp_max ?? 0}
          temp_min={d?.main.temp_min ?? 0}
          airPressure={`${d?.main.pressure} hPa `}
          humidity={`${d?.main.humidity}% `}
          sunrise={format(
            fromUnixTime(data?.city.sunrise ?? 1702517657),
            "H:mm"
          )}
          sunset={format(
            fromUnixTime(data?.city.sunset ?? 1702517657),
            "H:mm"
          )}
          visability={`${metersToKilometers(d?.visibility ?? 10000)} `}
          windSpeed={`${convertWindSpeed(d?.wind.speed ?? 1.64)} `}></ForcastWeatherDatail>
          ))}
        </section>
      </main>
    </div>
  );
}