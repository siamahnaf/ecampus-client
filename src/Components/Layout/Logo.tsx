import Image from "next/image";

const Logo = () => {
    return (
        <div className="text-center mb-10 pt-8">
            <Image src="/images/logo.png" alt="logo" width={120} height={89} className="inline w-1/3" />
        </div>
    );
};

export default Logo;