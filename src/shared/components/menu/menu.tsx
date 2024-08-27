import { List } from '@phosphor-icons/react';
import { useSidebar } from '../../../contexts/sidebar.context';

export const Menu: React.FC = () => {
  const { toggleSidebar } = useSidebar();

  const handleSidebarToggle = () => {
    toggleSidebar();
  }

  return (
    <div className="flex justify-end bg-steel-blue-700 w-full border-b md:border-0 md:static p-2">
      <span
        onClick={handleSidebarToggle}
        className='flex items-center gap-x-2 text-white p-2 rounded-lg  hover:bg-steel-blue-800 active:bg-steel-blue-900 duration-150'
      >
        <List size={20} />
      </span>
    </div>
  );
};
 