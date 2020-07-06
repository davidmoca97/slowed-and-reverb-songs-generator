import React from 'react';
import { MainView } from './MainView/MainView';
import styles from './App.module.css';
import { Window } from './MainView/Window/Window';

function App() {
  return (
    <>
      <div className={styles['background-image']}></div>
      <div className={styles['content']}>
        <Window title="slowed and reverb generator">
          <MainView />
        </Window>
      </div>
    </>
  );
}

export default App;
