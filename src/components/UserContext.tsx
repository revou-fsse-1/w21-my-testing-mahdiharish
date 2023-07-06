import { createContext } from 'react';

interface UserContextProps {
  token: string | null;
  setToken: (token: string | null) => void;
  setUser: (user: { email: string; isLoggedIn: boolean }) => void;
}

export const UserContext = createContext<UserContextProps>({
  token: null,
  setToken: () => {},
  setUser: () => {},
});
