import { createContext } from 'react';

interface UserContextProps {
  token: string | null;
  setToken: (token: string | null) => void;
  setUser: (user: { email: string; isLoggedIn: boolean }) => void;
}

const UserContext = createContext<UserContextProps>({
  token: null,
  setToken: () => {},
  setUser: () => {},
});

export default UserContext;
