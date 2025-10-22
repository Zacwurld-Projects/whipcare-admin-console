'use client';

import React, { useState } from 'react';
import Label from '@/app/components/ui/label';
import Input from '@/app/components/ui/input';
import TextArea from '@/app/components/ui/textarea';
import Button from '@/app/components/ui/button';
import SelectOptions from './templates/components/SelectOptions';
import { createRewardCenter, CreateRewardCenterPayload } from '@/app/api/apiClient';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Simple validation schema (you can replace with Zod if preferred)
interface FormErrors {
  audience?: string;
  category?: string;
  action?: string;
  rewardTitle?: string;
  rewardPrompt?: string;
  value?: string;
  valueType?: string;
  trigger?: string;
  triggerCount?: string;
  rewardStatus?: string;
}

interface FormData {
  audience: string;
  category: string;
  action: string;
  rewardTitle: string;
  rewardPrompt: string;
  value: number;
  valueType: string;
  trigger: string;
  triggerCount: number;
  rewardStatus: string;
}

const validateForm = (data: FormData): FormErrors => {
  const errors: FormErrors = {};

  if (!data.audience) errors.audience = 'Audience is required';
  if (!data.category) errors.category = 'Category is required';
  if (!data.action) errors.action = 'Action is required';
  if (!data.rewardTitle.trim()) errors.rewardTitle = 'Reward title is required';
  if (!data.rewardPrompt.trim()) errors.rewardPrompt = 'Reward prompt is required';
  if (data.value <= 0) errors.value = 'Value must be greater than 0';
  if (!data.valueType) errors.valueType = 'Value type is required';
  if (!data.trigger) errors.trigger = 'Trigger is required';
  if (data.triggerCount <= 0) errors.triggerCount = 'Trigger count must be greater than 0';
  if (!data.rewardStatus) errors.rewardStatus = 'Reward status is required';

  return errors;
};

type ValueType = 'Percentage' | 'Fixed Amount' | 'Item';
type TriggerType = 'BOOKING_COUNT' | 'REFERRAL_COUNT' | 'RATING' | 'COMPLETE_PROFILE' | 'DURATION';
type RewardCenterStatus = 'Active' | 'Inactive' | 'Archived';
type AudienceType = 'Car Owner' | 'Service Provider' | 'Influencer';
type CategoryType = 'Direct' | 'Influencer/Referral';
type ActionType = 'Auto-Apply' | 'Claim' | 'Paid Per Use';

const valueTypeOptions: ValueType[] = ['Percentage', 'Fixed Amount', 'Item'];
const triggerOptions: TriggerType[] = [
  'BOOKING_COUNT',
  'REFERRAL_COUNT',
  'RATING',
  'COMPLETE_PROFILE',
  'DURATION',
];
const rewardStatusOptions: RewardCenterStatus[] = ['Active', 'Inactive', 'Archived'];
const audienceOptions: AudienceType[] = ['Car Owner', 'Service Provider', 'Influencer'];
const categoryOptions: CategoryType[] = ['Direct', 'Influencer/Referral'];
const actionOptions: ActionType[] = ['Auto-Apply', 'Claim', 'Paid Per Use'];

const RewardCenterForm = () => {
  const [rewardTitle, setRewardTitle] = useState('');
  const [rewardPrompt, setRewardPrompt] = useState('');
  const [value, setValue] = useState<number>(0);
  const [valueType, setValueType] = useState('');
  const [trigger, setTrigger] = useState('');
  const [triggerCount, setTriggerCount] = useState<number>(1);
  const [rewardStatus, setRewardStatus] = useState('');
  const [audience, setAudience] = useState('');
  const [category, setCategory] = useState('');
  const [action, setAction] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const queryClient = useQueryClient();

  const createRewardMutation = useMutation({
    mutationKey: ['createReward'],
    mutationFn: async (payload: CreateRewardCenterPayload) => {
      setIsSubmitting(true);
      return await createRewardCenter(payload);
    },
    onSuccess: () => {
      toast.success('Reward created successfully');
      handleReset();
      // Invalidate related queries if they exist
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
    },
    onError: (error) => {
      toast.error('Error creating reward');
      console.error('Error creating reward:', error);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors only on submit
    setErrors({});

    // Prepare form data for validation
    const formData: FormData = {
      audience,
      category,
      action,
      rewardTitle,
      rewardPrompt,
      value,
      valueType,
      trigger,
      triggerCount,
      rewardStatus,
    };

    // Validate form
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the errors below');
      return;
    }

    // Use the mutation instead of direct API call
    const payload: CreateRewardCenterPayload = {
      name: rewardTitle,
      description: rewardPrompt,
      audience,
      category,
      action,
      value,
      valueType,
      trigger,
      triggerCondition: { count: triggerCount },
      status: rewardStatus,
    };

    createRewardMutation.mutate(payload);
  };

  const handleReset = () => {
    setRewardTitle('');
    setRewardPrompt('');
    setValue(0);
    setValueType('');
    setTrigger('');
    setTriggerCount(1);
    setRewardStatus('');
    setAudience('');
    setCategory('');
    setAction('');
    setErrors({});
  };

  return (
    <section className='mb-6 rounded-lg border border-[#e0ddd9] bg-white p-4 dark:border-transparent dark:bg-dark-secondary md:p-6'>
      <div className='mb-2 flex items-center justify-between'>
        <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>Reward Center</h2>
        <p className='text-xs text-gray-500 dark:text-gray-300'>Create and manage reward rules</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <div className='grid grid-cols-1 gap-4'>
          <SelectOptions
            title='Audience *'
            value={audience}
            options={audienceOptions}
            changeValue={(val) => setAudience(val as AudienceType)}
          />
          {errors.audience && (
            <p className='text-sm text-red-500 dark:text-red-400'>{errors.audience}</p>
          )}

          <SelectOptions
            title='Category *'
            value={category}
            options={categoryOptions}
            changeValue={(val) => setCategory(val as CategoryType)}
          />
          {errors.category && (
            <p className='text-sm text-red-500 dark:text-red-400'>{errors.category}</p>
          )}

          <SelectOptions
            title='Action *'
            value={action}
            options={actionOptions}
            changeValue={(val) => setAction(val as ActionType)}
          />
          {errors.action && (
            <p className='text-sm text-red-500 dark:text-red-400'>{errors.action}</p>
          )}

          <SelectOptions
            title='Reward Status *'
            value={rewardStatus}
            options={rewardStatusOptions}
            changeValue={(val) => setRewardStatus(val as RewardCenterStatus)}
          />
          {errors.rewardStatus && (
            <p className='text-sm text-red-500 dark:text-red-400'>{errors.rewardStatus}</p>
          )}

          <SelectOptions
            title='Value Type *'
            value={valueType}
            options={valueTypeOptions}
            changeValue={(val) => setValueType(val as ValueType)}
          />
          {errors.valueType && (
            <p className='text-sm text-red-500 dark:text-red-400'>{errors.valueType}</p>
          )}

          <SelectOptions
            title='Trigger Type *'
            value={trigger}
            options={triggerOptions}
            changeValue={(val) => setTrigger(val as TriggerType)}
          />
          {errors.trigger && (
            <p className='text-sm text-red-500 dark:text-red-400'>{errors.trigger}</p>
          )}
        </div>

        <div className='grid grid-cols-1 gap-4'>
          <div>
            <Label
              htmlFor='rewardTitle'
              text={<span className='text-base text-black dark:text-white'>Reward Title</span>}
            />
            <div className='mt-1 rounded-lg border border-gray-300 bg-white shadow-sm transition-all duration-200 focus-within:border-[#fa9874] focus-within:ring-2 focus-within:ring-[#fa9874]/30 dark:border-gray-600 dark:bg-dark-bg'>
              <div className='flex items-center gap-2 px-4 py-2'>
                <Input
                  id='rewardTitle'
                  type='text'
                  className='border-0 bg-transparent px-0 py-0 text-black focus:ring-0 dark:bg-dark-bg dark:text-white'
                  placeholder='e.g., 5% Discount Code'
                  value={rewardTitle}
                  onChange={(e) => setRewardTitle(e.target.value)}
                />
              </div>
            </div>
            <p className='mt-1 text-xs text-gray-500 dark:text-gray-300'>
              Give this reward a clear, recognizable name.
            </p>
            {errors.rewardTitle && (
              <p className='mt-1 text-sm text-red-500 dark:text-red-400'>{errors.rewardTitle}</p>
            )}
          </div>

          <div>
            <Label
              htmlFor='value'
              text={<span className='text-base text-black dark:text-white'>Reward Value</span>}
            />
            <div className='mt-1 rounded-lg border border-gray-300 bg-white shadow-sm transition-all duration-200 focus-within:border-[#fa9874] focus-within:ring-2 focus-within:ring-[#fa9874]/30 dark:border-gray-600 dark:bg-dark-bg'>
              <div className='flex items-center gap-2 px-4 py-2'>
                <Input
                  id='value'
                  type='number'
                  className='border-0 bg-transparent px-0 py-0 text-black focus:ring-0 dark:bg-dark-bg dark:text-white'
                  placeholder='e.g., 5'
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                />
              </div>
            </div>
            <p className='mt-1 text-xs text-gray-500 dark:text-gray-300'>
              The numeric value of the reward.
            </p>
            {errors.value && (
              <p className='mt-1 text-sm text-red-500 dark:text-red-400'>{errors.value}</p>
            )}
          </div>

          <div>
            <Label
              htmlFor='triggerCount'
              text={<span className='text-base text-black dark:text-white'>Trigger Count</span>}
            />
            <div className='mt-1 rounded-lg border border-gray-300 bg-white shadow-sm transition-all duration-200 focus-within:border-[#fa9874] focus-within:ring-2 focus-within:ring-[#fa9874]/30 dark:border-gray-600 dark:bg-dark-bg'>
              <div className='flex items-center gap-2 px-4 py-2'>
                <Input
                  id='triggerCount'
                  type='number'
                  className='border-0 bg-transparent px-0 py-0 text-black focus:ring-0 dark:bg-dark-bg dark:text-white'
                  placeholder='e.g., 1'
                  value={triggerCount}
                  onChange={(e) => setTriggerCount(Number(e.target.value))}
                />
              </div>
            </div>
            <p className='mt-1 text-xs text-gray-500 dark:text-gray-300'>
              Number of times the trigger condition must be met.
            </p>
            {errors.triggerCount && (
              <p className='mt-1 text-sm text-red-500 dark:text-red-400'>{errors.triggerCount}</p>
            )}
          </div>

          <div>
            <Label
              htmlFor='rewardPrompt'
              text={<span className='text-base text-black dark:text-white'>Reward Prompt</span>}
            />
            <div className='mt-1 rounded-lg border border-gray-300 bg-white shadow-sm transition-all duration-200 focus-within:border-[#fa9874] focus-within:ring-2 focus-within:ring-[#fa9874]/30 dark:border-gray-600 dark:bg-dark-bg'>
              <div className='px-4 py-2'>
                <TextArea
                  id='rewardPrompt'
                  className='min-h-28 border-0 bg-transparent px-0 py-0 text-black focus:ring-0 dark:text-white'
                  placeholder='e.g., Complete your profile to unlock this reward'
                  value={rewardPrompt}
                  maxLength={200}
                  onChange={(e) => setRewardPrompt(e.target.value)}
                />
              </div>
              <div className='flex items-center justify-between border-t border-gray-200 px-4 py-2 text-xs dark:border-gray-700'>
                <p className='text-gray-500 dark:text-gray-300'>
                  Describe the exact action needed to unlock.
                </p>
                <span className='text-gray-400'>{rewardPrompt.length}/200</span>
              </div>
            </div>
            {errors.rewardPrompt && (
              <p className='mt-1 text-sm text-red-500 dark:text-red-400'>{errors.rewardPrompt}</p>
            )}
          </div>
        </div>

        <div className='grid grid-cols-1 items-center justify-end gap-3 sm:flex md:col-span-2'>
          <div className='text-xs text-gray-500 dark:text-gray-300'>
            Status tips: Auto-Apply activates instantly, Auto-Claim triggers on event, Claim
            requires manual action.
          </div>
          <div className='ml-auto flex items-center gap-3'>
            <Button
              type='button'
              onClick={handleReset}
              className='bg-dark-bg text-black dark:bg-transparent dark:text-white dark:ring-[#2c2c3c]'
            >
              Reset
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Add Reward'}
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default RewardCenterForm;
