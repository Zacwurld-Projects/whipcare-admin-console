'use client';
import React, { useState } from 'react';
import Label from '@/app/components/ui/label';
import Input from '@/app/components/ui/input';
import SelectOptions from '@/app/dashboard/cron/templates/components/SelectOptions';
import Button from '@/app/components/ui/button';
import {
  createManualBooking,
  CreateManualBookingPayload,
  PaymentStatus,
} from '@/app/api/apiClient';
import { toast } from 'sonner';

const ManualBooking = () => {
  const [carOwnerEmail, setCarOwnerEmail] = useState('');
  const [serviceProviderEmail, setServiceProviderEmail] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [carIds, setCarIds] = useState<string[]>([]);
  const [manualPrice, setManualPrice] = useState<number | ''>('');
  const [currency, setCurrency] = useState('NGN'); // Default to NGN
  const [notes, setNotes] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !carOwnerEmail ||
      carIds.length === 0 ||
      !serviceProviderEmail ||
      !manualPrice ||
      !currency ||
      !date ||
      !time ||
      !paymentStatus
    ) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const scheduledDateTime = new Date(`${date}T${time}:00.000Z`).toISOString();

    const payload: CreateManualBookingPayload = {
      carOwnerEmail,
      carIds,
      serviceProviderEmail,
      manualPrice: Number(manualPrice),
      currency,
      scheduledAt: scheduledDateTime,
      notes: notes || undefined,
      paymentStatus,
    };

    try {
      await createManualBooking(payload);
      toast.success('Manual booking created successfully!');
      // Clear form fields
      setCarOwnerEmail('');
      setCarIds([]);
      setServiceProviderEmail('');
      setManualPrice('');
      setCurrency('NGN');
      setDate('');
      setTime('');
      setNotes('');
      setPaymentStatus('pending');
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'message' in error) {
        toast.error((error as { message: string }).message || 'Failed to create manual booking.');
      } else {
        toast.error('Failed to create manual booking.');
      }
    }
  };

  return (
    <section className='mb-6 rounded-lg border border-[#e0ddd9] bg-white p-4 dark:border-transparent dark:bg-dark-secondary md:p-6'>
      <h2 className='mb-4 text-lg font-semibold text-gray-900 dark:text-white'>Manual Booking</h2>
      <form onSubmit={handleSubmit} className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {/* Car Owner Email */}
        <div className='col-span-full'>
          <Label
            htmlFor='carOwnerEmail'
            text={<span className='text-base text-black dark:text-white'>Car Owner Email</span>}
          />
          <div className='mt-1 rounded-lg border border-gray-300 bg-white shadow-sm transition-all duration-200 focus-within:border-[#fa9874] focus-within:ring-2 focus-within:ring-[#fa9874]/30 dark:border-gray-600 dark:bg-dark-bg'>
            <div className='flex items-center gap-2 px-4 py-2'>
              <Input
                id='carOwnerEmail'
                type='email'
                className='border-0 bg-transparent px-0 py-0 text-black focus:ring-0 dark:bg-dark-bg dark:text-white'
                placeholder='john.doe@example.com'
                value={carOwnerEmail}
                onChange={(e) => setCarOwnerEmail(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Car IDs */}
        <div className='col-span-full'>
          <Label
            htmlFor='carIds'
            text={
              <span className='text-base text-black dark:text-white'>
                Car IDs (comma-separated)
              </span>
            }
          />
          <div className='mt-1 rounded-lg border border-gray-300 bg-white shadow-sm transition-all duration-200 focus-within:border-[#fa9874] focus-within:ring-2 focus-within:ring-[#fa9874]/30 dark:border-gray-600 dark:bg-dark-bg'>
            <div className='flex items-center gap-2 px-4 py-2'>
              <Input
                id='carIds'
                type='text'
                className='border-0 bg-transparent px-0 py-0 text-black focus:ring-0 dark:bg-dark-bg dark:text-white'
                placeholder='id1,id2,id3'
                value={carIds.join(',')}
                onChange={(e) => setCarIds(e.target.value.split(','))}
              />
            </div>
          </div>
        </div>

        {/* Service Provider Email */}
        <div className='col-span-full border-t border-gray-200 pt-6 dark:border-gray-700'>
          <h3 className='text-md mb-4 font-semibold text-gray-800 dark:text-white'>
            Service Provider Details
          </h3>
          <div className='col-span-full'>
            <Label
              htmlFor='serviceProviderEmail'
              text={
                <span className='text-base text-black dark:text-white'>Service Provider Email</span>
              }
            />
            <div className='mt-1 rounded-lg border border-gray-300 bg-white shadow-sm transition-all duration-200 focus-within:border-[#fa9874] focus-within:ring-2 focus-within:ring-[#fa9874]/30 dark:border-gray-600 dark:bg-dark-bg'>
              <div className='flex items-center gap-2 px-4 py-2'>
                <Input
                  id='serviceProviderEmail'
                  type='email'
                  className='border-0 bg-transparent px-0 py-0 text-black focus:ring-0 dark:bg-dark-bg dark:text-white'
                  placeholder='jane.smith@example.com'
                  value={serviceProviderEmail}
                  onChange={(e) => setServiceProviderEmail(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Manual Price */}
        <div>
          <Label
            htmlFor='manualPrice'
            text={<span className='text-base text-black dark:text-white'>Manual Price</span>}
          />
          <div className='mt-1 rounded-lg border border-gray-300 bg-white shadow-sm transition-all duration-200 focus-within:border-[#fa9874] focus-within:ring-2 focus-within:ring-[#fa9874]/30 dark:border-gray-600 dark:bg-dark-bg'>
            <div className='flex items-center gap-2 px-4 py-2'>
              <Input
                id='manualPrice'
                type='text'
                className='border-0 bg-transparent px-0 py-0 text-black focus:ring-0 dark:bg-dark-bg dark:text-white'
                placeholder='0.00'
                value={manualPrice}
                onChange={(e) => setManualPrice(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Currency */}
        <div>
          <SelectOptions
            title='Currency *'
            value={currency}
            options={['NGN', 'USD', 'EUR']}
            changeValue={(val) => setCurrency(val as string)}
          />
        </div>

        {/* Scheduled At */}
        <div>
          <Label
            htmlFor='scheduledDate'
            text={<span className='text-base text-black dark:text-white'>Scheduled Date</span>}
          />
          <div className='mt-1 rounded-lg border border-gray-300 bg-white shadow-sm transition-all duration-200 focus-within:border-[#fa9874] focus-within:ring-2 focus-within:ring-[#fa9874]/30 dark:border-gray-600 dark:bg-dark-bg'>
            <div className='flex items-center gap-2 px-4 py-2'>
              <Input
                id='scheduledDate'
                type='date'
                className='border-0 bg-transparent px-0 py-0 text-black focus:ring-0 dark:bg-dark-bg dark:text-white'
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div>
          <Label
            htmlFor='scheduledTime'
            text={<span className='text-base text-black dark:text-white'>Scheduled Time</span>}
          />
          <div className='mt-1 rounded-lg border border-gray-300 bg-white shadow-sm transition-all duration-200 focus-within:border-[#fa9874] focus-within:ring-2 focus-within:ring-[#fa9874]/30 dark:border-gray-600 dark:bg-dark-bg'>
            <div className='flex items-center gap-2 px-4 py-2'>
              <Input
                id='scheduledTime'
                type='time'
                className='border-0 bg-transparent px-0 py-0 text-black focus:ring-0 dark:bg-dark-bg dark:text-white'
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className='col-span-full'>
          <Label
            htmlFor='notes'
            text={<span className='text-base text-black dark:text-white'>Notes</span>}
          />
          <div className='mt-1 rounded-lg border border-gray-300 bg-white shadow-sm transition-all duration-200 focus-within:border-[#fa9874] focus-within:ring-2 focus-within:ring-[#fa9874]/30 dark:border-gray-600 dark:bg-dark-bg'>
            <div className='flex items-center gap-2 px-4 py-2'>
              <Input
                id='notes'
                type='text'
                className='border-0 bg-transparent px-0 py-0 text-black focus:ring-0 dark:bg-dark-bg dark:text-white'
                placeholder='Customer requested quick wash'
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Payment Status */}
        <div className='col-span-full'>
          <SelectOptions
            title='Payment Status *'
            value={paymentStatus}
            options={['pending', 'paid', 'failed', 'refunded']}
            changeValue={(val) => setPaymentStatus(val as PaymentStatus)}
          />
        </div>

        {/* Submit Button */}
        <div className='col-span-full mt-4 flex justify-end'>
          <Button type='submit'>Create Manual Booking</Button>
        </div>
      </form>
    </section>
  );
};

export default ManualBooking;
