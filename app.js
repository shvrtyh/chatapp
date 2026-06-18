const SUPABASE_URL =
  "https://nwfveigygcvlizkpeezm.supabase.co";

const API_KEY =
  "YOUR_ANON_KEY_HERE";

async function loadPosts() {
    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/posts?select=*&order=created_at.desc`,
        {
            headers: {
                apikey: API_KEY,
                Authorization: `Bearer ${API_KEY}`
            }
        }
    );

    const posts = await response.json();

    const container = document.getElementById("posts");
    container.innerHTML = "";

    for (const post of posts) {

        const commentsResponse = await fetch(
            `${SUPABASE_URL}/rest/v1/comments?post_id=eq.${post.id}&select=*`,
            {
                headers: {
                    apikey: API_KEY,
                    Authorization: `Bearer ${API_KEY}`
                }
            }
        );

        const comments = await commentsResponse.json();

        const postDiv = document.createElement("div");
        postDiv.className = "post";

        postDiv.innerHTML = `
            <img src="${post.image_url}" alt="">
            <div class="caption">${post.caption || ""}</div>

            <div class="comments">

                ${comments.map(c => `
                    <div class="comment">
                        ${c.comment}
                    </div>
                `).join("")}

                <div class="comment-input">
                    <input
                        id="comment-${post.id}"
                        placeholder="Write comment..."
                    >
                    <button onclick="addComment('${post.id}')">
                        Send
                    </button>
                </div>

            </div>
        `;

        container.appendChild(postDiv);
    }
}

async function createPost() {

    const imageUrl =
        document.getElementById("imageUrl").value;

    const caption =
        document.getElementById("caption").value;

    await fetch(
        `${SUPABASE_URL}/rest/v1/posts`,
        {
            method: "POST",
            headers: {
                apikey: API_KEY,
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
                Prefer: "return=minimal"
            },
            body: JSON.stringify({
                image_url: imageUrl,
                caption: caption
            })
        }
    );

    document.getElementById("imageUrl").value = "";
    document.getElementById("caption").value = "";

    loadPosts();
}

async function addComment(postId) {

    const input =
        document.getElementById(`comment-${postId}`);

    const comment = input.value;

    if (!comment.trim()) return;

    await fetch(
        `${SUPABASE_URL}/rest/v1/comments`,
        {
            method: "POST",
            headers: {
                apikey: API_KEY,
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
                Prefer: "return=minimal"
            },
            body: JSON.stringify({
                post_id: postId,
                comment: comment
            })
        }
    );

    loadPosts();
}

loadPosts();
