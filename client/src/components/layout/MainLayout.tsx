
import { Outlet } from 'react-router-dom';
import HeaderPage from '../common/Header';
import FooterPage from '../common/Footer';
import SetTitle from '../common/SetTitle';

const MainLayout = () => {
    return (
        <div>
            <SetTitle />
            <HeaderPage />
            <main>
                <Outlet />
            </main>
            <FooterPage />
        </div>
    );
};

export default MainLayout;
