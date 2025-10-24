import { use, useState } from 'react';
import {
  MoreHorizontal,
  Search,
  Filter,
  Eye,
  Mail,
  Phone,
  UserPlus,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useGetAllUsers } from '@/hook/Auth/users/useUser';

// const customers = [
//   {
//     id: 1,
//     name: 'Nguyễn Văn A',
//     email: 'nguyenvana@email.com',
//     phone: '0901234567',
//     orders: 15,
//     spent: '12,500,000đ',
//     status: 'active',
//     joined: '15/08/2025',
//     avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
//   },
//   {
//     id: 2,
//     name: 'Trần Thị B',
//     email: 'tranthib@email.com',
//     phone: '0912345678',
//     orders: 8,
//     spent: '6,800,000đ',
//     status: 'active',
//     joined: '20/08/2025',
//     avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
//   },
//   {
//     id: 3,
//     name: 'Lê Văn C',
//     email: 'levanc@email.com',
//     phone: '0923456789',
//     orders: 3,
//     spent: '2,100,000đ',
//     status: 'inactive',
//     joined: '05/09/2025',
//     avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
//   },
//   {
//     id: 4,
//     name: 'Phạm Thị D',
//     email: 'phamthid@email.com',
//     phone: '0934567890',
//     orders: 22,
//     spent: '18,900,000đ',
//     status: 'vip',
//     joined: '10/07/2025',
//     avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
//   },
//   {
//     id: 5,
//     name: 'Hoàng Văn E',
//     email: 'hoangvane@email.com',
//     phone: '0945678901',
//     orders: 12,
//     spent: '9,200,000đ',
//     status: 'active',
//     joined: '25/08/2025',
//     avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
//   },
//   {
//     id: 6,
//     name: 'Vũ Thị F',
//     email: 'vuthif@email.com',
//     phone: '0956789012',
//     orders: 5,
//     spent: '3,500,000đ',
//     status: 'active',
//     joined: '01/09/2025',
//     avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
//   },
// ];



const statusColors = {
  active: 'bg-green-100 text-green-700 hover:bg-green-100',
  inactive: 'bg-gray-100 text-gray-700 hover:bg-gray-100',
  vip: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
};

const statusLabels = {
  active: 'Hoạt động',
  inactive: 'Không hoạt động',
  vip: 'VIP',
};

export function Customers() {
  const [searchQuery, setSearchQuery] = useState('');
const {data: customers} = useGetAllUsers();
console.log("Customers data:", customers);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Khách hàng</h1>
          <p className="text-gray-600 mt-1">Quản lý danh sách khách hàng</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <UserPlus className="mr-2 h-4 w-4" />
          Thêm khách hàng
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Tổng khách hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">892</div>
            <p className="text-sm text-green-600 mt-1">+15.3% so với tháng trước</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Khách hàng mới
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">124</div>
            <p className="text-sm text-green-600 mt-1">+8.2% so với tháng trước</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Khách VIP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">68</div>
            <p className="text-sm text-blue-600 mt-1">Top 7.6% khách hàng</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-200">
        <CardHeader className="border-b">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg font-semibold">
              Danh sách khách hàng
            </CardTitle>
            <div className="flex flex-1 gap-2 sm:max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Tìm kiếm khách hàng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Liên hệ</TableHead>
                <TableHead>Đơn hàng</TableHead>
                <TableHead>Tổng chi tiêu</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tham gia</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers?.users.map((customer) => (
                <TableRow key={customer._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={customer?.avatarUrl} />
                        <AvatarFallback>
                          {customer?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">
                          {customer?.name}
                        </p>
                        <p className="text-sm text-gray-600">ID: #{customer._id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-3.5 w-3.5" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-3.5 w-3.5" />
                        {customer.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {customer.orders} đơn
                  </TableCell>
                  <TableCell className="font-medium text-blue-600">
                    {customer.spent}
                  </TableCell>
                  <TableCell className="font-medium">
                    {/* <Badge
                      variant="secondary"
                      className={statusColors[customer.status as keyof typeof statusColors]}
                    > */}
                      {customer.status }
                    {/* </Badge> */}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {customer.joined}
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
                          <Mail className="mr-2 h-4 w-4" />
                          Gửi email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Phone className="mr-2 h-4 w-4" />
                          Liên hệ
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
