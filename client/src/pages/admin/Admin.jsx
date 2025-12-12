import React, { useEffect, useMemo, useCallback, useState, useRef } from 'react';
import { apiPost, apiGet, apiPut, apiDelete, uploadFile } from '../../api/client';
import { getDirectImageUrl } from '../../utils/imageUtils';

// Helper function to format price
const formatPrice = (price) => {
    return price ? Number(price).toFixed(2) : '';
};

export default function Admin() {
    const [banner, setBanner] = useState({ title: '', subtitle: '', image: '', video: '', link: '', placement: 'hero', active: true, order: 0 });
    const [product, setProduct] = useState({
        _id: null,
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        image: '', // Keep for backward compatibility
        images: [], // Array for multiple images
        category: 'everyday',
        isBestseller: false,
        onSale: false
    });
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadingIndex, setUploadingIndex] = useState(null);
    const fileInputRef = useRef(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [productError, setProductError] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');

    const handleProductChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setProduct(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    }, []);

    const handleImageUpload = async (e, index = null) => {
        const files = e.target.files;
        if (!files || files.length === 0) {
            return;
        }

        // Handle multiple files
        const filesArray = Array.from(files);

        // Validate all files
        for (const file of filesArray) {
            if (!file.type.startsWith('image/')) {
                const errorMsg = `Invalid file type: ${file.type}. Please upload image files only.`;
                console.error(errorMsg);
                setMessage(errorMsg);
                return;
            }

            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                const errorMsg = `File too large: ${(file.size / (1024 * 1024)).toFixed(2)}MB. Maximum size is 5MB.`;
                console.error(errorMsg);
                setMessage(errorMsg);
                return;
            }
        }

        setUploading(true);
        setUploadingIndex(index);
        setMessage(`Uploading ${filesArray.length} image(s)...`);

        try {
            const uploadedUrls = [];

            // Upload files sequentially
            for (let i = 0; i < filesArray.length; i++) {
                const file = filesArray[i];

                try {
                    const data = await uploadFile('/api/upload/image', file);
                    const imageUrl = data.imageUrl || data.secure_url || data.url;

                    if (!imageUrl) {
                        throw new Error(`No image URL returned for ${file.name}`);
                    }

                    uploadedUrls.push(imageUrl);
                } catch (error) {
                    throw new Error(error.message || `Upload failed for ${file.name}`);
                }
            }

            // Update the product with new image URLs
            setProduct(prev => {
                const currentImages = prev.images || [];
                let newImages;

                if (index !== null) {
                    // Replace image at specific index
                    newImages = [...currentImages];
                    newImages[index] = uploadedUrls[0];
                } else {
                    // Add new images
                    newImages = [...currentImages, ...uploadedUrls];
                }

                // Also update the main image (first image) for backward compatibility
                const mainImage = newImages.length > 0 ? newImages[0] : prev.image;

                return {
                    ...prev,
                    images: newImages,
                    image: mainImage
                };
            });

            setMessage(`${uploadedUrls.length} image(s) uploaded successfully!`);

        } catch (error) {
            console.error('Upload error:', error);
            setMessage(`Error: ${error.message}`);
        } finally {
            setUploading(false);
            setUploadingIndex(null);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemoveImage = (index) => {
        setProduct(prev => {
            const newImages = [...(prev.images || [])];
            newImages.splice(index, 1);

            // Update main image if we removed the first one
            const mainImage = newImages.length > 0 ? newImages[0] : '';

            return {
                ...prev,
                images: newImages,
                image: mainImage
            };
        });
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const loadProducts = async () => {
        setLoadingProducts(true);
        setProductError('');
        try {
            const all = await apiGet('/api/admin/products');
            setProducts(all);
        } catch (e) {
            console.error('Error loading products:', e);
            setProductError('Failed to load products. Please check console for details.');
        } finally {
            setLoadingProducts(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        if (filterCategory === 'all') return products;
        return products.filter(p => p.category === filterCategory);
    }, [products, filterCategory]);

    const submitBanner = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        try {
            await apiPost('/api/admin/banners', { ...banner, order: Number(banner.order) || 0 });
            setMessage('Banner created');
        } catch (err) {
            setMessage('Failed to create banner');
        } finally {
            setSaving(false);
        }
    };

    const resetProductForm = () => {
        setProduct({
            _id: null,
            name: '',
            description: '',
            price: '',
            originalPrice: '',
            image: '',
            images: [],
            category: 'everyday',
            isBestseller: false,
            onSale: false
        });
        setIsEditing(false);
    };

    const submitProduct = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const productData = {
                ...product,
                price: Number(product.price) || 0,
                originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
                // Ensure images array is sent, and set main image from first image
                images: product.images && product.images.length > 0
                    ? product.images
                    : (product.image ? [product.image] : []),
                image: product.images && product.images.length > 0
                    ? product.images[0]
                    : product.image
            };

            if (isEditing && product._id) {
                await apiPut(`/api/admin/products/${product._id}`, productData);
                setMessage('Product updated successfully');
            } else {
                await apiPost('/api/admin/products', productData);
                setMessage('Product created successfully');
            }

            resetProductForm();
            await loadProducts();
        } catch (err) {
            console.error('Error saving product:', err);
            setMessage(`Failed to ${isEditing ? 'update' : 'create'} product: ${err.message || 'Unknown error'}`);
        } finally {
            setSaving(false);
        }
    };

    const handleEditProduct = (product) => {
        setProduct({
            _id: product._id,
            name: product.name,
            description: product.description || '',
            price: formatPrice(product.price),
            originalPrice: formatPrice(product.originalPrice),
            image: product.image || (product.images && product.images.length > 0 ? product.images[0] : ''),
            images: product.images || (product.image ? [product.image] : []),
            category: product.category || 'everyday',
            isBestseller: product.isBestseller || false,
            onSale: product.onSale || false
        });
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;

        try {
            setLoadingProducts(true);
            await apiDelete(`/api/admin/products/${id}`);
            setMessage('Product deleted successfully');
            await loadProducts();
        } catch (err) {
            console.error('Error deleting product:', err);
            setMessage(`Failed to delete product: ${err.message || 'Unknown error'}`);
        } finally {
            setLoadingProducts(false);
        }
    };

    const handleCancelEdit = () => {
        resetProductForm();
        setMessage('');
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 md:pt-24 pb-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-10">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8" style={{ fontFamily: 'Marcellus SC, serif' }}>Admin Dashboard</h1>

                {/* Navigation Boxes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                    <a
                        href="/admin/orders"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white rounded-xl md:rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow group"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                                    📦 Orders
                                </h2>
                                <p className="text-sm md:text-base text-gray-600">
                                    View and manage all orders, COD & paid orders summary
                                </p>
                            </div>
                            <svg className="w-6 h-6 md:w-8 md:h-8 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </a>

                    <a
                        href="/admin/analytics"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white rounded-xl md:rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow group"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-green-600 transition-colors">
                                    📊 Analytics
                                </h2>
                                <p className="text-sm md:text-base text-gray-600">
                                    Business analytics, revenue insights & performance metrics
                                </p>
                            </div>
                            <svg className="w-6 h-6 md:w-8 md:h-8 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </a>
                </div>

                <div>
                    <form onSubmit={submitBanner} className="bg-white rounded-2xl shadow p-6">
                        <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: 'Marcellus SC, serif' }}>Create Banner</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <input className="border p-3 rounded" placeholder="Title" value={banner.title} onChange={(e) => setBanner({ ...banner, title: e.target.value })} />
                            <input className="border p-3 rounded" placeholder="Subtitle" value={banner.subtitle} onChange={(e) => setBanner({ ...banner, subtitle: e.target.value })} />
                            <input className="border p-3 rounded" placeholder="Image URL" value={banner.image} onChange={(e) => setBanner({ ...banner, image: e.target.value })} />
                            <input className="border p-3 rounded" placeholder="Video URL (optional)" value={banner.video} onChange={(e) => setBanner({ ...banner, video: e.target.value })} />
                            <input className="border p-3 rounded" placeholder="Link (optional)" value={banner.link} onChange={(e) => setBanner({ ...banner, link: e.target.value })} />
                            <select className="border p-3 rounded" value={banner.placement} onChange={(e) => setBanner({ ...banner, placement: e.target.value })}>
                                <option value="hero">Hero</option>
                                <option value="promo">Promo</option>
                                <option value="scrolling">Scrolling</option>
                            </select>
                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={banner.active} onChange={(e) => setBanner({ ...banner, active: e.target.checked })} />
                                    <span>Active</span>
                                </label>
                                <input className="border p-3 rounded w-32" placeholder="Order" type="number" value={banner.order} onChange={(e) => setBanner({ ...banner, order: e.target.value })} />
                            </div>
                        </div>
                        <button disabled={saving} className="mt-4 px-5 py-2 rounded bg-black text-white hover:bg-gray-800">Save Banner</button>
                    </form>
                </div>

                <div className="mt-8">
                    <form onSubmit={submitProduct} className="bg-white rounded-2xl shadow p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold" style={{ fontFamily: 'Marcellus SC, serif' }}>
                                {isEditing ? 'Edit Product' : 'Create Product'}
                            </h2>
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                                <input
                                    className="border p-3 rounded w-full"
                                    placeholder="Enter product name"
                                    value={product.name}
                                    onChange={handleProductChange}
                                    name="name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="border p-3 rounded w-full"
                                    placeholder="Enter product description"
                                    rows="3"
                                    value={product.description}
                                    onChange={handleProductChange}
                                    name="description"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                        <input
                                            className="border p-3 rounded w-full pl-8"
                                            placeholder="0.00"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={product.price}
                                            onChange={handleProductChange}
                                            name="price"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                        <input
                                            className="border p-3 rounded w-full pl-8"
                                            placeholder="Original price"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={product.originalPrice}
                                            onChange={handleProductChange}
                                            name="originalPrice"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
                                <div className="flex items-center mb-2">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={triggerFileInput}
                                        disabled={uploading}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {uploading ? 'Uploading...' : 'Add Images'}
                                    </button>
                                    <span className="ml-3 text-sm text-gray-500">
                                        {product.images?.length || 0} image(s) uploaded
                                    </span>
                                </div>

                                {/* Display uploaded images */}
                                {product.images && product.images.length > 0 && (
                                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {product.images.map((img, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={img}
                                                    alt={`Preview ${index + 1}`}
                                                    className="h-32 w-full object-cover rounded-md border"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index)}
                                                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    title="Remove image"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                                {index === 0 && (
                                                    <span className="absolute bottom-1 left-1 bg-green-600 text-white text-xs px-2 py-0.5 rounded">
                                                        Main
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Legacy single image display for backward compatibility */}
                                {(!product.images || product.images.length === 0) && product.image && (
                                    <div className="mt-2">
                                        <img
                                            src={product.image}
                                            alt="Preview"
                                            className="h-32 w-32 object-cover rounded-md border"
                                        />
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                <select
                                    className="border p-3 rounded w-full"
                                    value={product.category}
                                    onChange={handleProductChange}
                                    name="category"
                                    required
                                >
                                    <option value="everyday">Everyday</option>
                                    <option value="luxe">Luxe</option>
                                    <option value="limited-edition">Limited Edition</option>
                                    <option value="customizable">Customizable</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={product.isBestseller} onChange={handleProductChange} name="isBestseller" />
                                    <span>Bestseller</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={product.onSale} onChange={handleProductChange} name="onSale" />
                                    <span>On Sale</span>
                                </label>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    disabled={saving}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
                            >
                                {saving ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {isEditing ? 'Updating...' : 'Creating...'}
                                    </span>
                                ) : isEditing ? 'Update Product' : 'Create Product'}
                            </button>
                        </div>
                    </form>
                </div>

                {!!message && (
                    <div className={`max-w-6xl mx-auto px-8 py-3 text-sm rounded-md mt-4 ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}

                {/* Products List */}
                <div className="max-w-6xl mx-auto px-8 pb-10 mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-semibold" style={{ fontFamily: 'Marcellus SC, serif' }}>Products</h2>
                        <select className="border p-2 rounded" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                            <option value="all">All</option>
                            <option value="everyday">Everyday</option>
                            <option value="luxe">Luxe</option>
                            <option value="limited-edition">Limited Edition</option>
                            <option value="customizable">Customizable</option>
                        </select>
                    </div>
                    {loadingProducts ? (
                        <div className="text-gray-600">Loading products...</div>
                    ) : productError ? (
                        <div className="text-red-600">{productError}</div>
                    ) : (
                        <div className="overflow-x-auto bg-white rounded-xl shadow">
                            <table className="min-w-full text-left">
                                <thead>
                                    <tr className="border-b">
                                        <th className="px-4 py-3 text-sm text-gray-600">Image</th>
                                        <th className="px-4 py-3 text-sm text-gray-600">Name</th>
                                        <th className="px-4 py-3 text-sm text-gray-600">Category</th>
                                        <th className="px-4 py-3 text-sm text-gray-600">Price</th>
                                        <th className="px-4 py-3 text-sm text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((p) => (
                                        <tr key={p._id} className="border-b last:border-0">
                                            <td className="px-4 py-3">
                                                {p.images?.length > 0 ? (
                                                    <img
                                                        src={getDirectImageUrl(p.images[0])}
                                                        alt={p.name}
                                                        className="w-12 h-12 object-cover rounded"
                                                        onError={(e) => {
                                                            // Fallback to the original URL if the direct URL fails
                                                            if (e.target.src !== p.images[0]) {
                                                                e.target.src = p.images[0];
                                                            } else {
                                                                e.target.style.display = 'none';
                                                            }
                                                        }}
                                                    />
                                                ) : p.image ? (
                                                    <img
                                                        src={getDirectImageUrl(p.image)}
                                                        alt={p.name}
                                                        className="w-12 h-12 object-cover rounded"
                                                        onError={(e) => {
                                                            // Fallback to the original URL if the direct URL fails
                                                            if (e.target.src !== p.image) {
                                                                e.target.src = p.image;
                                                            } else {
                                                                e.target.style.display = 'none';
                                                            }
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 bg-gray-200 rounded" />
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{p.name}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{p.category}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">₹{p.price}</td>
                                            <td className="px-4 py-3 space-x-2">
                                                <button
                                                    onClick={() => handleEditProduct(p)}
                                                    className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                                                    title="Edit product"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(p._id)}
                                                    className="px-3 py-1.5 text-sm rounded bg-red-600 text-white hover:bg-red-700"
                                                    title="Delete product"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredProducts.length === 0 && (
                                <div className="p-4 text-sm text-gray-600">No products found.</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
