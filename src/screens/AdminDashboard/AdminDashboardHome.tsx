import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Package, ShoppingCart, FileText, TrendingUp } from "lucide-react";

export const AdminDashboardHome = () => {
  const stats = [
    { title: "Total Products", value: "0", icon: Package, color: "text-blue-500" },
    { title: "Total Orders", value: "0", icon: ShoppingCart, color: "text-green-500" },
    { title: "Blog Posts", value: "0", icon: FileText, color: "text-purple-500" },
    { title: "Revenue", value: "$0", icon: TrendingUp, color: "text-orange-500" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Welcome to Your Admin Panel</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Use the sidebar to manage your products, orders, and blog posts.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
