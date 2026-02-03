export default function handler(req, res) {
    const client_id = process.env.OAUTH_CLIENT_ID;
    const redirect_uri = process.env.OAUTH_REDIRECT_URI || `${process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'http://localhost:3000'}/api/callback`;

    const url = `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=repo,user&redirect_uri=${encodeURIComponent(redirect_uri)}`;

    res.redirect(url);
}
