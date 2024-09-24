import { render } from 'preact';
import { LocationProvider, Route, Router } from 'preact-iso';
import { Header } from './components/Header';
import { Home } from './pages/Home/Home';
import { NotFound } from './pages/_404';
import './style.scss';
import s from './x.module.scss';

export function App() {
  return (
    <LocationProvider>
      <Header />
      <div class={s.test}>test</div>
      <main>
        <Router>
          <Route path="/" component={Home} />
          <Route default component={NotFound} />
        </Router>
      </main>
    </LocationProvider>
  );
}

let app = document.getElementById('app');

if (app === null) {
  app = document.createElement('div');
  app.id = 'app';
  document.body.appendChild(app);
}

render(<App />, app);
