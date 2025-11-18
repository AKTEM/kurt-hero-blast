import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { getAllProducts, deleteProduct, Product } from "../../lib/firebaseProducts";
import { deleteProductImage } from "../../lib/firebaseStorage";
import { Badge } from "../../components/ui/badge";

export const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const productsData = await getAllProducts();
      setProducts(productsData);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, images: string[]) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      // Delete images from storage
      await Promise.all(images.map(img => deleteProductImage(img)));
      
      // Delete product from Firestore
      await deleteProduct(id);
      
      // Reload products
      loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button onClick={() => navigate("/admin/products/new")}>
          <Plus size={20} className="mr-2" />
          Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">No products yet</p>
            <Button onClick={() => navigate("/admin/products/new")}>
              <Plus size={20} className="mr-2" />
              Add Your First Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {products.map((product) => (
            <Card key={product.id}>
              <CardContent className="flex items-center gap-4 p-4">
                {product.images[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold">{product.title}</h3>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                  <p className="text-sm font-medium">${product.price}</p>
                  <div className="flex gap-2 mt-2">
                    {product.featured && <Badge variant="secondary">Featured</Badge>}
                    {product.inStock ? (
                      <Badge className="bg-green-500">In Stock</Badge>
                    ) : (
                      <Badge variant="destructive">Out of Stock</Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(product.id!, product.images)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
