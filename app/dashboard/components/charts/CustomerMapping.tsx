'use client';
import { timeAgo } from '@/app/accessoryFunctions';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import countryLatLong from '../../data/country-lat-long.json';

const data = [
  {
    location: 'Nigeria',
    users: 5000,
    color: '#0f973d',
  },
  {
    location: 'Germany',
    users: 2000,
    color: '#f3a218',
  },
  {
    location: 'India',
    users: 3000,
    color: '#f56630',
  },
];

const CustomerMapping = () => {
  const markers = countryLatLong.ref_country_codes.reduce(
    (
      acc: Array<{
        location: string;
        users: number;
        color: string;
        coordinates: [number, number];
      }>,
      country,
    ) => {
      data.forEach((item) => {
        if (item.location === country.country)
          acc.push({ ...item, coordinates: [country.longitude, country.latitude] });
      });
      return acc;
    },
    [],
  );

  return (
    <div className='relative h-[calc(100%-10px)] rounded-lg bg-white p-4 pb-0'>
      <div className='mb-0 flex w-full items-center justify-between border-b border-gray-800 pb-3'>
        <p className='text-medium font-semibold text-gray-800'>Customer Mapping</p>
        <p className='text-xsmall text-gray-600'>
          Last updated: {timeAgo(Date.now() - 30 * 24 * 60 * 60 * 1000)}
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
                    default: {
                      fill: '#ffece5',
                    },
                    hover: {
                      fill: '#ffece5', // hover color
                    },
                    pressed: {
                      fill: '#ffece5', // color when clicked
                    },
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
                <div
                  style={{
                    background: `${item.color}`,
                  }}
                  className={`h-[12px] w-[20px] rounded`}
                ></div>
                <p className='text-xsmall text-gray-800'>{item.location}</p>
              </div>
              <p className='text-xsmall text-gray-800 text-opacity-80'>{item.users} users</p>
            </div>
          ))}
      </div>
    </div>
  );
};
export default CustomerMapping;
