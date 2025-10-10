import {
  ArrowUpRight,
  DollarSign,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const stats = [
  {
    title: 'Tổng doanh thu',
    value: '245,000,000đ',
    change: '+12.5%',
    icon: DollarSign,
    trend: 'up',
  },
  {
    title: 'Đơn hàng',
    value: '1,234',
    change: '+8.2%',
    icon: ShoppingBag,
    trend: 'up',
  },
  {
    title: 'Khách hàng',
    value: '892',
    change: '+15.3%',
    icon: Users,
    trend: 'up',
  },
  {
    title: 'Sản phẩm',
    value: '156',
    change: '+3',
    icon: Package,
    trend: 'up',
  },
];

const recentOrders = [
  {
    id: '#ORD-001234',
    customer: 'Nguyễn Văn A',
    product: 'Áo thun nam basic',
    status: 'completed',
    amount: '250,000đ',
    date: '10/10/2025',
  },
  {
    id: '#ORD-001233',
    customer: 'Trần Thị B',
    product: 'Quần jean nữ',
    status: 'processing',
    amount: '450,000đ',
    date: '10/10/2025',
  },
  {
    id: '#ORD-001232',
    customer: 'Lê Văn C',
    product: 'Giày sneaker',
    status: 'pending',
    amount: '890,000đ',
    date: '09/10/2025',
  },
  {
    id: '#ORD-001231',
    customer: 'Phạm Thị D',
    product: 'Túi xách da',
    status: 'completed',
    amount: '1,200,000đ',
    date: '09/10/2025',
  },
  {
    id: '#ORD-001230',
    customer: 'Hoàng Văn E',
    product: 'Áo khoác hoodie',
    status: 'cancelled',
    amount: '550,000đ',
    date: '09/10/2025',
  },
];

const topProducts = [
  { name: 'Áo thun basic', sales: 234, revenue: '58,500,000đ' },
  { name: 'Quần jean slim fit', sales: 189, revenue: '85,050,000đ' },
  { name: 'Giày sneaker trắng', sales: 156, revenue: '138,840,000đ' },
  { name: 'Áo khoác bomber', sales: 145, revenue: '101,500,000đ' },
  { name: 'Túi tote canvas', sales: 128, revenue: '38,400,000đ' },
];

const statusColors = {
  completed: 'bg-green-100 text-green-700 hover:bg-green-100',
  processing: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  pending: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
  cancelled: 'bg-red-100 text-red-700 hover:bg-red-100',
};

const statusLabels = {
  completed: 'Hoàn thành',
  processing: 'Đang xử lý',
  pending: 'Chờ xử lý',
  cancelled: 'Đã hủy',
};

export function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Tổng quan hoạt động kinh doanh</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className="rounded-lg bg-blue-50 p-2">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="mt-2 flex items-center text-sm">
                  <TrendingUp className="mr-1 h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-600">
                    {stat.change}
                  </span>
                  <span className="ml-1 text-gray-600">vs tháng trước</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">
                  Đơn hàng gần đây
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Danh sách đơn hàng mới nhất
                </p>
              </div>
              <Button variant="outline" size="sm">
                Xem tất cả
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã đơn</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Giá trị</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {order.product}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={statusColors[order.status as keyof typeof statusColors]}
                      >
                        {statusLabels[order.status as keyof typeof statusLabels]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {order.amount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Sản phẩm bán chạy
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">Top 5 sản phẩm</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-gray-900 leading-tight">
                      {product.name}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-600">
                        {product.sales} đã bán
                      </p>
                      <p className="text-xs font-medium text-blue-600">
                        {product.revenue}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
