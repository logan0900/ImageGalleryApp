import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';
import { store } from './src/store';
import client from './src/api/apolloClient';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <SafeAreaProvider>
          <AppNavigator />
        </SafeAreaProvider>
      </Provider>
    </ApolloProvider>
  );
};

export default App;
