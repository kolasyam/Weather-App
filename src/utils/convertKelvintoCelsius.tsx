import React from 'react';
export default function converKelvintoCelsius(tempInKelvin: number): number{
    const tempInCelsius=tempInKelvin-273.15;
    return Math.floor(tempInCelsius);
}