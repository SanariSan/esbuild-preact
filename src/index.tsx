import { render } from 'preact';
import { LocationProvider, Route, Router } from 'preact-iso';
import { Header } from './components/Header';
import { Home } from './pages/Home/Home';
import { NotFound } from './pages/_404';
import './style.scss';
import s from './x.module.scss';
import { subscribeUpdates } from './hmr';
// import { ChakraProvider } from '@chakra-ui/react';
// import { DrawerExample } from './chakra-ui-test';

subscribeUpdates();

export function App() {
  return (
    // <ChakraProvider resetCSS>
    <LocationProvider>
      <Header />
      {/* <DrawerExample /> */}
      <div className={s.test}>.module.scss test</div>
      <input
        type="text"
        value={`Refresh state tracker: ${Math.random().toString(36).slice(2)}`}
        style={{ width: '250px' }}
      />
      <main>
        <Router>
          <Route path="/" component={Home} />
          <Route default component={NotFound} />
        </Router>
      </main>
    </LocationProvider>
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
