import { Outlet } from 'react-router-dom';
import  { Toaster } from 'react-hot-toast';
function App() {
  return (
    <>
      <Toaster/>
       {/* <main className='bg-slate-700' style={{'height':'45rem'}} > */}
        <Outlet/>
       {/* </main> */}
    </>
  );
}

export default App;
