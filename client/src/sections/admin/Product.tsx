import { useState } from 'react';
import {
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
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

const products = [
  {
    id: 1,
    name: 'Áo thun nam basic',
    sku: 'TSH-BAS-001',
    category: 'Áo thun',
    price: '250,000đ',
    stock: 145,
    status: 'active',
    image: 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg',
  },
  {
    id: 2,
    name: 'Quần jean slim fit',
    sku: 'JNS-SLM-002',
    category: 'Quần jean',
    price: '450,000đ',
    stock: 89,
    status: 'active',
    image: 'https://images.pexels.com/photos/1082526/pexels-photo-1082526.jpeg',
  },
  {
    id: 3,
    name: 'Giày sneaker trắng',
    sku: 'SNK-WHT-003',
    category: 'Giày dép',
    price: '890,000đ',
    stock: 34,
    status: 'low-stock',
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
  },
  {
    id: 4,
    name: 'Áo khoác hoodie',
    sku: 'HDI-BLK-004',
    category: 'Áo khoác',
    price: '550,000đ',
    stock: 67,
    status: 'active',
    image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg',
  },
  {
    id: 5,
    name: 'Túi tote canvas',
    sku: 'BAG-CVS-005',
    category: 'Phụ kiện',
    price: '300,000đ',
    stock: 0,
    status: 'out-of-stock',
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg',
  },
  {
    id: 6,
    name: 'Áo sơ mi nam',
    sku: 'SRT-WHT-006',
    category: 'Áo sơ mi',
    price: '380,000đ',
    stock: 92,
    status: 'active',
    image: 'https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg',
  },
];

const statusColors = {
  active: 'bg-green-100 text-green-700 hover:bg-green-100',
  'low-stock': 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
  'out-of-stock': 'bg-red-100 text-red-700 hover:bg-red-100',
};

const statusLabels = {
  active: 'Đang bán',
  'low-stock': 'Sắp hết',
  'out-of-stock': 'Hết hàng',
};

export function Products() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sản phẩm</h1>
          <p className="text-gray-600 mt-1">Quản lý danh sách sản phẩm</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Thêm sản phẩm
        </Button>
      </div>

      <Card className="border-gray-200">
        <CardHeader className="border-b">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg font-semibold">
              Danh sách sản phẩm
            </CardTitle>
            <div className="flex flex-1 gap-2 sm:max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Tìm kiếm sản phẩm..."
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
                  <SelectItem value="active">Đang bán</SelectItem>
                  <SelectItem value="low-stock">Sắp hết</SelectItem>
                  <SelectItem value="out-of-stock">Hết hàng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Hình ảnh</TableHead>
                <TableHead>Tên sản phẩm</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Tồn kho</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-gray-600">{product.sku}</TableCell>
                  <TableCell className="text-gray-600">
                    {product.category}
                  </TableCell>
                  <TableCell className="font-medium">{product.price}</TableCell>
                  <TableCell>
                    <span
                      className={
                        product.stock === 0
                          ? 'text-red-600'
                          : product.stock < 50
                          ? 'text-yellow-600'
                          : 'text-gray-900'
                      }
                    >
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={statusColors[product.status as keyof typeof statusColors]}
                    >
                      {statusLabels[product.status as keyof typeof statusLabels]}
                    </Badge>
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
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
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
