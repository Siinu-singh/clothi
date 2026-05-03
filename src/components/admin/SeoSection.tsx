'use client';
import { Collection } from '@/models/collection';

interface SeoSectionProps {
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  onSeoTitleChange: (value: string) => void;
  onSeoDescriptionChange: (value: string) => void;
  onSeoKeywordsChange: (value: string[]) => void;
}

export default function SeoSection({
  seoTitle,
  seoDescription,
  seoKeywords,
  onSeoTitleChange,
  onSeoDescriptionChange,
  onSeoKeywordsChange,
}: SeoSectionProps) {
  const seoTitleLength = seoTitle.length;
  const seoDescLength = seoDescription.length;

  const handleKeywordsChange = (value: string) => {
    const keywords = value
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0);
    onSeoKeywordsChange(keywords);
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>

      <div className="space-y-4">
        {/* SEO Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SEO Title
          </label>
          <input
            type="text"
            value={seoTitle}
            onChange={(e) => onSeoTitleChange(e.target.value)}
            placeholder="Collection name for search results"
            maxLength={60}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            {seoTitleLength}/60 characters (ideal: 50-60)
          </p>
        </div>

        {/* SEO Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SEO Description
          </label>
          <textarea
            value={seoDescription}
            onChange={(e) => onSeoDescriptionChange(e.target.value)}
            placeholder="Collection description for search results"
            maxLength={160}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            {seoDescLength}/160 characters (ideal: 150-160)
          </p>
        </div>

        {/* SEO Keywords */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SEO Keywords (comma-separated)
          </label>
          <textarea
            value={seoKeywords.join(', ')}
            onChange={(e) => handleKeywordsChange(e.target.value)}
            placeholder="keyword1, keyword2, keyword3"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {seoKeywords.map((keyword, idx) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
