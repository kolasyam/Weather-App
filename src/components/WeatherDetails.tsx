import React from 'react';
import { IoMdEye } from "react-icons/io";
import { FiDroplet } from "react-icons/fi";
import { MdAir } from "react-icons/md";
import { ImMeter } from "react-icons/im";
import { WiSunrise } from "react-icons/wi";
import { WiSunset } from "react-icons/wi";

export interface weatherDetailProps{
    visability: string;
    humidity:string;
    windSpeed: string;
    airPressure: string;
    sunrise: string;
    sunset: string;
}
export default function WeatherDetails(props:weatherDetailProps){
    const {
        visability="25km",
        humidity="62%",
        windSpeed="7 km/h",
        airPressure="1012 hpa",
        sunrise="6:20",
        sunset="18:48"
    }=props;
    return(
        <>

        <SingleWeatherDetail 
        icon={<IoMdEye />}
        information="visability"
        value={visability}
        />
        <SingleWeatherDetail 
        icon={<FiDroplet />}
        information="humidity"
        value={humidity}
        />
        <SingleWeatherDetail 
        icon={<MdAir />}
        information="windSpeed"
        value={windSpeed}
        />
        <SingleWeatherDetail 
        icon={<ImMeter />}
        information="airPressure"
        value={airPressure}
        />
        <SingleWeatherDetail 
        icon={<WiSunrise />}
        information="sunrise"
        value={sunrise}
        />
        <SingleWeatherDetail 
        icon={<WiSunset />}
        information="sunset"
        value={sunset}
        />
        </>
    );
}
export interface SingleWeatherDetailProps{
    information:string;
    icon: React.ReactNode;
    value: string;
}

function SingleWeatherDetail(props: SingleWeatherDetailProps){
    return(
        <div className="flex flex-col justify-between gap-2 items-center text-xs font-semibold text-black/80">
            <p className="whitespace-nowrap">{props.information}</p>
            <div className="text-3xl">{props.icon}</div>
            <p>{props.value}</p>
        </div>
    );
}