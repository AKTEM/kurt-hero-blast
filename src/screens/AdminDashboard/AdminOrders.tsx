import { useState, useEffect } from "react";
import { getAllOrders, updateOrder, Order } from "../../lib/firebaseOrders";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Package, Eye, Truck, CheckCircle, XCircle } from "lucide-react";

export const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const fetchedOrders = await getAllOrders();
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: Order["status"]) => {
    try {
      await updateOrder(orderId, { status: newStatus });
      await fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending": return "bg-yellow-500";
      case "processing": return "bg-blue-500";
      case "shipped": return "bg-purple-500";
      case "delivered": return "bg-green-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orders Management</h1>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {orders.length} Total Orders
        </Badge>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">No orders yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Order #{order.id?.slice(0, 8)}</CardTitle>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Customer Details:</p>
                    <p className="text-sm">{order.shippingAddress.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.shippingAddress.address}, {order.shippingAddress.city}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.shippingAddress.state} {order.shippingAddress.zipCode}, {order.shippingAddress.country}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Order Details:</p>
                    <p className="text-sm">Items: {order.items.length}</p>
                    <p className="text-sm">Total: ${order.totalAmount.toFixed(2)}</p>
                    <p className="text-sm">Payment: {order.paymentMethod}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.createdAt && new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-semibold mb-2">Items:</p>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        {item.image && (
                          <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium">{item.title}</p>
                          <p className="text-muted-foreground">Qty: {item.quantity} × ${item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 mt-4 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  
                  {order.status === "pending" && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(order.id!, "processing")}
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Start Processing
                    </Button>
                  )}
                  
                  {order.status === "processing" && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(order.id!, "shipped")}
                    >
                      <Truck className="w-4 h-4 mr-2" />
                      Mark as Shipped
                    </Button>
                  )}
                  
                  {order.status === "shipped" && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(order.id!, "delivered")}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Delivered
                    </Button>
                  )}
                  
                  {(order.status === "pending" || order.status === "processing") && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleStatusUpdate(order.id!, "cancelled")}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel Order
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedOrder(null)}>
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>Order Details - #{selectedOrder.id?.slice(0, 8)}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold mb-2">Status:</p>
                <Badge className={getStatusColor(selectedOrder.status)}>
                  {selectedOrder.status.toUpperCase()}
                </Badge>
              </div>
              
              <div>
                <p className="font-semibold mb-2">Shipping Address:</p>
                <p>{selectedOrder.shippingAddress.name}</p>
                <p>{selectedOrder.shippingAddress.address}</p>
                <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                <p>{selectedOrder.shippingAddress.country}</p>
              </div>
              
              <div>
                <p className="font-semibold mb-2">Order Items:</p>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 mb-2 p-2 border rounded">
                    {item.image && <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded" />}
                    <div className="flex-1">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      <p className="text-sm">Price: ${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <p className="text-xl font-bold">Total: ${selectedOrder.totalAmount.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Payment Method: {selectedOrder.paymentMethod}</p>
              </div>
              
              <Button onClick={() => setSelectedOrder(null)} className="w-full">Close</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
