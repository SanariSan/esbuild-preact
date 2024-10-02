import { NODE_ENV } from 'env';
import { Provider } from 'jotai';
import { render } from 'preact';
import { LocationProvider, Route, Router } from 'preact-iso';
import { Header } from './components/Header';
import { subscribeUpdates } from './hmr';
import { Home } from './pages/Home/Home';
import { NotFound } from './pages/_404';
import { store } from './store';
import { Count, Flag } from './store.example';
import './style.scss';
import s from './x.module.scss';
// import { ChakraProvider } from '@chakra-ui/react';
// import { DrawerExample } from './chakra-ui-test';

if (NODE_ENV === 'development') subscribeUpdates();

export function App() {
  return (
    // <ChakraProvider resetCSS>
    <Provider store={store}>
      <LocationProvider>
        <Header />
        {/* <DrawerExample /> */}
        <div className={s.test}>.module.scss test</div>
        <input
          type="text"
          value={`Refresh state tracker: ${Math.random().toString(36).slice(2)}`}
          style={{ width: '250px' }}
        />
        <Flag />
        <Count />
        <main>
          <Router>
            <Route path="/" component={Home} />
            <Route default component={NotFound} />
          </Router>
        </main>
      </LocationProvider>
    </Provider>
    // </ChakraProvider>
  );
}

let app = document.getElementById('app');

if (app === null) {
  app = document.createElement('div');
  app.id = 'app';
  document.body.appendChild(app);
}

render(<App />, app);
