/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname:
                    "recoveryimageaudio9cf45a58988249b58ea28ebeffd19151316-dev.s3.us-east-1.amazonaws.com",
                port: "",
                pathname: "/public/**",
            },
        ],
    },
};

module.exports = nextConfig;
