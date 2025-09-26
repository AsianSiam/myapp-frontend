const Footer = () => {
    return (
    <footer className="modern-black-card border-l-0 border-r-0 border-b-0 rounded-none mt-16 py-8">
        <div className="app-container flex flex-col md:flex-row justify-between items-center">
            <span className="text-lg text-app-secondary font-medium tracking-tight">All rights reserved.</span>
            <nav className="text-app-secondary font-medium tracking-tight flex gap-6 mt-4 md:mt-0">
                <a href="#" className="title-clickable cursor-pointer rounded px-2 py-1">Privacy Policy</a>
                <a href="#" className="title-clickable cursor-pointer rounded px-2 py-1">Terms of Service</a>
                <a href="#" className="title-clickable cursor-pointer rounded px-2 py-1">Contact Us</a>
            </nav>
        </div>
    </footer>
    )
}
export default Footer