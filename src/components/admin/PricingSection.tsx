'use client';
import { useEffect, useState } from 'react';

interface PricingSectionProps {
  basePrice: number;
  discountType: 'percentage' | 'fixed' | null;
  discountValue: number;
  discountStartDate: string;
  discountEndDate: string;
  onBasePriceChange: (value: number) => void;
  onDiscountTypeChange: (value: 'percentage' | 'fixed' | null) => void;
  onDiscountValueChange: (value: number) => void;
  onDiscountStartDateChange: (value: string) => void;
  onDiscountEndDateChange: (value: string) => void;
}

export default function PricingSection({
  basePrice,
  discountType,
  discountValue,
  discountStartDate,
  discountEndDate,
  onBasePriceChange,
  onDiscountTypeChange,
  onDiscountValueChange,
  onDiscountStartDateChange,
  onDiscountEndDateChange,
}: PricingSectionProps) {
  const [finalPrice, setFinalPrice] = useState(basePrice);

  useEffect(() => {
    let price = basePrice;
    if (discountType && discountValue > 0) {
      if (discountType === 'percentage') {
        price = basePrice - (basePrice * discountValue) / 100;
      } else if (discountType === 'fixed') {
        price = Math.max(0, basePrice - discountValue);
      }
    }
    setFinalPrice(Math.round(price * 100) / 100);
  }, [basePrice, discountType, discountValue]);

  const discount =
    discountType === 'percentage'
      ? `${discountValue}%`
      : `₹${discountValue}`;

  const savings =
    discountType === 'percentage'
      ? Math.round(((basePrice * discountValue) / 100) * 100) / 100
      : discountValue;

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Pricing & Discounts</h3>

      <div className="space-y-4">
        {/* Base Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Base Price (₹) *
          </label>
          <input
            type="number"
            value={basePrice}
            onChange={(e) => onBasePriceChange(Math.max(0, parseFloat(e.target.value) || 0))}
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Discount Section */}
        <div className="pt-4 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Discount (Optional)
          </label>

          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => onDiscountTypeChange(null)}
              className={`px-4 py-2 rounded-md font-medium transition ${
                discountType === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              No Discount
            </button>
            <button
              type="button"
              onClick={() => onDiscountTypeChange('percentage')}
              className={`px-4 py-2 rounded-md font-medium transition ${
                discountType === 'percentage'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Percentage (%)
            </button>
            <button
              type="button"
              onClick={() => onDiscountTypeChange('fixed')}
              className={`px-4 py-2 rounded-md font-medium transition ${
                discountType === 'fixed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Fixed (₹)
            </button>
          </div>

          {discountType && (
            <div className="space-y-4">
              {/* Discount Value */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Value ({discountType === 'percentage' ? '%' : '₹'}) *
                </label>
                <input
                  type="number"
                  value={discountValue}
                  onChange={(e) => onDiscountValueChange(Math.max(0, parseFloat(e.target.value) || 0))}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Discount Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Start Date
                </label>
                <input
                  type="datetime-local"
                  value={discountStartDate}
                  onChange={(e) => onDiscountStartDateChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Discount End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount End Date
                </label>
                <input
                  type="datetime-local"
                  value={discountEndDate}
                  onChange={(e) => onDiscountEndDateChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Price Summary */}
        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Base Price:</span>
            <span className="font-semibold">₹{basePrice.toFixed(2)}</span>
          </div>
          {discountType && discountValue > 0 && (
            <>
              <div className="flex justify-between items-center mb-2 text-green-600">
                <span>Discount ({discount}):</span>
                <span>-₹{savings.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-t border-blue-200 pt-2 font-bold text-lg">
                <span>Final Price:</span>
                <span className="text-green-600">₹{finalPrice.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
