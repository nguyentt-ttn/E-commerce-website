
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div>
            {/* <Header /> */}
            <main>
                <Outlet />
            </main>
            {/* <Footer /> */}
        </div>
    );
};

export default MainLayout;
