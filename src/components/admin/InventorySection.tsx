'use client';

interface InventorySectionProps {
  totalStock: number;
  availableStock: number;
  lowStockThreshold: number;
  onTotalStockChange: (value: number) => void;
  onAvailableStockChange: (value: number) => void;
  onLowStockThresholdChange: (value: number) => void;
}

export default function InventorySection({
  totalStock,
  availableStock,
  lowStockThreshold,
  onTotalStockChange,
  onAvailableStockChange,
  onLowStockThresholdChange,
}: InventorySectionProps) {
  const isLowStock = availableStock <= lowStockThreshold;

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Inventory Management</h3>

      <div className="space-y-4">
        {/* Total Stock */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Stock *
          </label>
          <input
            type="number"
            value={totalStock}
            onChange={(e) => onTotalStockChange(Math.max(0, parseInt(e.target.value) || 0))}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">Total units available</p>
        </div>

        {/* Available Stock */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Available Stock *
          </label>
          <input
            type="number"
            value={availableStock}
            onChange={(e) => onAvailableStockChange(Math.max(0, parseInt(e.target.value) || 0))}
            min="0"
            max={totalStock}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Units ready to sell ({totalStock - availableStock} reserved)
          </p>
        </div>

        {/* Low Stock Threshold */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Low Stock Threshold
          </label>
          <input
            type="number"
            value={lowStockThreshold}
            onChange={(e) => onLowStockThresholdChange(Math.max(0, parseInt(e.target.value) || 0))}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Alert when available stock falls below this number
          </p>
        </div>

        {/* Stock Status Alert */}
        {isLowStock && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md text-sm">
            ⚠️ Low stock alert: {availableStock} units remaining
          </div>
        )}
      </div>
    </div>
  );
}
