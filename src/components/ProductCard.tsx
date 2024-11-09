import React from 'react';
import { Product } from '../types';
import { useCartStore } from '../store/cartStore';
import { useSettingsStore } from '../store/settingsStore';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [selectedOption, setSelectedOption] = React.useState<string>('');
  const addItem = useCartStore((state) => state.addItem);
  const { options } = useSettingsStore();

  const availableOptions = React.useMemo(() => {
    if (!product.options?.hasOptions || !options) return [];
    return options.filter(option => 
      option.available && 
      (!product.options.selectedOptions || 
        product.options.selectedOptions.includes(option.name))
    );
  }, [product.options, options]);

  const handleAddToCart = () => {
    addItem({
      product,
      quantity: 1,
      options: {
        selectedOption: product.options?.hasOptions ? selectedOption : undefined,
      },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-600 text-sm mb-2">{product.description}</p>
      <p className="text-lg font-bold mb-2">£{product.price.toFixed(2)}</p>
      
      {product.options?.hasOptions && availableOptions.length > 0 && (
        <div className="mb-2">
          <select
            className="w-full p-2 border rounded"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            required
          >
            <option value="">Select an option</option>
            {availableOptions.map((option) => (
              <option key={option.id} value={option.name}>
                {option.name} {option.price > 0 ? `(+£${option.price.toFixed(2)})` : '(Free)'}
              </option>
            ))}
          </select>
        </div>
      )}
      
      <button
        onClick={handleAddToCart}
        disabled={product.options?.hasOptions && !selectedOption}
        className="mt-auto bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400"
      >
        Add to Cart
      </button>
    </div>
  );
};