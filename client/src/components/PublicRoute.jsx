import { useSelector } from 'react-redux';
import { Outlet, Navigate, useSearchParams } from 'react-router-dom';

export default function PublicRoute() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  return currentUser ? <Navigate to={redirect} /> : <Outlet />;
}
