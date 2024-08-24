import { Outlet } from 'react-router-dom';
import  { Toaster } from 'react-hot-toast';
function App() {
  return (
    <>
      <Toaster/>
       {/* <main className='bg-black-100' > */}
        <Outlet/>
       {/* </main> */}
    </>
  );
}

export default App;
