import React, { useEffect, useState } from 'react';
import { useSettingsStore } from '../store/settingsStore';
import { useProductStore } from '../store/productStore';
import { Category } from '../types';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';

export const AdminSettings: React.FC = () => {
  const { options, loading: optionsLoading, error: optionsError, fetchOptions, addOption, updateOption, deleteOption } = useSettingsStore();
  const { products, loading: productsLoading, error: productsError, addProduct, updateProduct, deleteProduct } = useProductStore();
  
  // Options state
  const [newOptionName, setNewOptionName] = useState('');
  const [newOptionPrice, setNewOptionPrice] = useState('');
  const [newOptionAvailable, setNewOptionAvailable] = useState(true);

  // Product state
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Coffees' as Category,
    image: '',
    options: {
      hasOptions: false,
      selectedOptions: [] as string[]
    }
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  const handleAddOption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newOptionName && newOptionPrice) {
      await addOption(newOptionName, parseFloat(newOptionPrice));
      setNewOptionName('');
      setNewOptionPrice('');
      setNewOptionAvailable(true);
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = newProduct.image;
      
      if (selectedImage) {
        imageUrl = await handleImageUpload(selectedImage);
      }

      await addProduct({
        ...newProduct,
        price: parseFloat(newProduct.price),
        image: imageUrl
      });

      // Reset form
      setNewProduct({
        name: '',
        description: '',
        price: '',
        category: 'Coffees',
        image: '',
        options: {
          hasOptions: false,
          selectedOptions: []
        }
      });
      setSelectedImage(null);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const loading = optionsLoading || productsLoading;
  const error = optionsError || productsError;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Settings</h2>

      {/* Options Management */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Options Management</h3>

        {/* Add New Option */}
        <form onSubmit={handleAddOption} className="mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={newOptionName}
              onChange={(e) => setNewOptionName(e.target.value)}
              placeholder="Option name"
              className="flex-1 p-2 border rounded"
              required
            />
            <input
              type="number"
              value={newOptionPrice}
              onChange={(e) => setNewOptionPrice(e.target.value)}
              placeholder="Price"
              step="0.01"
              className="w-32 p-2 border rounded"
              required
            />
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newOptionAvailable}
                onChange={(e) => setNewOptionAvailable(e.target.checked)}
                className="mr-2"
              />
              Available
            </label>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Option
            </button>
          </div>
        </form>

        {/* Options List */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700 mb-2">Available Options</h4>
          {options?.length === 0 ? (
            <p className="text-gray-500 italic">No options available</p>
          ) : (
            options?.map((option) => (
              <div key={option.id} className="flex items-center justify-between p-4 bg-gray-50 rounded">
                <div>
                  <span className="font-medium">{option.name}</span>
                  <span className="ml-4 text-gray-600">£{option.price.toFixed(2)}</span>
                  <span className={`ml-4 ${option.available ? 'text-green-600' : 'text-red-600'}`}>
                    {option.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => updateOption(option.id, option.name, option.price, !option.available)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Toggle Availability
                  </button>
                  <button
                    onClick={() => deleteOption(option.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Product Management */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Product Management</h3>

        {/* Add New Product */}
        <form onSubmit={handleAddProduct} className="mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Product name"
              className="p-2 border rounded"
              required
            />
            <input
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
              placeholder="Price"
              step="0.01"
              className="p-2 border rounded"
              required
            />
          </div>
          
          <textarea
            value={newProduct.description}
            onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Product description"
            className="w-full p-2 border rounded"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <select
              value={newProduct.category}
              onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value as Category }))}
              className="p-2 border rounded"
              required
            >
              <option value="Coffees">Coffees</option>
              <option value="Teas">Teas</option>
              <option value="Cakes">Cakes</option>
              <option value="Hot Chocolate">Hot Chocolate</option>
            </select>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
              className="p-2 border rounded"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newProduct.options.hasOptions}
                onChange={(e) => setNewProduct(prev => ({
                  ...prev,
                  options: { 
                    ...prev.options, 
                    hasOptions: e.target.checked,
                    selectedOptions: e.target.checked ? prev.options.selectedOptions : []
                  }
                }))}
                id="hasOptions"
              />
              <label htmlFor="hasOptions">Has options</label>
            </div>

            {newProduct.options.hasOptions && options && (
              <div className="ml-6 space-y-2">
                <p className="text-sm text-gray-600">Select available options:</p>
                {options.map(option => (
                  <div key={option.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`option-${option.id}`}
                      checked={newProduct.options.selectedOptions.includes(option.name)}
                      onChange={(e) => {
                        const selectedOptions = e.target.checked
                          ? [...newProduct.options.selectedOptions, option.name]
                          : newProduct.options.selectedOptions.filter(name => name !== option.name);
                        setNewProduct(prev => ({
                          ...prev,
                          options: { ...prev.options, selectedOptions }
                        }));
                      }}
                    />
                    <label htmlFor={`option-${option.id}`}>{option.name}</label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Product
          </button>
        </form>

        {/* Products List */}
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded">
              <div className="flex items-center gap-4">
                <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                <div>
                  <span className="font-medium">{product.name}</span>
                  <span className="ml-4 text-gray-600">£{product.price.toFixed(2)}</span>
                  <p className="text-sm text-gray-500">{product.category}</p>
                  {product.options?.hasOptions && (
                    <p className="text-sm text-gray-500">
                      Options: {product.options.selectedOptions?.join(', ') || 'None'}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => deleteProduct(product.id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};