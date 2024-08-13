import React, { createContext, useContext, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate, Navigate } from 'react-router-dom';


// хук useNavigate зручно використати в useEffect після успішного запиту на сервер і одразу перевести користувача на наступну сторінку
// а компонент Navigate зручно в перевірці &&
const Login: React.FC = () => {
  const auth = useContext(AuthContext);

  const navigate = useNavigate()

  const handleClick = () => {
    if(auth) auth.login(true)
    navigate('/dashboard')
  }
  return <div onClick={handleClick} className='App-header'>Login</div>
}

        // {/* Link діє як <a>, але не викликаэ на відміну від останнього перерендер, тому використовується для створення SPA
        // props Omit <React.AnchorHTMLAttributes<HTMLAnchorElement>, href> - в Link підключаються всі атрибути тегу <a>, окрім href.
        // href  не потрібен, бо є пропс to та інші*/}
const Home: React.FC = () => {
  return (
  <div className='App-header'>
    <div>
      <Link to='/dashboard' className='App-link'>Dashboard</Link>
    </div>
    <div>
      <Link to='/login' className='App-link'>Login</Link>
    </div>
  </div>
  )
}

const Dashboard: React.FC = () => {
  return <div className='App-header'>Dashboard</div>
}

const Error: React.FC = () => {
  return <div className='App-header'>Error</div>
}

const Profile: React.FC = () => {
  const {profileId, menuId} = useParams();

  React.useEffect(() => {
    // тут може йти запит на сервер з отриманням даних цього профілю, в т.ч. і ідентифікатора(id)
    alert(`Завантаження даних з профіля, в т.ч. id: ${profileId} та менюИД ${menuId}`)
  }, [profileId, menuId])

  return <div className='App-header'>Profile page ID: {profileId}, menu ID: {menuId}</div>
}

type ContextType = {
  isLogged: boolean;
  login: (status: boolean) => void;
}

const AuthContext = createContext< ContextType | null >(null);

// PrivateRoute використовується для аутентифікації - для захисту переходу на сторінку без попередньої реєстрації
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const auth = useContext(AuthContext);
  if (!auth) return <Error />;
  // children обгортаємо фрагментом, щоб пізніше щось додавати, і щоб просто працювало)
  // replace замінює історію і дозволяє переходити по сторінкам як window.history.go
  return auth.isLogged ? <>{children}</> : <Navigate to='/login' replace/>
}

function App() {

const [isLogged, login] = React.useState(false)

  return (
    <AuthContext.Provider value={{isLogged, login}}>
      <BrowserRouter>
        {/* Routes - відповідає за маршрутизацію в цілому
        Route- це окремі маршрути */}
        <Routes>
          {/* //props path='/' === index */}
          <Route index Component={Home} />
          {/* в element пишемо JSX код, в Component - типу змінну */}
          <Route path='/login/*' element={<Login/>} />
          <Route path='/dashboard' 
            element={
              <PrivateRoute>
                <Dashboard/>
              </PrivateRoute>
            }
            />
          {/* caseCensitive робить чутливим до регістру */}
          {/* * - для будь-якої іншої адреси */}
          <Route path='*' Component={Error} />
          {/* на приклад, path='/profile/${data.id} Тоді в URL буде типу /profile/123 і це 123 попаде в useParams*/}
          <Route path='/profile/:profileId/menu/:menuId' element={
            <PrivateRoute>
              <Profile/>
            </PrivateRoute>
          }/>
        </Routes>


      </BrowserRouter>
    </AuthContext.Provider>

  );
}

export default App;
