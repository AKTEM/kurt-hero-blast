import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { addProduct, updateProduct, getProduct, Product } from "../../lib/firebaseProducts";
import { uploadProductImage } from "../../lib/firebaseStorage";

export const AdminProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Omit<Product, "id">>({
    title: "",
    description: "",
    price: 0,
    category: "",
    images: [],
    colors: [],
    shades: [],
    lengths: [],
    inStock: true,
    featured: false,
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [colorInput, setColorInput] = useState("");
  const [shadeInput, setShadeInput] = useState("");
  const [lengthInput, setLengthInput] = useState("");

  useEffect(() => {
    if (isEdit && id) {
      loadProduct(id);
    }
  }, [id, isEdit]);

  const loadProduct = async (productId: string) => {
    try {
      const product = await getProduct(productId);
      if (product) {
        setFormData(product);
      }
    } catch (error) {
      console.error("Error loading product:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrls = [...formData.images];

      // Upload new images
      if (imageFiles.length > 0) {
        const tempId = id || Date.now().toString();
        const uploadPromises = imageFiles.map(file => uploadProductImage(file, tempId));
        const newImageUrls = await Promise.all(uploadPromises);
        imageUrls = [...imageUrls, ...newImageUrls];
      }

      const productData = { ...formData, images: imageUrls };

      if (isEdit && id) {
        await updateProduct(id, productData);
      } else {
        await addProduct(productData);
      }

      navigate("/admin/products");
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = (type: "colors" | "shades" | "lengths", value: string) => {
    if (!value.trim()) return;
    setFormData(prev => ({
      ...prev,
      [type]: [...(prev[type] || []), value.trim()],
    }));
    if (type === "colors") setColorInput("");
    if (type === "shades") setShadeInput("");
    if (type === "lengths") setLengthInput("");
  };

  const handleRemoveTag = (type: "colors" | "shades" | "lengths", index: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type]?.filter((_, i) => i !== index) || [],
    }));
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">{isEdit ? "Edit Product" : "Add Product"}</h1>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                required
                rows={4}
                className="w-full px-3 py-2 border rounded-lg"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Price ($)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">Select category</option>
                  <option value="hair-extensions">Hair Extensions</option>
                  <option value="ponytail">Ponytail</option>
                  <option value="treatments">Treatments & Tools</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                className="w-full px-3 py-2 border rounded-lg"
                onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
              />
              {formData.images.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {formData.images.map((img, idx) => (
                    <img key={idx} src={img} alt="" className="w-20 h-20 object-cover rounded" />
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Colors</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border rounded-lg"
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  placeholder="Add color"
                />
                <Button type="button" onClick={() => handleAddTag("colors", colorInput)}>Add</Button>
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                {formData.colors?.map((color, idx) => (
                  <span key={idx} className="px-3 py-1 bg-gray-200 rounded-full text-sm flex items-center gap-2">
                    {color}
                    <button type="button" onClick={() => handleRemoveTag("colors", idx)}>×</button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Shades</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border rounded-lg"
                  value={shadeInput}
                  onChange={(e) => setShadeInput(e.target.value)}
                  placeholder="Add shade"
                />
                <Button type="button" onClick={() => handleAddTag("shades", shadeInput)}>Add</Button>
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                {formData.shades?.map((shade, idx) => (
                  <span key={idx} className="px-3 py-1 bg-gray-200 rounded-full text-sm flex items-center gap-2">
                    {shade}
                    <button type="button" onClick={() => handleRemoveTag("shades", idx)}>×</button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Lengths</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border rounded-lg"
                  value={lengthInput}
                  onChange={(e) => setLengthInput(e.target.value)}
                  placeholder="Add length"
                />
                <Button type="button" onClick={() => handleAddTag("lengths", lengthInput)}>Add</Button>
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                {formData.lengths?.map((length, idx) => (
                  <span key={idx} className="px-3 py-1 bg-gray-200 rounded-full text-sm flex items-center gap-2">
                    {length}
                    <button type="button" onClick={() => handleRemoveTag("lengths", idx)}>×</button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                />
                <span className="text-sm font-medium">In Stock</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                />
                <span className="text-sm font-medium">Featured</span>
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : isEdit ? "Update Product" : "Add Product"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/admin/products")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
