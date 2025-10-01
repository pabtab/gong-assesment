interface UserMenuProps {
  firstName: string;
  lastName: string;
  onLogout: () => void;
}

export function UserMenu({ firstName, lastName, onLogout }: UserMenuProps) {
  return (
    <div className='flex items-center gap-4'>
      <span className='text-gray-700 font-medium'>
        {firstName} {lastName}
      </span>
      <button
        onClick={onLogout}
        className='text-blue-600 hover:text-blue-700 cursor-pointer font-medium underline'
      >
        (Logout)
      </button>
    </div>
  );
}
