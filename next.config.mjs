/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cloud.appwrite.io',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'static.vecteezy.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'img.freepik.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: "https",
                hostname: "avatar.iran.liara.run",
                port: "",
                pathname: "/**"
            },
                {
                    protocol: "https",
                    hostname: "randomuser.me",
                    port: "",
                    pathname: "/**"
                },
                {
                    protocol: "https",
                    hostname: "https://cloud.appwrite.io",
                    port: "",
                    pathname: "/**"
                }
        ],
    },
};

export default nextConfig;
