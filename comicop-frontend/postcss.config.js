// PostCSS xử lý Tailwind v4 và tự thêm vendor prefix CSS
export default {
    plugins: {
        // Tailwind v4 dùng @tailwindcss/postcss thay vì 'tailwindcss' cũ
        '@tailwindcss/postcss': {},
        // Autoprefixer tự thêm -webkit- -moz- prefix cho trình duyệt cũ
        autoprefixer: {},
    },
}