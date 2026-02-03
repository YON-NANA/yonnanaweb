import { Octokit } from "octokit";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { type, data } = req.body;
    const token = process.env.GITHUB_TOKEN;
    const repoFull = process.env.GITHUB_REPO; // format: "username/repo"

    if (!token || !repoFull) {
        return res.status(500).json({ message: "Server environment variables GITHUB_TOKEN or GITHUB_REPO are missing." });
    }

    const [owner, repo] = repoFull.split("/");
    const octokit = new Octokit({ auth: token });

    // Generate a unique filename based on timestamp
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, "-");
    const filename = `${timestamp}_${data.name || "entry"}.json`;
    const path = `content/submissions/${type}/${filename}`;

    // Prepare content
    const contentBody = {
        date: now.toISOString(),
        ...data
    };

    // Add default status fields based on type
    if (type === 'foster' || type === 'hrr_ad') {
        contentBody.process_status = "未対応";
    } else if (type === 'support') {
        contentBody.payment_status = "未入金";
    }

    const contentBase64 = Buffer.from(JSON.stringify(contentBody, null, 2)).toString("base64");

    try {
        await octokit.rest.repos.createOrUpdateFileContents({
            owner,
            repo,
            path,
            message: `Form submission: ${type} from ${data.name || 'Anonymous'}`,
            content: contentBase64,
        });
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("GitHub API Error:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
