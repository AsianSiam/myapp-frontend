const Footer = () => {
    return (
    <div className="bg-orange-500 py-3 mt-10">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
            <span className="text-2xl text-white font-normal tracking-tight">All rights reserved.</span>
            <span className="text-white font-normal tracking-tight flex gap-6">
                <span>Privacy Policy</span>
                <span>Terms of Service</span>
                <span>Contact Us</span>
            </span>
        </div>
    </div>
    )
}
export default Footer