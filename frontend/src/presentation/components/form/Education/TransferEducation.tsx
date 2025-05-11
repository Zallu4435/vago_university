import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '../../Input';
import { Select } from '../../Select';
import { Textarea } from '../../Textarea';
import { countryOptions, universityOptions } from './options';

export const TransferEducation: React.FC = () => {
  const { control, formState: { errors }, watch } = useFormContext();
  const previousUniversity = watch('transfer.previousUniversity');

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-xl border border-cyan-100">
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 border-b border-cyan-100">
        <h2 className="text-xl font-semibold text-cyan-900">Transfer Student Education</h2>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <Controller
            name="transfer.schoolName"
            control={control}
            render={({ field }) => (
              <Input
                id="schoolName"
                name="transfer.schoolName"
                label="Name of School/Institution"
                value={field.value}
                onChange={field.onChange}
                required
                placeholder="Enter school or institution name"
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                labelClassName="text-cyan-700"
                error={errors.transfer?.schoolName?.message}
              />
            )}
          />
          <Controller
            name="transfer.country"
            control={control}
            render={({ field }) => (
              <Select
                id="country"
                name="transfer.country"
                label="Country"
                options={countryOptions}
                value={field.value}
                onChange={field.onChange}
                required
                placeholder="Select country"
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                labelClassName="text-cyan-700"
                error={errors.transfer?.country?.message}
              />
            )}
          />
          <Controller
            name="transfer.from"
            control={control}
            render={({ field }) => (
              <Input
                id="from"
                name="transfer.from"
                label="From"
                value={field.value}
                onChange={field.onChange}
                required
                placeholder="Start year"
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                labelClassName="text-cyan-700"
                error={errors.transfer?.from?.message}
              />
            )}
          />
          <Controller
            name="transfer.to"
            control={control}
            render={({ field }) => (
              <Input
                id="to"
                name="transfer.to"
                label="To"
                value={field.value}
                onChange={field.onChange}
                required
                placeholder="End year"
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                labelClassName="text-cyan-700"
                error={errors.transfer?.to?.message}
              />
            )}
          />
          <Controller
            name="transfer.previousUniversity"
            control={control}
            render={({ field }) => (
              <Select
                id="previousUniversity"
                name="transfer.previousUniversity"
                label="Previous University"
                options={universityOptions}
                value={field.value}
                onChange={field.onChange}
                required
                placeholder="Select university"
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                labelClassName="text-cyan-700"
                error={errors.transfer?.previousUniversity?.message}
              />
            )}
          />
          {previousUniversity === 'other' && (
            <Controller
              name="transfer.otherUniversity"
              control={control}
              render={({ field }) => (
                <Input
                  id="otherUniversity"
                  name="transfer.otherUniversity"
                  label="Other University Name"
                  value={field.value}
                  onChange={field.onChange}
                  required
                  placeholder="Enter university name"
                  className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                  labelClassName="text-cyan-700"
                  error={errors.transfer?.otherUniversity?.message}
                />
              )}
            />
          )}
          <Controller
            name="transfer.creditsEarned"
            control={control}
            render={({ field }) => (
              <Input
                id="creditsEarned"
                name="transfer.creditsEarned"
                label="Credits Earned"
                value={field.value}
                onChange={field.onChange}
                required
                placeholder="Enter credits earned"
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                labelClassName="text-cyan-700"
                error={errors.transfer?.creditsEarned?.message}
              />
            )}
          />
          <Controller
            name="transfer.gpa"
            control={control}
            render={({ field }) => (
              <Input
                id="gpa"
                name="transfer.gpa"
                label="GPA"
                value={field.value}
                onChange={field.onChange}
                required
                placeholder="Enter GPA"
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                labelClassName="text-cyan-700"
                error={errors.transfer?.gpa?.message}
              />
            )}
          />
          <Controller
            name="transfer.programStudied"
            control={control}
            render={({ field }) => (
              <Input
                id="programStudied"
                name="transfer.programStudied"
                label="Program/Major Studied"
                value={field.value}
                onChange={field.onChange}
                required
                placeholder="Enter program or major"
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                labelClassName="text-cyan-700"
                error={errors.transfer?.programStudied?.message}
              />
            )}
          />
          <Controller
            name="transfer.reasonForTransfer"
            control={control}
            render={({ field }) => (
              <Textarea
                id="reasonForTransfer"
                name="transfer.reasonForTransfer"
                label="Reason for Transfer"
                value={field.value}
                onChange={field.onChange}
                required
                placeholder="Explain your reason for transfer"
                className="border-cyan-200 focus:border-cyan-400 focus:ring-cyan-200 bg-white"
                labelClassName="text-cyan-700"
                rows={3}
                error={errors.transfer?.reasonForTransfer?.message}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};