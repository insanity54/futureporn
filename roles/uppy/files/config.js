

const config = {
    debug: true,
    metrics: true,
    server: {
        host: "uppy.futureporn.net",
        protocol: "https",
        port: 3000
    },
    streamingUpload: true,
    corsOrigins: "https://futureporn.net",
    redisUrl: "redis://127.0.0.1:6379",
    secret: "oaojefoiaejfiojaeoifj83989389jaiodjfoi_---3",
    filePath: "/tmp",
    uploadUrls: ["https://uppy.futureporn.net/"],
    providerOptions: {
        s3: {
            "key": "000d37f13a933b8000000001f",
            "secret": "K000wrhvK3LJOcPM0KoMA4KBvkwZevI",
            "bucket": "futureporn-uppy",
            "endpoint": "s3.us-west-000.backblazeb2.com"
        },
        drive: {
          key: '886031456924-jiuukhfte5n0cfkktevgojpum54dn6r3.apps.googleusercontent.com',
          secret: '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',
        },
        dropbox: {
          key: 'zvaxniaf1gunns9',
          secret: 'cclglkkjkoqqo3v',
        },
    }
}

export default config;
