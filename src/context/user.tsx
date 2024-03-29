import React, { useReducer } from 'react';
import { getUser } from '../api/User/index';

interface User {
  requiresKennitala?: boolean;
}

interface State extends User {
  isReady: boolean;
}

type Actions =
  | {
      type: 'LOAD_USER';
      user: User;
    }
  | {
      type: 'UPDATE_USER';
      user: Partial<User>;
    }
  | {
      type: 'CLEAR_USER';
    };

interface ContextValue extends State {
  fetchUser: (uid:string) => Promise<void>;
  updateUser: (user: Partial<State>) => void;
  clearUserData: () => void;
}

const initialState: State = {
  isReady: false,
};

function reducer(state: State, action: Actions): State {
  switch (action.type) {
    case 'LOAD_USER':
      return {
        ...state,
        ...action.user,
        isReady: true,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        ...action.user,
      };
    case 'CLEAR_USER':
      return initialState;
    default:
      return state;
  }
}

export const UserContext = React.createContext<ContextValue>(undefined);

const UserProvider = ({ children }:any) => {
  const [user, dispatch] = useReducer(reducer, initialState);

  const fetchUser = async (uid:string) => {
    const res = await getUser(null, uid);
    
    dispatch({ type: 'LOAD_USER', user: res });
    return res;
  };

  const updateUser = (updatedUser:any) => {
    dispatch({ type: 'UPDATE_USER', user: updatedUser });
  };

  const clearUserData = () => {
    dispatch({ type: 'CLEAR_USER' });
  };

  return (
    <UserContext.Provider
      value={{
        ...user,
        fetchUser,
        updateUser,
        clearUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
