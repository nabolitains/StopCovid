import { CommonActions } from '@react-navigation/native';

export function resetStack(navitagion:any, routeName:string) {
  const resetActions = CommonActions.reset({
                        index: 1,
                        routes: [
                          { name: routeName }
                        ],
                      })
  navitagion.dispatch(resetActions);
}
