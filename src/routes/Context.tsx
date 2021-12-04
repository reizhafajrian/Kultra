import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import {View} from 'react-native';
import Loading from '../components/Loading/Loading';
import {checkCurrentUser} from '../utils/firebase';
// export const AuthContextProvider = React.createContext<{state: State; dispatch: Dispatch} | undefined
// >(undefined);
export const AuthContextProvider = React.createContext();
const reducer = (state, action) => {
  switch (action.type) {
    case 'login': {
      return {
        ...state,
        token: action.token,
      };
    }
    case 'setLocation': {
      return {
        ...state,
        location: {
          lat: action.location.lat,
          long: action.location.long,
        },
      };
    }
  }
};
export default function Context({children}: {children: React.ReactNode}) {
  const [loading, setloading] = useState(true);
  const [state, dispatch] = useReducer(reducer, {
    token: '',
    location: {
      lat: 0,
      long: 0,
    },
  });
  const checkToken = async () => {
    try {
      const token = await checkCurrentUser()?.getIdToken();

      if (typeof token === 'string') {
        dispatch({type: 'login', token});
      }
      //   setloading(false);
    } catch (error) {
      setloading(false);
    }
    setloading(false);
  };
  useLayoutEffect(() => {
    checkToken();

    return () => {};
  }, []);
  //   useEffect(() => {
  //     console.log('useeffect');
  //     checkToken();

  //     return () => {};
  //   }, []);

  const MemoFunctionRoutes = useMemo(
    () => ({
      login: async token => {
        dispatch({type: 'login', token: token});
      },
      logOut: async token => {
        dispatch({type: 'login', token: token});
      },
      getLocation: () => {
        return state.location;
      },
      setLocation: (lat, long) => {
        dispatch({
          type: 'setLocation',
          location: {
            lat: lat,
            long: long,
          },
        });
      },
      getToken: () => {
        return state.token;
      },
    }),
    [state],
  );

  return (
    <View style={{flex: 1}}>
      {loading ? (
        <Loading />
      ) : (
        <AuthContextProvider.Provider value={MemoFunctionRoutes}>
          {children}
        </AuthContextProvider.Provider>
      )}
    </View>
  );
}
