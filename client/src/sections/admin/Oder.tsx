import { useState } from 'react';
import {
  MoreHorizontal,
  Search,
  Filter,
  Eye,
  Printer,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const orders = [
  {
    id: '#ORD-001234',
    customer: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    products: 3,
    total: '1,250,000đ',
    status: 'completed',
    date: '10/10/2025',
    time: '14:30',
  },
  {
    id: '#ORD-001233',
    customer: 'Trần Thị B',
    email: 'tranthib@email.com',
    products: 2,
    total: '890,000đ',
    status: 'processing',
    date: '10/10/2025',
    time: '12:15',
  },
  {
    id: '#ORD-001232',
    customer: 'Lê Văn C',
    email: 'levanc@email.com',
    products: 1,
    total: '890,000đ',
    status: 'pending',
    date: '09/10/2025',
    time: '16:45',
  },
  {
    id: '#ORD-001231',
    customer: 'Phạm Thị D',
    email: 'phamthid@email.com',
    products: 4,
    total: '1,800,000đ',
    status: 'completed',
    date: '09/10/2025',
    time: '10:20',
  },
  {
    id: '#ORD-001230',
    customer: 'Hoàng Văn E',
    email: 'hoangvane@email.com',
    products: 2,
    total: '750,000đ',
    status: 'cancelled',
    date: '09/10/2025',
    time: '09:30',
  },
  {
    id: '#ORD-001229',
    customer: 'Vũ Thị F',
    email: 'vuthif@email.com',
    products: 5,
    total: '2,100,000đ',
    status: 'shipping',
    date: '08/10/2025',
    time: '15:00',
  },
  {
    id: '#ORD-001228',
    customer: 'Đặng Văn G',
    email: 'dangvang@email.com',
    products: 1,
    total: '450,000đ',
    status: 'completed',
    date: '08/10/2025',
    time: '11:30',
  },
];

const statusColors = {
  completed: 'bg-green-100 text-green-700 hover:bg-green-100',
  processing: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  pending: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
  shipping: 'bg-purple-100 text-purple-700 hover:bg-purple-100',
  cancelled: 'bg-red-100 text-red-700 hover:bg-red-100',
};

const statusLabels = {
  completed: 'Hoàn thành',
  processing: 'Đang xử lý',
  pending: 'Chờ xử lý',
  shipping: 'Đang giao',
  cancelled: 'Đã hủy',
};

export function Orders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Đơn hàng</h1>
          <p className="text-gray-600 mt-1">Quản lý tất cả đơn hàng</p>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="pending">Chờ xử lý</TabsTrigger>
          <TabsTrigger value="processing">Đang xử lý</TabsTrigger>
          <TabsTrigger value="completed">Hoàn thành</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="border-gray-200">
        <CardHeader className="border-b">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg font-semibold">
              Danh sách đơn hàng
            </CardTitle>
            <div className="flex flex-1 gap-2 sm:max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Tìm mã đơn, khách hàng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                  <SelectItem value="processing">Đang xử lý</SelectItem>
                  <SelectItem value="shipping">Đang giao</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn hàng</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Sản phẩm</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày đặt</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.customer}
                      </p>
                      <p className="text-sm text-gray-600">{order.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {order.products} sản phẩm
                  </TableCell>
                  <TableCell className="font-medium">{order.total}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={statusColors[order.status as keyof typeof statusColors]}
                    >
                      {statusLabels[order.status as keyof typeof statusLabels]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-gray-900">{order.date}</p>
                      <p className="text-sm text-gray-600">{order.time}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Printer className="mr-2 h-4 w-4" />
                          In đơn hàng
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <X className="mr-2 h-4 w-4" />
                          Hủy đơn
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
