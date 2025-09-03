'use client';

import { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import dayjs from 'dayjs';
import countryLatLong from '../../data/country-lat-long.json';
import { fetchUserMapping } from '@/app/api/apiClient';
import PageLoader from '../Loaders/PageLoader'; // Import PageLoader

const COLORS = ['#0f973d', '#f3a218', '#f56630', '#6a1b9a', '#00838f'];

const COUNTRY_COLOR_MAP: Record<string, string> = {};
let colorIndex = 0;

// Get consistent color per country
const getColorForCountry = (country: string) => {
  if (!COUNTRY_COLOR_MAP[country]) {
    COUNTRY_COLOR_MAP[country] = COLORS[colorIndex % COLORS.length];
    colorIndex++;
  }
  return COUNTRY_COLOR_MAP[country];
};

// Fix known invalid/misspelled country names
const normalizeCountry = (country: string) => {
  const lower = country.toLowerCase();
  if (lower === 'nigerian') return 'Nigeria';
  // Add more mappings here if needed
  return country;
};

const CustomerMapping = () => {
  const [markers, setMarkers] = useState<
    Array<{
      location: string;
      users: number;
      color: string;
      coordinates: [number, number];
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const loadMapping = async () => {
      try {
        const response = await fetchUserMapping('ng');
        const userData = response?.data ?? {}; // Changed to object

        const entries = Object.entries(userData) as [string, { count: number; country: string }][];

        const enrichedMarkers = entries
          .map(([stateName, stateData]) => {
            const normalizedCountry = normalizeCountry(stateData.country);

            // Try to find state-level coordinates, fall back to country if not found
            const match = countryLatLong.ref_country_codes.find(
              (item) =>
                item.country.toLowerCase() === normalizedCountry.toLowerCase() &&
                (item.state?.toLowerCase() === stateName.toLowerCase() ||
                  item.city?.toLowerCase() === stateName.toLowerCase()), // Check for state or city match
            );

            // Fallback to country-level coordinates if state/city specific are not found
            const countryMatch = countryLatLong.ref_country_codes.find(
              (item) => item.country.toLowerCase() === normalizedCountry.toLowerCase(),
            );

            let coordinates: [number, number] | undefined = match
              ? [match.longitude, match.latitude]
              : countryMatch
                ? [countryMatch.longitude, countryMatch.latitude]
                : undefined;

            // Apply a small random offset if coordinates are from a country-level fallback
            if (coordinates && !match && countryMatch) {
              const offsetMagnitude = 0.5; // Adjust as needed for visual spread
              coordinates = [
                coordinates[0] + (Math.random() - 0.5) * offsetMagnitude,
                coordinates[1] + (Math.random() - 0.5) * offsetMagnitude,
              ];
            }

            if (!coordinates) return null;

            return {
              location: `${stateName}, ${normalizedCountry}`,
              users: stateData.count,
              color: getColorForCountry(normalizedCountry),
              coordinates: coordinates,
            };
          })
          .filter(Boolean) as Array<{
          location: string;
          users: number;
          color: string;
          coordinates: [number, number];
        }>; // remove nulls and assert type

        setMarkers(enrichedMarkers);
      } catch (error) {
        console.error('Error fetching user mapping:', error);
      } finally {
        setIsLoading(false); // Set loading to false after fetch attempt
      }
    };

    loadMapping();
  }, []);

  if (isLoading) {
    return <PageLoader />; // Display loader while loading
  }

  return (
    <div className='flex w-full flex-col justify-between rounded-lg bg-white p-4 dark:bg-dark-primary'>
      <div className='w-full'>
        <div className='mb-0 flex w-full items-center justify-between border-b border-gray-800 pb-3 dark:border-gray-500'>
          <p className='text-medium font-semibold text-gray-800 dark:text-white'>
            Customer Mapping
          </p>
          <p className='text-xsmall text-gray-600 dark:text-[#a0a0b2]'>
            Last updated: {dayjs(Date.now()).format('MMMM DD, YYYY')}
          </p>
        </div>

        <div>
          <ComposableMap>
            <Geographies geography='/LandTopos.json'>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: { fill: '#ffece5' },
                      hover: { fill: '#ffece5' },
                      pressed: { fill: '#ffece5' },
                    }}
                  />
                ))
              }
            </Geographies>

            {markers.map(({ location, coordinates, color, users }) => (
              <Marker key={location} coordinates={coordinates}>
                <circle
                  r={Math.max(4, Math.sqrt(users) * 0.7)}
                  fill={color}
                  stroke='#fff'
                  strokeWidth={1}
                />
                <title>{`${location}: ${users} users`}</title>
              </Marker>
            ))}
          </ComposableMap>
        </div>
      </div>
      <div className='flex w-full flex-wrap items-center justify-end gap-x-[20px] gap-y-[10px]'>
        {markers
          .sort((a, b) => b.users - a.users)
          .map((item) => (
            <div key={item.location} className='flex items-center justify-between gap-5'>
              <div className='flex items-center gap-[20px]'>
                <div style={{ background: item.color }} className='h-[12px] w-[20px] rounded'></div>
                <p className='text-xsmall text-gray-800 dark:text-white'>{item.location}</p>
              </div>
              <p className='text-xsmall text-center text-gray-800 text-opacity-80 dark:text-white'>
                {item.users} users
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CustomerMapping;
