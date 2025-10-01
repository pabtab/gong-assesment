import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../services/firebase";
import { buildHierarchy } from "../utils/hierarchy";
import { UserTree } from "../components/UserTree";
import { Header } from "../components/Header";
import { UserMenu } from "../components/UserMenu";
import { useAuth } from "../hooks/useAuth";

export function Hierarchy() {
  const { user, logout } = useAuth();

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(),
  });

  if (isLoading) {
    return (
      <div className='min-h-screen flex flex-col bg-white'>
        <Header title='Hierarchy Tree' />
        <div
          className='flex-1 flex items-center justify-center text-gray-600'
          role='status'
          aria-live='polite'
        >
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen flex flex-col bg-white'>
        <Header title='Hierarchy Tree' />
        <div
          className='flex-1 flex items-center justify-center text-red-600'
          role='alert'
          aria-live='assertive'
        >
          <p>Error loading users: {error instanceof Error ? error.message : "Unknown error"}</p>
        </div>
      </div>
    );
  }

  const hierarchy = users ? buildHierarchy(users) : [];

  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>
      <Header
        title='Hierarchy Tree'
        rightContent={
          user && user.firstName && user.lastName ? (
            <UserMenu firstName={user.firstName} lastName={user.lastName} onLogout={logout} />
          ) : null
        }
      />

      <main id='main-content' className='flex-1 p-8'>
        {hierarchy.length === 0 ? (
          <div className='text-center py-12 text-gray-500' role='status'>
            <p>No users found</p>
          </div>
        ) : (
          <div className='bg-white rounded-lg shadow-sm p-6'>
            <div role='tree' aria-label='Organization hierarchy'>
              {hierarchy.map((node) => (
                <UserTree key={node.id} node={node} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
