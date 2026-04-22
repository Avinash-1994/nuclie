
'use strict';

function renderPost(p) {
    return '<li class="post-item" data-id="' + p.id + '"><h2>' + p.title + '</h2><p>' + p.excerpt + '</p></li>';
}

exports.render = async function render(context) {
    const url     = context.url     || '/';
    const headers = context.headers || {};
    const initial = context.initialState || {};

    // 50 real-looking blog posts
    const posts = Array.from({ length: 50 }, function(_, i) {
        return {
            id: i + 1,
            title: 'Understanding Build System Internals — Part ' + (i + 1),
            excerpt: 'A deep dive into how Sparx resolves modules, splits chunks, and eliminates dead code. Post ' + (i + 1) + ' of the series.'
        };
    });

    const postHtml = posts.map(renderPost).join('\n');

    const html =
        '<div id="app">' +
        '<header><h1>Sparx SSR Web Blog</h1></header>' +
        '<nav><a href="/">Home</a> <a href="/about">About</a></nav>' +
        '<main>' +
        '<p class="route-display">Current Path: <strong data-testid="url-display">' + url + '</strong></p>' +
        '<p class="ua-display">User-Agent: ' + (headers['user-agent'] || 'unknown') + '</p>' +
        '<p class="hydration-state">Initial count: ' + (initial.count || 0) + '</p>' +
        '<ul class="post-list">' + postHtml + '</ul>' +
        '</main>' +
        '</div>';

    const head =
        '<title>Sparx SSR Blog — ' + url + '</title>' +
        '<meta name="description" content="A comprehensive blog generated server-side by Sparx SSR.">' +
        '<meta property="og:title" content="Sparx SSR Blog">' +
        '<link rel="canonical" href="https://blog.sparx.dev' + url + '">';

    const state = { url, posts: posts.length, count: initial.count || 0 };

    return { html, head, state };
};
