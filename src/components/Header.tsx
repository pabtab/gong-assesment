interface HeaderProps {
  title: string;
  rightContent?: React.ReactNode;
}

export function Header({ title, rightContent }: HeaderProps) {
  return (
    <header className='w-full bg-white px-8 py-6 flex items-center justify-between border-b border-gray-200'>
      <h1 className='text-4xl font-normal text-black'>{title}</h1>
      {rightContent && <div className='flex items-center'>{rightContent}</div>}
    </header>
  );
}
