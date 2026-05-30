// Layout.tsx — bọc Header + nội dung trang + Footer
// Outlet = nơi React Router render trang con theo URL hiện tại
// Ví dụ: vào /manga → Outlet render trang Manga
//        vào /cart  → Outlet render trang Cart
import { Outlet } from 'react-router-dom'

const Layout = () => {
    return (
        <div>
            {/* Header placeholder — sẽ thay bằng component thật ở Ngày 2 */}
            <header
                style={{
                    background: '#1a1a2e',
                    padding: '1rem 2rem',
                    color: 'white',
                    textAlign: 'center',
                    fontSize: '1.2rem',
                    fontWeight: 'bold'
                }}
            >
                🔖 Comicop — Header sẽ làm ở Ngày 2
            </header>

            {/* Outlet: React Router tự render đúng trang theo URL */}
            <main style={{ minHeight: '80vh', padding: '1rem' }}>
                <Outlet />
            </main>

            {/* Footer placeholder — sẽ thay bằng component thật ở Ngày 2 */}
            <footer
                style={{
                    background: '#1a1a2e',
                    padding: '1rem',
                    color: 'white',
                    textAlign: 'center'
                }}
            >
                © 2024 Comicop
            </footer>
        </div>
    )
}

export default Layout