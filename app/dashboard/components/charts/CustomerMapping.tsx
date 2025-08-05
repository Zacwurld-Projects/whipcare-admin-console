'use client';

import { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import dayjs from 'dayjs';
import countryLatLong from '../../data/country-lat-long.json';
import { fetchUserMapping } from '@/app/api/apiClient';

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

  useEffect(() => {
    const loadMapping = async () => {
      try {
        const response = await fetchUserMapping();
        const userData = response?.data ?? [];

        const enrichedMarkers = userData
          .map((item: { country: string; count: number }) => {
            const normalized = normalizeCountry(item.country);

            const match = countryLatLong.ref_country_codes.find(
              (country) => country.country.toLowerCase() === normalized.toLowerCase(),
            );

            if (!match) return null;

            return {
              location: normalized,
              users: item.count,
              color: getColorForCountry(normalized),
              coordinates: [match.longitude, match.latitude] as [number, number],
            };
          })
          .filter(Boolean); // remove nulls

        setMarkers(enrichedMarkers);
      } catch (error) {
        console.error('Error fetching user mapping:', error);
      }
    };

    loadMapping();
  }, []);

  return (
    <div className='relative h-[calc(100%-10px)] rounded-lg bg-white p-4 pb-0 dark:bg-dark-primary'>
      <div className='mb-0 flex w-full items-center justify-between border-b border-gray-800 pb-3 dark:border-gray-500'>
        <p className='text-medium font-semibold text-gray-800 dark:text-white'>Customer Mapping</p>
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

          {markers.map(({ location, coordinates, color }) => (
            <Marker key={location} coordinates={coordinates}>
              <rect x={-6} y={-6} width={12} height={12} rx={2} ry={2} fill={color} />
            </Marker>
          ))}
        </ComposableMap>
      </div>

      <div className='flex-column absolute bottom-[16px] left-[50%] w-[180px] -translate-x-[50%] gap-2'>
        {markers
          .sort((a, b) => b.users - a.users)
          .map((item) => (
            <div key={item.location} className='flex items-center justify-between'>
              <div className='flex items-center gap-[20px]'>
                <div style={{ background: item.color }} className='h-[12px] w-[20px] rounded'></div>
                <p className='text-xsmall text-gray-800 dark:text-white'>{item.location}</p>
              </div>
              <p className='text-xsmall text-gray-800 text-opacity-80 dark:text-white'>
                {item.users} users
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CustomerMapping;
