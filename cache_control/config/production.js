module.exports = {
    manifest: "./rev-manifest.json",
    requireJS: {
        baseUrl: "/js", // 根目录
        paths: {

        },
        shim: {
            "jQuery": {
                exports: "$"
            }
        },
        map: {
            '*': {}
        }
    },
    statics: "statics",
    cache: {
        dotfiles: 'ignore',
        etag: true,
        extensions: ['htm', 'html'],
        index: false,
        maxAge: '30d',
        redirect: false,
        setHeaders: function(res, path, stat) {
            res.set('x-timestamp', Date.now());
        }
    }
}
