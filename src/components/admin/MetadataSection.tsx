'use client';
import { useState } from 'react';

interface MetadataSectionProps {
  category: string;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  onCategoryChange: (value: string) => void;
  onTagsChange: (value: string[]) => void;
  onActiveChange: (value: boolean) => void;
  onFeaturedChange: (value: boolean) => void;
}

const PREDEFINED_CATEGORIES = [
  'Dresses',
  'Tops',
  'Bottoms',
  'Jackets',
  'Accessories',
  'Seasonal',
  'Collections',
  'Limited Edition',
];

const PREDEFINED_TAGS = [
  'New',
  'Sale',
  'Trending',
  'Best Seller',
  'Limited',
  'Eco Friendly',
  'Sustainable',
  'Organic',
  'Handmade',
];

export default function MetadataSection({
  category,
  tags,
  isActive,
  isFeatured,
  onCategoryChange,
  onTagsChange,
  onActiveChange,
  onFeaturedChange,
}: MetadataSectionProps) {
  const [tagInput, setTagInput] = useState('');

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      onTagsChange([...tags, tag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((t) => t !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Metadata & Status</h3>

      <div className="space-y-4">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            {PREDEFINED_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full flex items-center gap-2"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-red-600 font-bold"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Add custom tag or select below"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => addTag(tagInput)}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {PREDEFINED_TAGS.filter((t) => !tags.includes(t)).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => addTag(tag)}
                className="text-sm px-2 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition"
              >
                +{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Status Toggles */}
        <div className="pt-4 border-t border-gray-200 space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => onActiveChange(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm font-medium text-gray-700">Active</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => onFeaturedChange(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm font-medium text-gray-700">Featured</span>
          </label>
        </div>
      </div>
    </div>
  );
}
