import { useState } from "react";
import type { User, UserNode } from "../types";
import { getInitials } from "../utils/encode";

interface UserCardProps {
  user: User;
  removeUser: (user: UserNode) => void;
}

export function UserCard({ user, removeUser }: UserCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className='flex items-center gap-4 p-4 rounded-lg transition-colors'>
      <div className='flex-shrink-0'>
        {user.photo && !imageError ? (
          <img
            src={user.photo}
            loading='lazy'
            alt=''
            aria-hidden='true'
            className='w-12 h-12 rounded-full object-cover border-2 border-gray-200'
            onError={() => {
              setImageError(true);
            }}
          />
        ) : (
          <div
            className='w-12 h-12 rounded-full border-2 border-purple-500 flex items-center justify-center text-black font-semibold text-lg'
            aria-hidden='true'
          >
            {getInitials(user.firstName, user.lastName)}
          </div>
        )}
      </div>

      <div className='flex-1 min-w-0'>
        <h3 className='text-base font-semibold text-gray-900 truncate'>
          {user.firstName} {user.lastName}
        </h3>
        <p className='text-sm text-gray-600 truncate'>{user.email}</p>
      </div>
      <button onClick={() => removeUser(user)}>Remove User</button>
    </div>
  );
}
