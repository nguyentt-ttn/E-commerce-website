import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Settings,
  BarChart3,
  Tag,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface SidebarProps {
  onClose?: () => void;
}

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin',
  },
  {
    title: 'Đơn hàng',
    icon: ShoppingBag,
    href: '/admin/orders',
  },
  {
    title: 'Sản phẩm',
    icon: Package,
    href: '/admin/products',
  },
  {
    title: 'Khách hàng',
    icon: Users,
    href: '/admin/customers',
  },
  {
    title: 'Danh mục',
    icon: Tag,
    href: '/admin/categories',
  },
  {
    title: 'Báo cáo',
    icon: BarChart3,
    href: '/admin/reports',
  },
  {
    title: 'Cài đặt',
    icon: Settings,
    href: '/admin/settings',
  },
];

export function SidebarAdmin({ onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <div className="flex h-full flex-col border-r bg-white">
      <div className="flex h-16 items-center justify-between border-b px-6">
        <Link to="/admin" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
            <ShoppingBag className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Admin Panel</span>
        </Link>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <Icon className={cn('h-5 w-5', isActive ? 'text-blue-700' : 'text-gray-500')} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator />

      <div className="p-4">
        <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-4">
          <p className="text-xs font-semibold text-blue-900">Nâng cấp tài khoản</p>
          <p className="mt-1 text-xs text-blue-700">
            Mở khóa tính năng cao cấp
          </p>
          <Button size="sm" className="mt-3 w-full bg-blue-600 hover:bg-blue-700">
            Nâng cấp ngay
          </Button>
        </div>
      </div>
    </div>
  );
}
